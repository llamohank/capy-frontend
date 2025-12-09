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
            {{ breadcrumbText }} ({{ coursesData.totalElements }} Courses)
          </el-breadcrumb-item>
        </el-breadcrumb>

        <!-- Selected Tags -->
        <div v-if="selectedTags.length > 0" class="selected-tags">
          <el-tag
            v-for="tag in selectedTags"
            :key="tag"
            closable
            type="info"
            size="large"
            @close="removeTag(tag)"
          >
            {{ tag }}
          </el-tag>
        </div>

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
import { ElMessage } from 'element-plus'
import { Filter } from '@element-plus/icons-vue'
import ExploreHeader from '@/components/student/Explore/ExploreHeader.vue'
import ExploreCourseCard from '@/components/student/Explore/ExploreCard/ExploreCourseCard.vue'
import CategoryTreeMulti from '@/components/student/Explore/FilterDrawer/CategoryTreeMulti.vue'
import CategoryRadioGroup from '@/components/student/Explore/FilterDrawer/CategoryRadioGroup.vue'
import RatingOptions from '@/components/student/Explore/FilterDrawer/RatingOptions.vue'
import { categories } from '@/mockData'
import { useWishlistStore } from '@/stores/wishlist'
import { useUserStore } from '@/stores/user'
import { searchCourses } from '@/api/student/explore'

// Stores
const wishlistStore = useWishlistStore()
const userStore = useUserStore()

// Responsive state
const isMobile = ref(false)
const drawerVisible = ref(false)

// Filter states
const selectedCategories = ref([])
const selectedRating = ref(0)
const selectedTags = ref([])
const searchQuery = ref('')
const sortBy = ref('popular') // 'popular' or 'latest'

// API 相關狀態
const loading = ref(false)
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
  traverse(categories)
  return map
}

const categoryIdToName = buildCategoryIdToNameMap()

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
    .map(id => categoryIdToName.get(id))
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

// 載入課程資料
const loadCourses = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value - 1, // API 從 0 開始
      size: pageSize.value,
      sort: sortBy.value
    }

    // 關鍵字搜尋
    if (searchQuery.value) {
      params.keyword = searchQuery.value
    }

    // 分類篩選（只取第一個分類，因為後端只支援單一 categoryId）
    if (selectedCategories.value.length > 0) {
      params.categoryId = selectedCategories.value[0]
    }

    // 評分篩選
    if (selectedRating.value > 0) {
      params.maxRating = selectedRating.value
    }

    const result = await searchCourses(params)
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
  } finally {
    loading.value = false
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
  // Tag 篩選功能等後端 API 支援後再實作
  // 目前將 tag 轉換為關鍵字搜尋（因為後端 keyword 會搜尋 tags）
  searchQuery.value = tag
  currentPage.value = 1
  loadCourses()
  ElMessage.info(`搜尋標籤：${tag}`)
}

const removeTag = (tag) => {
  // Tag 篩選功能等後端 API 支援後再實作
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  }
  currentPage.value = 1
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

onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  // 先從 localStorage 載入願望清單資料（快速顯示）
  wishlistStore.loadFromStorage()

  // 載入課程資料
  await loadCourses()

  // 如果已登入，從後端載入最新資料
  const userStore = useUserStore()
  if (userStore.isAuthenticated) {
    try {
      await wishlistStore.loadWishlistFromAPI({
        page: 0,
        size: 100, // 載入較多項目以便檢查課程是否在願望清單中
        sort: 'id,desc'
      })
    } catch (error) {
      console.error('載入願望清單失敗:', error)
    }
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
  background: #7ec8a3;
  border-color: #7ec8a3;
}

.breadcrumb {
  margin-bottom: 20px;
  font-size: 15px;
}

.breadcrumb :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #7ec8a3;
  font-weight: 600;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
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
  background: #7ec8a3;
  color: #fff;
}

.pagination-wrapper :deep(.el-pager li:hover) {
  color: #7ec8a3;
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
  background: #7ec8a3;
  border-color: #7ec8a3;
  border-radius: 8px;
  font-weight: 600;
}

.apply-btn:hover {
  background: #6bb890;
  border-color: #6bb890;
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
