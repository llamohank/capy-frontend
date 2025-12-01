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
    completion_percentage: 75
  },
  {
    id: 2,
    course: {
      id: 2,
      title: '設計系統',
      cover_image_url: 'https://picsum.photos/200',
      instructor_name: '劉師 12 小時'
    },
    completion_percentage: 30
  },
  {
    id: 3,
    course: {
      id: 3,
      title: 'ui/ux 設計',
      cover_image_url: 'https://picsum.photos/200',
      instructor_name: 'Sophia Lee'
    },
    completion_percentage: 90
  }
])

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
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.course-card {
  display: flex;
  gap: 16px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  width: 360px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
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
@media (max-width: 1200px) {
  .continue-learning {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .continue-learning {
    flex-direction: column;
    align-items: center;
    padding: 0 10px;
    gap: 16px;
  }

  .course-card {
    width: 100%;
    max-width: 500px;
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
