<template>
  <div class="explore-page">
    <!-- Main Container -->
    <el-container class="main-container">
      <!-- Desktop Filter Sidebar -->
      <el-aside v-show="!isMobile" width="300px" class="filter-sidebar">
        <el-card shadow="never" class="filter-card">
          <template #header>
            <div class="filter-header">
              <h3>Filters</h3>
            </div>
          </template>

          <!-- Category Section with Multi-Select Tree -->
          <div class="filter-section">
            <h4 class="section-title-student">Category (多選)</h4>
            <CategoryTreeMulti
              v-model="selectedCategories"
              :categories="categories"
              @filter-change="handleCategoryFilterChange"
            />
          </div>

          <!-- Ratings Section -->
          <div class="filter-section">
            <h4 class="section-title-student">Ratings</h4>
            <RatingOptions v-model="selectedRating" />
          </div>
        </el-card>
      </el-aside>

      <!-- Main Content -->
      <el-main class="main-content">
        <!-- Mobile Filter Button -->
        <div v-if="isMobile" class="mobile-filter-btn">
          <el-button
            type="primary"
            :icon="Filter"
            @click="drawerVisible = true"
            size="large"
          >
            Filters
          </el-button>
        </div>

        <!-- Breadcrumb -->
        <el-breadcrumb separator="/" class="breadcrumb">
          <el-breadcrumb-item>All Courses</el-breadcrumb-item>
          <el-breadcrumb-item>
            {{ breadcrumbText }}
          </el-breadcrumb-item>
        </el-breadcrumb>

        <!-- Sort and Count Bar -->
        <div class="sort-count-bar">
          <el-select v-model="sortBy" placeholder="排序" size="default" class="sort-select">
            <el-option label="最熱門" value="popular" />
            <el-option label="最新課程" value="latest" />
            <el-option label="最舊課程" value="oldest" />
            <el-option label="最不熱門" value="unpopular" />
            <el-option label="價格由低到高" value="price_low" />
            <el-option label="價格由高到低" value="price_high" />
          </el-select>
          <span class="course-count">共有 {{ coursesData.totalElements }} 堂課程</span>
        </div>

        <!-- Active Filters Bar -->
        <ActiveFiltersBar
          :search-keyword="searchQuery"
          :selected-categories="selectedCategories"
          :selected-tags="selectedTags"
          :selected-rating="selectedRating"
          :categories="categories"
          @remove-keyword="handleRemoveSearchKeyword"
          @remove-category="handleRemoveCategory"
          @remove-tag="handleRemoveTag"
          @remove-rating="handleRemoveRating"
          @clear-all="handleClearAllFilters"
        />

        <!-- Loading State -->
        <div v-if="loading" class="loading-wrapper">
          <el-skeleton :rows="3" animated />
          <el-skeleton :rows="3" animated />
          <el-skeleton :rows="3" animated />
        </div>

        <!-- Course Grid -->
        <el-row v-else :gutter="24" class="course-grid">
          <el-col
            v-for="course in paginatedCourses"
            :key="course.id"
            :xs="24"
            :sm="12"
            :md="12"
            :lg="8"
            :xl="6"
            class="course-col"
          >
            <ExploreCourseCard
              :course="course"
              @toggle-wishlist="toggleWishlist"
              @tag-click="handleTagClick"
            />
          </el-col>
        </el-row>

        <!-- Empty State -->
        <el-empty
          v-if="!loading && coursesData.empty"
          description="No courses found"
          :image-size="200"
        />

        <!-- Pagination -->
        <div v-if="!loading && !coursesData.empty" class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="coursesData.totalElements"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </el-main>
    </el-container>

    <!-- Mobile Filter Drawer -->
    <el-drawer
      v-model="drawerVisible"
      title="Filters"
      direction="ltr"
      size="80%"
    >
      <div class="drawer-content">
        <!-- Category Section -->
        <div class="filter-section">
          <h4 class="section-title-student">Category</h4>
          <CategoryRadioGroup v-model="selectedCategory" />
        </div>

        <!-- Ratings Section -->
        <div class="filter-section">
          <h4 class="section-title-student">Ratings</h4>
          <RatingOptions v-model="selectedRating" />
        </div>

        <!-- Apply Button -->
        <div class="drawer-footer">
          <el-button type="primary" size="large" @click="drawerVisible = false" class="apply-btn">
            Apply Filters
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Filter } from '@element-plus/icons-vue'
import ExploreCourseCard from '@/components/student/Explore/ExploreCard/ExploreCourseCard.vue'
import CategoryTreeMulti from '@/components/student/Explore/FilterDrawer/CategoryTreeMulti.vue'
import CategoryRadioGroup from '@/components/student/Explore/FilterDrawer/CategoryRadioGroup.vue'
import RatingOptions from '@/components/student/Explore/FilterDrawer/RatingOptions.vue'
import ActiveFiltersBar from '@/components/student/Explore/ActiveFiltersBar.vue'
import { useWishlistStore } from '@/stores/wishlist'
import { useUserStore } from '@/stores/user'
import { useExploreStore } from '@/stores/explore'

// Router
const route = useRoute()
const router = useRouter()

// Stores
const wishlistStore = useWishlistStore()
const userStore = useUserStore()
const exploreStore = useExploreStore()

// Responsive state
const isMobile = ref(false)
const drawerVisible = ref(false)

// Filter states
const selectedCategories = ref([])
const selectedRating = ref(0)
const selectedTags = ref([])
const searchQuery = ref('')
const sortBy = ref('popular') // 'popular' or 'latest'

// 分類資料狀態（使用 computed 從 store 取得）
const categories = computed(() => exploreStore.cachedCategories || [])
const categoriesLoading = computed(() => exploreStore.categoriesLoading)

// API 相關狀態（使用 computed 從 store 取得載入狀態）
const loading = computed(() => exploreStore.coursesLoading)
const coursesData = ref({
  content: [],
  number: 0,
  size: 12,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
  empty: true
})

// 建立 category ID 到 name 的映射
const buildCategoryIdToNameMap = () => {
  const map = new Map()
  const traverse = (cats) => {
    cats.forEach(cat => {
      map.set(cat.id, cat.name)
      if (cat.children && cat.children.length > 0) {
        traverse(cat.children)
      }
    })
  }
  const cats = categories.value || []
  traverse(cats)
  return map
}

const categoryIdToName = computed(() => buildCategoryIdToNameMap())

// Pagination states（後端分頁，從 1 開始顯示但 API 從 0 開始）
const currentPage = ref(1)
const pageSize = ref(12)

// 直接使用後端的資料格式，不做欄位名稱轉換
// ExploreCourseCard 和 CourseInfo 元件會使用這些欄位
const allCourses = computed(() => {
  return coursesData.value.content.map(course => ({
    ...course, // 保留所有後端欄位
    isWishlisted: wishlistStore.hasItem(course.id) // 添加願望清單狀態
  }))
})

// Computed: Breadcrumb text
const breadcrumbText = computed(() => {
  if (selectedCategories.value.length === 0) {
    return 'All Categories'
  }

  const categoryNames = selectedCategories.value
    .map(id => categoryIdToName.value.get(id))
    .filter(Boolean)

  if (categoryNames.length === 0) {
    return 'All Categories'
  }

  if (categoryNames.length === 1) {
    return categoryNames[0]
  }

  // 多個分類時，顯示前兩個，其餘用數字表示
  if (categoryNames.length === 2) {
    return categoryNames.join(', ')
  }

  return `${categoryNames[0]}, ${categoryNames[1]} +${categoryNames.length - 2} more`
})

// 後端已處理篩選，直接使用 API 回傳的資料
const filteredCourses = computed(() => allCourses.value)

// 後端已處理分頁，直接使用 API 回傳的資料
const paginatedCourses = computed(() => allCourses.value)

// 載入課程資料（使用 Store 的快取功能）
const loadCourses = async () => {
  try {
    const params = {
      page: currentPage.value - 1, // API 從 0 開始
      size: pageSize.value,
      sort: sortBy.value
    }

    // 關鍵字搜尋（優先使用 searchQuery，如果沒有則使用第一個 selectedTag）
    if (searchQuery.value) {
      params.keyword = searchQuery.value
    } else if (selectedTags.value.length > 0) {
      // 如果沒有搜尋關鍵字但有選擇的 tags，使用第一個 tag 作為 keyword
      params.keyword = selectedTags.value[0]
    }

    // 分類篩選（支援多選，傳遞 categoryIds 陣列）
    if (selectedCategories.value.length > 0) {
      params.categoryIds = selectedCategories.value
    }

    // 注意：後端 CourseSearchDto 只支援 keyword 和 categoryIds
    // tagIds 和 maxRatings 不在後端 API 規格中，已移除

    // 使用 Store 的快取載入方法
    const result = await exploreStore.loadCourses(params)
    coursesData.value = result
  } catch (error) {
    console.error('載入課程失敗:', error)
    ElMessage.error('載入課程失敗，請稍後再試')
    // 設定空資料
    coursesData.value = {
      content: [],
      number: 0,
      size: 12,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
      empty: true
    }
  }
}

// Methods
const handleCategoryFilterChange = (payload) => {
  console.log('Category filter changed:', payload)
  currentPage.value = 1
  loadCourses()
}

const handleSearch = (query) => {
  searchQuery.value = query
  currentPage.value = 1
  loadCourses()
}

const handleTagClick = (tag) => {
  // 將 tag 加入到 selectedTags 陣列（不設定 searchQuery，避免重複顯示）
  if (!selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag)
    currentPage.value = 1
    loadCourses()
  }
}

const removeTag = (tag) => {
  // Tag 篩選功能等後端 API 支援後再實作
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  }
  currentPage.value = 1
}

const handleRemoveCategory = (categoryId) => {
  console.log('移除 category:', categoryId)
  console.log('移除前:', selectedCategories.value)
  const index = selectedCategories.value.indexOf(categoryId)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  }
  console.log('移除後:', selectedCategories.value)
  currentPage.value = 1
  loadCourses()
}

const handleRemoveTag = (tag) => {
  removeTag(tag)
  currentPage.value = 1
  loadCourses()
}

const handleRemoveRating = () => {
  selectedRating.value = 0
  currentPage.value = 1
  loadCourses()
}

const handleRemoveSearchKeyword = () => {
  // 清除搜尋關鍵字
  searchQuery.value = ''

  // 同步 URL（移除 keyword 參數）
  const newQuery = { ...route.query }
  delete newQuery.keyword
  delete newQuery.search // 也移除舊的 search 參數
  delete newQuery.tag // 也移除 tag 參數
  router.replace({ query: newQuery })

  // 重新載入課程
  currentPage.value = 1
  loadCourses()
}

const handleClearAllFilters = () => {
  selectedCategories.value = []
  selectedTags.value = []
  selectedRating.value = 0
  searchQuery.value = ''

  // 清除所有 URL 參數
  router.replace({ query: {} })

  currentPage.value = 1
  loadCourses()
}

const toggleWishlist = async (courseId) => {
  const course = coursesData.value.content.find(c => c.id === courseId)
  if (!course) return

  // 檢查是否已在願望清單中
  if (wishlistStore.hasItem(courseId)) {
    // 從願望清單移除（會呼叫後端 API）
    await wishlistStore.removeItem(courseId)
  } else {
    // 加入願望清單（會呼叫後端 API）
    await wishlistStore.addItem({
      id: courseId,
      title: course.title,
      instructor: course.instructorName,
      price: course.price,
      cover_image_url: course.coverImageUrl
    })
  }
}

const handlePageChange = () => {
  loadCourses()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Responsive handling
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

// 監聽篩選條件變化
watch([selectedCategories, selectedRating, sortBy], () => {
  currentPage.value = 1
  loadCourses()
}, { deep: true })

// 監聽 URL query 變化（當使用者在 Header 搜尋時或從 Footer 導航時）
watch(() => route.query, (newQuery, oldQuery) => {
  // 處理關鍵字變化
  const keyword = newQuery.keyword || newQuery.search || newQuery.tag
  if (keyword && keyword !== searchQuery.value) {
    searchQuery.value = keyword
    currentPage.value = 1
    loadCourses()
  }

  // 處理分類變化
  if (newQuery.categoryId) {
    const categoryId = parseInt(newQuery.categoryId)
    if (!isNaN(categoryId) && !selectedCategories.value.includes(categoryId)) {
      selectedCategories.value = [categoryId]
      currentPage.value = 1
      loadCourses()
    }
  } else if (oldQuery?.categoryId && !newQuery.categoryId) {
    // 當 URL 中沒有 categoryId 但之前有時，清除分類篩選
    if (selectedCategories.value.length > 0) {
      selectedCategories.value = []
      currentPage.value = 1
      loadCourses()
    }
  }
}, { deep: true })

onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  // 先從 localStorage 載入願望清單資料（快速顯示）
  wishlistStore.loadFromStorage()

  // 讀取 URL query 參數
  const query = route.query

  // 優先使用 keyword，其次 search，最後 tag
  const keyword = query.keyword || query.search || query.tag
  if (keyword) {
    searchQuery.value = keyword
    console.log('從 URL 讀取搜尋關鍵字:', keyword)
  }

  if (query.categoryId) {
    const categoryId = parseInt(query.categoryId)
    if (!isNaN(categoryId)) {
      selectedCategories.value = [categoryId]
      console.log('從 URL 讀取分類 ID:', categoryId)
    }
  }

  // 🚀 並行載入分類樹和課程資料（效能優化）
  try {
    const courseParams = {
      page: currentPage.value - 1,
      size: pageSize.value,
      sort: sortBy.value
    }

    // 添加篩選參數
    if (searchQuery.value) {
      courseParams.keyword = searchQuery.value
    }
    if (selectedCategories.value.length > 0) {
      courseParams.categoryIds = selectedCategories.value
    }
    // 注意：後端不支援 maxRatings 參數

    // 使用 Store 的並行載入方法
    const { courses } = await exploreStore.loadAllData(courseParams)
    console.log(courses);

    coursesData.value = courses
  } catch (error) {
    console.error('並行載入失敗:', error)
    ElMessage.error('載入資料失敗，請稍後再試')
  }

  // 如果已登入，從後端載入最新資料（不阻塞主流程）
  if (userStore.isAuthenticated) {
    wishlistStore.loadWishlistItems().catch(error => {
      console.error('載入願望清單失敗:', error)
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.explore-page {
  min-height: 100vh;
  background: #FCF9F4;
}

.loading-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.main-container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0;
}

.filter-sidebar {
  background: transparent;
  padding: 24px 16px;
}

.filter-card {
  border-radius: 12px;
  border: 1px solid #e8e8e8;
}

.filter-card :deep(.el-card__header) {
  padding: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.filter-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
}

.filter-section {
  margin-bottom: 32px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.section-title-student {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 16px 0;
}

.main-content {
  padding: 32px 24px;
  background: transparent;
}

.mobile-filter-btn {
  margin-bottom: 20px;
}

.mobile-filter-btn .el-button {
  width: 100%;
  border-radius: 8px;
  background: var(--capy-primary);
  border-color: var(--capy-primary);
}

.breadcrumb {
  margin-bottom: 20px;
  font-size: 15px;
}

.breadcrumb :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: var(--capy-primary);
  font-weight: 600;
}

.sort-count-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 12px 16px;
  background: var(--capy-bg-surface);
  border-radius: var(--capy-radius-base);
  border: 1px solid var(--capy-border-lighter);
}

.sort-select {
  width: 160px;
}

.course-count {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
  font-weight: var(--capy-font-weight-medium);
}

.course-grid {
  margin-bottom: 40px;
}

.course-col {
  margin-bottom: 24px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.pagination-wrapper :deep(.el-pagination) {
  gap: 8px;
}

.pagination-wrapper :deep(.el-pager li.is-active) {
  background: var(--capy-primary);
  color: #fff;
}

.pagination-wrapper :deep(.el-pager li:hover) {
  color: var(--capy-primary);
}

.drawer-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer-footer {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.apply-btn {
  width: 100%;
  background: var(--capy-primary);
  border-color: var(--capy-primary);
  border-radius: 8px;
  font-weight: 600;
}

.apply-btn:hover {
  background: var(--capy-primary-dark);
  border-color: var(--capy-primary-dark);
}

/* RWD */
@media (max-width: 768px) {
  .main-content {
    padding: 20px 16px;
  }

  .breadcrumb {
    font-size: 14px;
  }

  .course-col {
    margin-bottom: 16px;
  }
}
</style>
