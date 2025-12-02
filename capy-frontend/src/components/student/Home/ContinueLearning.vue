<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 模擬課程資料
const enrollments = ref([
  {
    id: 1,
    course: {
      id: 1,
      title: '進階 Python',
      cover_image_url: 'https://picsum.photos/200',
      instructor_name: 'Ethan Carter'
    },
    completion_percentage: 75,
    last_watched: {
      chapter: 3,
      section: 2,
      title: 'Python 進階語法'
    }
  },
  {
    id: 2,
    course: {
      id: 2,
      title: '設計系統',
      cover_image_url: 'https://picsum.photos/200',
      instructor_name: '劉師 12 小時'
    },
    completion_percentage: 30,
    last_watched: {
      chapter: 1,
      section: 5,
      title: '色彩理論基礎'
    }
  },
  {
    id: 3,
    course: {
      id: 3,
      title: 'ui/ux 設計',
      cover_image_url: 'https://picsum.photos/200',
      instructor_name: 'Sophia Lee'
    },
    completion_percentage: 90,
    last_watched: {
      chapter: 5,
      section: 1,
      title: '使用者測試'
    }
  }
])

// 獲取進度提示文字
const getProgressHint = (enrollment) => {
  const percentage = enrollment.completion_percentage
  const lastWatched = enrollment.last_watched

  if (lastWatched) {
    return `上次觀看到：第 ${lastWatched.chapter} 章 第 ${lastWatched.section} 節`
  }

  // 根據完成度給予激勵文字
  if (percentage >= 90) {
    return '只差一點點就完成了，加油！'
  } else if (percentage >= 75) {
    return `只差 ${100 - percentage}% 就完成了，加油！`
  } else if (percentage >= 50) {
    return '已經完成一半了，繼續努力！'
  } else if (percentage >= 25) {
    return '良好的開始，保持學習動力！'
  } else {
    return '開始你的學習之旅吧！'
  }
}

// 處理卡片點擊，導航到課程學習頁面
const handleCardClick = (courseId) => {
  router.push(`/student/course-play/${courseId}`)
}
</script>

<template>
  <div class="continue-learning">
    <div
      v-for="enrollment in enrollments"
      :key="enrollment.id"
      class="course-card"
      @click="handleCardClick(enrollment.course.id)"
    >
      <!-- 課程縮圖 -->
      <div class="course-thumbnail">
        <img :src="enrollment.course.cover_image_url" :alt="enrollment.course.title" />
      </div>

      <!-- 課程資訊 -->
      <div class="course-info">
        <h3 class="course-title">{{ enrollment.course.title }}</h3>
        <p class="course-instructor">作者: {{ enrollment.course.instructor_name }}</p>

        <!-- 進度資訊文字 -->
        <p class="progress-hint">{{ getProgressHint(enrollment) }}</p>

        <!-- 進度條 -->
        <div class="progress-section">
          <el-progress
            :percentage="enrollment.completion_percentage"
            :stroke-width="8"
            :show-text="false"
            color="#4CAF50"
          />
          <span class="progress-text">{{ enrollment.completion_percentage }}%</span>
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-instructor {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

@media (max-width: 768px) {
  .continue-learning {
    grid-template-columns: 1fr;
    padding: 0 var(--capy-spacing-md);
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .course-card {
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
