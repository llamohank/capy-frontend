<template>
  <div class="my-learning-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">我的課程</h1>
      <div class="header-actions">
        <el-dropdown @command="handleFilterChange" trigger="click">
          <el-button type="primary" class="filter-status-btn">
            <el-icon class="filter-icon"><Filter /></el-icon>
            {{ currentFilterLabel }}
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="all" :class="{ active: filterStatus === 'all' }">
                全部狀態
              </el-dropdown-item>
              <el-dropdown-item command="ongoing" :class="{ active: filterStatus === 'ongoing' }">
                進行中
              </el-dropdown-item>
              <el-dropdown-item command="completed" :class="{ active: filterStatus === 'completed' }">
                已完課
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- Course List -->
    <div class="course-list">
      <MyLearningCourseCard
        v-for="course in myLearningContent"
        :key="course.progressId"
        :course="course"
        @open-rate-dialog="handleOpenRateDialog"
        @card-click="goToCourse"
      />
    </div>

    <!-- Empty State -->
    <el-empty
      v-if="myLearningContent.length === 0 && !loading"
      description="尚無課程"
      :image-size="120"
    />

    <!-- Loading State -->
    <div v-if="loading" class="loading-wrapper">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>載入中...</span>
    </div>

    <!-- Pagination -->
    <div v-if="totalElements > 0" class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="totalElements"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>

    <!-- Rating Dialog -->
    <CourseRatingDialog
      v-model="showRatingDialog"
      :course-info="selectedCourseInfo"
      :initial-rating="initialRating"
      :initial-comment="initialComment"
      @review-submitted="handleReviewSubmitted"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Filter, Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useStudentCenterStore } from '@/stores/studentCenter'
import MyLearningCourseCard from '@/components/student/StudentCenter/MyLearning/MyLearningCourseCard.vue'
import CourseRatingDialog from '@/components/student/StudentCenter/MyLearning/CourseRatingDialog.vue'
import { rateCourse } from '@/api/student/studentCenter'

const router = useRouter()
const studentCenterStore = useStudentCenterStore()

// 狀態管理
const filterStatus = ref('all')
const currentPage = ref(1)
const pageSize = ref(5)
const sortBy = ref('lastWatch,desc')

// Rating dialog state
const showRatingDialog = ref(false)
const selectedProgressId = ref(null)
const selectedCourseInfo = ref(null)
const initialRating = ref(0)
const initialComment = ref('')

/**
 * 從 store 獲取資料
 */
const myLearningContent = computed(() => studentCenterStore.myLearning.content)
const totalElements = computed(() => studentCenterStore.myLearning.totalElements)
const totalPages = computed(() => studentCenterStore.myLearning.totalPages)
const loading = computed(() => studentCenterStore.myLearningLoading)

/**
 * Current filter label for button display
 */
const currentFilterLabel = computed(() => {
  const labels = {
    all: '全部狀態',
    ongoing: '進行中',
    completed: '已完課'
  }
  return labels[filterStatus.value] || '全部狀態'
})

/**
 * 載入我的學習資料
 */
const loadMyLearning = async () => {
  try {
    await studentCenterStore.loadMyLearning({
      page: currentPage.value - 1, // 後端從 0 開始
      size: pageSize.value,
      status: filterStatus.value,
      sort: sortBy.value
    })
  } catch (error) {
    console.error('載入我的學習資料失敗:', error)
    ElMessage.error('載入課程失敗，請稍後再試')
  }
}

/**
 * Handle filter change
 */
const handleFilterChange = (command) => {
  filterStatus.value = command
  currentPage.value = 1
  loadMyLearning()
}

/**
 * Handle page change
 */
const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
  loadMyLearning()
}

/**
 * Navigate to course learning page
 * 跳轉到播放頁面：如果有上次觀看的單元則跳到該單元，否則跳到第一個單元
 */
const goToCourse = async (courseId) => {
  try {
    // 找到對應的課程資料
    const course = myLearningContent.value.find(c => c.courseId === courseId)

    if (!course) {
      ElMessage.error('找不到課程資訊')
      return
    }

    // 如果有上次觀看的單元 ID，直接跳轉
    if (course.lastWatchedLessonId) {
      router.push({
        name: 'courseLearning',
        params: {
          courseId: courseId,
          lessonId: course.lastWatchedLessonId
        }
      })
      return
    }

    // 否則需要取得課程章節資料，跳轉到第一個單元
    // 動態導入 API
    const { getCourseSections } = await import('@/api/student/courseLearning')
    const sectionsData = await getCourseSections(courseId)

    // 找到第一個章節的第一個單元
    // 注意：後端回傳的是 section（單數），不是 sections（複數）
    const sections = sectionsData.section || sectionsData.sections || []

    if (sections.length > 0) {
      const firstSection = sections[0]
      if (firstSection.lessons && firstSection.lessons.length > 0) {
        const firstLesson = firstSection.lessons[0]
        router.push({
          name: 'courseLearning',
          params: {
            courseId: courseId,
            lessonId: firstLesson.id
          }
        })
        return
      }
    }

    // 如果都沒有，顯示錯誤
    ElMessage.error('課程尚無可播放的單元')
  } catch (error) {
    console.error('跳轉到課程失敗:', error)
    ElMessage.error('無法開啟課程，請稍後再試')
  }
}

/**
 * Handle open rating dialog
 */
const handleOpenRateDialog = ({ course, initialRating: rating }) => {
  selectedProgressId.value = course.progressId
  selectedCourseInfo.value = {
    courseId: course.courseId,
    courseTitle: course.courseTitle,
    coverImageUrl: course.coverImageUrl,
    instructorName: course.instructorName
  }
  initialRating.value = rating || course.rating || 0
  initialComment.value = course.rateComment || ''
  showRatingDialog.value = true
}

/**
 * Handle review submitted
 */
const handleReviewSubmitted = async (reviewData) => {
  try {
    // 確保有 courseId
    if (!selectedCourseInfo.value?.courseId) {
      ElMessage.error('課程資訊錯誤，請重試')
      return
    }

    // 提交評分（使用新的 rateCourse API，基於 courseId）
    await rateCourse({
      courseId: selectedCourseInfo.value.courseId,
      rating: reviewData.rating,
      comment: reviewData.comment
    })

    // 重新載入課程列表以更新評分狀態
    await loadMyLearning()

    // Reset dialog state
    selectedProgressId.value = null
    selectedCourseInfo.value = null
    initialRating.value = 0
    initialComment.value = ''

    ElMessage.success('評價已提交')
  } catch (error) {
    console.error('提交評價失敗:', error)

    // 處理特定錯誤訊息
    if (error.response?.status === 400) {
      ElMessage.error('已購買後才能評價')
    } else if (error.response?.status === 409) {
      ElMessage.error('已經評過此課程')
      // 重新載入以同步狀態
      await loadMyLearning()
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      ElMessage.error('請先登入')
    } else {
      ElMessage.error('提交評價失敗，請稍後再試')
    }
  }
}

// 組件掛載時載入資料
onMounted(() => {
  loadMyLearning()
})
</script>

<style lang="scss" scoped>
.my-learning-page {
  padding: 0;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  @include mobile {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @include mobile {
    font-size: 22px;
  }

  @include small-mobile {
    font-size: 20px;
  }
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;

  @include mobile {
    width: 100%;
    justify-content: flex-end;
  }
}

.filter-status-btn {
  padding: 10px 20px;
  height: 40px;
  background: var(--capy-primary);
  border-color: var(--capy-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover,
  &:focus {
    background: var(--capy-primary-dark);
    border-color: var(--capy-primary-dark);
  }

  @include small-mobile {
    padding: 8px 16px;
    height: 36px;
    font-size: 14px;
  }
}

.filter-icon {
  font-size: 16px;
}

/* Dropdown Menu */
:deep(.el-dropdown-menu__item) {
  padding: 10px 20px;
  font-size: 14px;

  &.active {
    color: var(--capy-primary);
    font-weight: 600;
  }

  &:hover {
    background: #f5f5f5;
  }
}

/* Course List */
.course-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;

  @include mobile {
    gap: 16px;
  }
}

/* Loading State */
.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 20px;
  color: var(--capy-text-secondary);

  .el-icon {
    font-size: 32px;
    color: var(--capy-primary);
  }

  span {
    font-size: 14px;
  }
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

:deep(.el-pagination) {
  gap: 8px;

  button,
  .el-pager li {
    min-width: 36px;
    height: 36px;
    line-height: 36px;
    border-radius: 6px;
    font-weight: 500;
  }

  .el-pager li.is-active {
    background: #1a1a1a;
    color: white;
  }

  .el-pager li:hover {
    color: var(--capy-primary);
  }
}
</style>
