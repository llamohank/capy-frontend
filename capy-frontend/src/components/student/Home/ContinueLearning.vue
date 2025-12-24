<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getCourseSections } from '@/api/student/courseLearning'

const router = useRouter()

// 接收從父組件傳來的課程資料
const props = defineProps({
  enrollments: {
    type: Array,
    default: () => []
  }
})

// 獲取進度提示文字
const getProgressHint = (enrollment) => {
  const percentage = enrollment.completionPercentage
  const sectionTitle = enrollment.lastWatchedSectionTitle
  const lessonTitle = enrollment.lastWatchedLessonTitle
  const sectionOrder = enrollment.lastWatchedSectionOrder
  const lessonOrder = enrollment.lastWatchedLessonOrder

  // 優先顯示具體的章節和課程標題
  if (sectionTitle && lessonTitle) {
    const fullText = `上次觀看：${sectionTitle} - ${lessonTitle}`
    // 限制最多顯示 14 個字
    return fullText.length > 18 ? fullText.substring(0, 18) + '...' : fullText
  }

  // 如果沒有標題，使用章節順序
  if (sectionOrder && lessonOrder) {
    return `上次觀看到：第 ${sectionOrder} 章 第 ${lessonOrder} 節`
  }

  // 根據完成度給予激勵文字
  if (percentage >= 90) {
    return '只差一點點就完成了，加油！'
  } else if (percentage >= 75) {
    return `只差 ${Math.round(100 - percentage)}% 就完成了，加油！`
  } else if (percentage >= 50) {
    return '已經完成一半了，繼續努力！'
  } else if (percentage >= 25) {
    return '良好的開始，保持學習動力！'
  } else {
    return '開始你的學習之旅吧！'
  }
}

// 處理卡片點擊，導航到課程學習頁面
const handleCardClick = async (enrollment) => {
  try {
    // 先嘗試從 enrollment 中獲取 lessonId
    let lessonId = enrollment.lastWatchedLessonId
      || enrollment.lastLessonId
      || enrollment.lessonId
      || enrollment.firstLessonId
      || enrollment.currentLessonId

    // 如果沒有 lessonId，呼叫 sections API 獲取第一個單元
    if (!lessonId) {
      console.log('從 API 獲取課程章節資訊...')
      const sectionsData = await getCourseSections(enrollment.courseId)

      // 從第一個章節的第一個單元獲取 lessonId
      if (sectionsData?.section?.length > 0) {
        const firstSection = sectionsData.section[0]
        if (firstSection.lessons?.length > 0) {
          lessonId = firstSection.lessons[0].id
          console.log('從 sections API 獲取到 lessonId:', lessonId)
        }
      }
    }

    if (!lessonId) {
      console.error('無法找到 lessonId，enrollment 資料:', enrollment)
      ElMessage.error('無法開始課程，請稍後再試')
      return
    }

    // 使用正確的路由格式：/learning/course/:courseId/lesson/:lessonId
    router.push({
      name: 'courseLearning',
      params: {
        courseId: enrollment.courseId,
        lessonId: lessonId
      }
    })
  } catch (error) {
    console.error('載入課程失敗:', error)
    ElMessage.error('載入課程失敗，請稍後再試')
  }
}

// 處理老師名稱點擊
const handleTeacherClick = (event, instructorId) => {
  event.stopPropagation() // 防止觸發卡片點擊事件
  if (instructorId) {
    router.push(`/teacherdetail/${instructorId}`)
  }
}
</script>

<template>
  <div class="continue-learning">
    <div
      v-for="enrollment in props.enrollments"
      :key="enrollment.courseId"
      class="course-card"
      @click="handleCardClick(enrollment)"
    >
      <!-- 課程縮圖 -->
      <div class="course-thumbnail">
        <img :src="enrollment.coverImageUrl" :alt="enrollment.courseTitle" />
      </div>

      <!-- 課程資訊 -->
      <div class="course-info">
        <h3 class="course-title">{{ enrollment.courseTitle }}</h3>
        <p class="course-instructor">
          <span
            class="teacher-link"
            @click="handleTeacherClick($event, enrollment.instructorId)"
          >
            {{ enrollment.instructorName }} 老師
          </span>
        </p>

        <!-- 進度資訊文字 -->
        <p class="progress-hint">{{ getProgressHint(enrollment) }}</p>

        <!-- 進度條 -->
        <div class="progress-section">
          <el-progress
            :percentage="enrollment.completionPercentage"
            :stroke-width="8"
            :show-text="false"
            color="#4CAF50"
          />
          <span class="progress-text">{{ enrollment.completionPercentage }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.continue-learning {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--capy-spacing-lg);
}

/* Mobile: Horizontal Scroll with Snap */
@media (max-width: 768px) {
  .continue-learning {
    display: flex;
    grid-template-columns: none;
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    padding: 0 var(--capy-spacing-md);
    margin: 0 calc(-1 * var(--capy-spacing-md));
    padding-left: var(--capy-spacing-md);
    padding-right: var(--capy-spacing-md);

    /* Hide scrollbar for clean look */
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }

  .continue-learning::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  .course-card {
    flex: 0 0 85%;
    max-width: 85%;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
}

.course-card {
  display: flex;
  gap: 16px;
  background: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all var(--capy-transition-base);
  cursor: pointer;
  border: 1px solid var(--capy-border-lighter);
}

.course-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* 課程縮圖 */
.course-thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--el-fill-color-light);
}

.course-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 課程資訊 */
.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.course-instructor {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.teacher-link {
  cursor: pointer;
  transition: color var(--capy-transition-fast);
}

.teacher-link:hover {
  color: var(--capy-primary);
  text-decoration: underline;
}

/* 進度提示文字 */
.progress-hint {
  font-size: 12px;
  color: var(--capy-text-secondary);
  margin: 4px 0 0 0;
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 進度條區塊 */
.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
}

.progress-section :deep(.el-progress) {
  flex: 1;
}

.progress-section :deep(.el-progress-bar__outer) {
  background-color: #E0E0E0;
}

.progress-text {
  font-size: 14px;
  font-weight: 600;
  color: #4CAF50;
  min-width: 40px;
  text-align: right;
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .continue-learning {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .continue-learning {
    padding-left: var(--capy-spacing-sm);
    padding-right: var(--capy-spacing-sm);
    margin: 0 calc(-1 * var(--capy-spacing-sm));
    gap: 12px;
  }

  .course-card {
    flex: 0 0 90%;
    max-width: 90%;
    padding: 12px;
    gap: 12px;
  }

  .course-thumbnail {
    width: 60px;
    height: 60px;
  }

  .course-title {
    font-size: 14px;
  }

  .course-instructor {
    font-size: 12px;
  }

  .progress-text {
    font-size: 13px;
  }
}
</style>
