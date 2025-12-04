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
              <el-dropdown-item command="in_progress" :class="{ active: filterStatus === 'in_progress' }">
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
        v-for="enrollment in filteredEnrollments"
        :key="enrollment.id"
        :enrollment="enrollment"
        @open-rate-dialog="handleOpenRateDialog"
        @card-click="goToCourse"
      />
    </div>

    <!-- Empty State -->
    <el-empty
      v-if="filteredEnrollments.length === 0"
      description="No courses found"
      :image-size="120"
    />

    <!-- Pagination -->
    <div v-if="filteredEnrollments.length > 0" class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="filteredEnrollments.length"
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Filter } from '@element-plus/icons-vue'
import MyLearningCourseCard from '@/components/student/StudentCenter/MyLearning/MyLearningCourseCard.vue'
import CourseRatingDialog from '@/components/student/StudentCenter/MyLearning/CourseRatingDialog.vue'
import { enrollments } from '@/mockData'

const router = useRouter()

const filterStatus = ref('all')
const currentPage = ref(1)
const pageSize = ref(6)

// Rating dialog state
const showRatingDialog = ref(false)
const selectedEnrollmentId = ref(null)
const selectedCourseInfo = ref(null)
const initialRating = ref(0)
const initialComment = ref('')

// 使用統一的學習記錄資料
const allEnrollments = ref(enrollments)

/**
 * Current filter label for button display
 */
const currentFilterLabel = computed(() => {
  const labels = {
    all: '全部狀態',
    in_progress: '進行中',
    completed: '已完課'
  }
  return labels[filterStatus.value] || '全部狀態'
})

/**
 * Filtered enrollments based on current filter
 * TODO: Replace with API call that includes status parameter
 */
const filteredEnrollments = computed(() => {
  let enrollments = allEnrollments.value

  if (filterStatus.value === 'in_progress') {
    // Filter courses where completion_percentage < 100
    enrollments = enrollments.filter(e => e.progress < 100)
  } else if (filterStatus.value === 'completed') {
    // Filter courses where completion_percentage = 100
    enrollments = enrollments.filter(e => e.progress === 100)
  }

  // TODO: Backend should handle sorting by last_watched_at DESC
  // For now, sort by lastWatched if available
  return enrollments.sort((a, b) => {
    const dateA = a.lastWatched ? new Date(a.lastWatched) : new Date(0)
    const dateB = b.lastWatched ? new Date(b.lastWatched) : new Date(0)
    return dateB - dateA
  })
})

/**
 * Handle filter change
 * TODO: Call API with status parameter instead of client-side filtering
 */
const handleFilterChange = (command) => {
  filterStatus.value = command
  currentPage.value = 1
  // TODO: Implement API call
  // fetchEnrollments(filterStatus.value)
}

/**
 * Handle page change
 */
const handlePageChange = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * Navigate to course learning page
 */
const goToCourse = (courseId) => {
  router.push(`/course/${courseId}`)
}

/**
 * Handle open rating dialog
 */
const handleOpenRateDialog = ({ enrollment, initialRating: rating }) => {
  selectedEnrollmentId.value = enrollment.id
  selectedCourseInfo.value = enrollment.course
  initialRating.value = rating
  initialComment.value = enrollment.my_review?.comment || ''
  showRatingDialog.value = true
}

/**
 * Handle review submitted
 */
const handleReviewSubmitted = (reviewData) => {
  // Find the enrollment and update its review
  const enrollment = allEnrollments.value.find(e => e.id === selectedEnrollmentId.value)
  if (enrollment) {
    enrollment.my_review = {
      rating: reviewData.rating,
      comment: reviewData.comment
    }
  }

  // Reset dialog state
  selectedEnrollmentId.value = null
  selectedCourseInfo.value = null
  initialRating.value = 0
  initialComment.value = ''
}
</script>

<style scoped>
.my-learning-page {
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

.filter-status-btn {
  padding: 10px 20px;
  height: 40px;
  background: var(--capy-primary);
  border-color: var(--capy-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-status-btn:hover,
.filter-status-btn:focus {
  background: var(--capy-primary-dark);
  border-color: var(--capy-primary-dark);
}

.filter-icon {
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

/* Course List */
.course-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
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

  .course-list {
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 20px;
  }

  .filter-status-btn {
    padding: 8px 16px;
    height: 36px;
    font-size: 14px;
  }
}
</style>
