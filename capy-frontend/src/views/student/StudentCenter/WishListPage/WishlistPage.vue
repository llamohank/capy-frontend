<template>
  <div class="wishlist-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">我的願望清單</h1>
      <div class="header-actions">
        <el-dropdown v-if="wishlistCourses.length > 0" trigger="click" @command="handleSort">
          <el-button type="primary" class="sort-button">
            <el-icon class="sort-icon"><Sort /></el-icon>
            {{ sortLabels[sortBy] }}
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="newest" :class="{ active: sortBy === 'newest' }">
                由新到舊
              </el-dropdown-item>
              <el-dropdown-item command="oldest" :class="{ active: sortBy === 'oldest' }">
                由舊到新
              </el-dropdown-item>
              <el-dropdown-item command="titleAsc" :class="{ active: sortBy === 'titleAsc' }">
                標題 A-Z
              </el-dropdown-item>
              <el-dropdown-item command="titleDesc" :class="{ active: sortBy === 'titleDesc' }">
                標題 Z-A
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- Empty State -->
    <el-empty
      v-if="wishlistCourses.length === 0"
      description="您的願望清單是空的"
      :image-size="120"
    >
      <el-button type="primary" @click="goToExplore">
        探索課程
      </el-button>
    </el-empty>

    <!-- Course Grid -->
    <div v-else class="courses-grid">
      <ExploreCourseCard
        v-for="course in paginatedCourses"
        :key="course.id"
        :course="course"
        @toggle-wishlist="handleToggleWishlist"
      />
    </div>

    <!-- Pagination -->
    <div v-if="wishlistCourses.length > 0" class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="wishlistStore.pagination.totalElements"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Sort } from '@element-plus/icons-vue'
import ExploreCourseCard from '@/components/student/Explore/ExploreCard/ExploreCourseCard.vue'
import { useWishlistStore } from '@/stores/wishlist'

const router = useRouter()
const wishlistStore = useWishlistStore()

const currentPage = ref(1)
const pageSize = ref(6)
const sortBy = ref('newest')

// 排序標籤
const sortLabels = {
  'newest': '由新到舊',
  'oldest': '由舊到新',
  'titleAsc': '標題 A-Z',
  'titleDesc': '標題 Z-A'
}

// 排序映射到後端 API 格式
const sortMapping = {
  'newest': 'addedAt,desc',
  'oldest': 'addedAt,asc',
  'titleAsc': 'title,asc',
  'titleDesc': 'title,desc'
}

// 將 wishlist store 的資料轉換為 ExploreCourseCard 需要的格式
const wishlistCourses = computed(() => {
  return wishlistStore.items.map(item => ({
    id: item.courseId,
    title: item.title,
    instructor: item.instructor,
    coverImageUrl: item.coverImageUrl,
    rating: item.averageRating || 0, // 使用後端資料
    reviewCount: item.reviewCount || 0, // 使用後端資料
    enrollmentCount: item.enrollmentCount || 0, // 使用後端資料
    price: item.price,
    originalPrice: item.price * 1.5, // 預設原價
    isWishlisted: true,
    tags: item.tags || [], // 使用後端資料
    categories: item.categories || [], // 使用後端資料
    status: item.status,
    publishDate: item.publishDate
  }))
})

// 使用後端分頁，直接顯示當前頁的課程
const paginatedCourses = computed(() => {
  return wishlistCourses.value
})

const handleSort = async (command) => {
  sortBy.value = command
  currentPage.value = 1
  await loadWishlist()
}

const handleToggleWishlist = async (courseId) => {
  // 從願望清單 store 中移除（會呼叫後端 API）
  const success = await wishlistStore.removeItem(courseId)

  if (success) {
    ElMessage.success('已從願望清單移除')

    // 檢查是否刪除了當前頁的最後一個項目
    const isLastItemOnPage = wishlistCourses.value.length === 1
    const isNotFirstPage = currentPage.value > 1

    // 如果刪除的是當前頁的最後一個項目且不是第一頁，跳到前一頁
    if (isLastItemOnPage && isNotFirstPage) {
      currentPage.value -= 1
    }

    // 重新載入當前頁
    await loadWishlist()
  }
}

const handlePageChange = async (page) => {
  currentPage.value = page
  await loadWishlist()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * 載入願望清單資料（使用 Student Center 專用 API）
 */
const loadWishlist = async () => {
  try {
    await wishlistStore.loadCenterWishlistFromAPI({
      page: currentPage.value - 1, // 後端從 0 開始
      size: pageSize.value,
      sort: sortMapping[sortBy.value]
    })
  } catch (error) {
    console.error('載入願望清單失敗:', error)
  }
}

const goToExplore = () => {
  router.push('/explore')
}

// 載入願望清單資料
onMounted(async () => {
  // 先從 localStorage 載入（快速顯示）
  wishlistStore.loadFromStorage()

  // 然後從後端載入最新資料
  await loadWishlist()
})

// 監聽排序變化
watch(sortBy, async () => {
  currentPage.value = 1
  await loadWishlist()
})
</script>

<style scoped>
.wishlist-page {
  padding: 0;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.sort-button {
  padding: 10px 20px;
  height: 40px;
  background: var(--capy-primary);
  border-color: var(--capy-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-button:hover,
.sort-button:focus {
  background: var(--capy-primary-dark);
  border-color: var(--capy-primary-dark);
}

.sort-icon {
  font-size: 16px;
}

/* Dropdown Menu */
:deep(.el-dropdown-menu__item) {
  padding: 10px 20px;
  font-size: 14px;
}

:deep(.el-dropdown-menu__item.active) {
  color: var(--capy-primary);
  font-weight: 600;
}

:deep(.el-dropdown-menu__item:hover) {
  background: #f5f5f5;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

:deep(.el-pagination) {
  gap: 8px;
}

:deep(.el-pagination button),
:deep(.el-pager li) {
  min-width: 36px;
  height: 36px;
  line-height: 36px;
  border-radius: 6px;
  font-weight: 500;
}

:deep(.el-pager li.is-active) {
  background: #1a1a1a;
  color: white;
}

:deep(.el-pager li:hover) {
  color: var(--capy-primary);
}

/* Empty State */
:deep(.el-empty) {
  padding: 60px 0;
}

:deep(.el-button--primary) {
  background: var(--capy-primary);
  border-color: var(--capy-primary);
}

:deep(.el-button--primary:hover) {
  background: var(--capy-primary-dark);
  border-color: var(--capy-primary-dark);
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .page-title {
    font-size: 22px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .courses-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 20px;
  }

  .sort-button {
    padding: 8px 16px;
    height: 36px;
    font-size: 14px;
  }
}
</style>
