<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { User, Reading } from '@element-plus/icons-vue'

const router = useRouter()

// 接收從父組件傳來的講師資料
const props = defineProps({
  teachers: {
    type: Array,
    default: () => []
  }
})

// 後端返回的格式已經是金牌講師，直接使用
const displayTeachers = computed(() => props.teachers)

const goToTeacher = (id) => {
  router.push(`/teacher/${id}`)
}

const formatStudentCount = (count) => {
  // 處理 undefined 或 null 的情況
  if (count === undefined || count === null) {
    return '0'
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}
</script>

<template>
  <div class="golden-teachers-container">
    <div
      v-for="teacher in displayTeachers"
      :key="teacher.id"
      class="teacher-card"
      @click="goToTeacher(teacher.id)"
    >
      <!-- Avatar with Ring -->
      <div class="avatar-wrapper">
        <div class="avatar-ring"></div>
        <el-avatar
          :size="140"
          :src="teacher.avatarUrl"
          class="teacher-avatar"
        />
      </div>

      <!-- Teacher Info -->
      <div class="teacher-info">
        <h3 class="teacher-name">{{ teacher.name }}</h3>
        <p class="teacher-title">{{ teacher.topCategory }}</p>

        <!-- Stats -->
        <div class="teacher-stats">
          <div class="stat-item">
            <el-icon class="stat-icon"><User /></el-icon>
            <span class="stat-value">{{ formatStudentCount(teacher.studentCount) }}</span>
            <span class="stat-label">學員</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <el-icon class="stat-icon"><Reading /></el-icon>
            <span class="stat-value">{{ teacher.courseCount }}</span>
            <span class="stat-label">課程</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.golden-teachers-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--capy-spacing-xl);
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--capy-spacing-lg);
}

.teacher-card {
  background: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  padding: var(--capy-spacing-xl) var(--capy-spacing-lg);
  text-align: center;
  cursor: pointer;
  transition: all var(--capy-transition-base);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--capy-border-light);
}

.teacher-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--capy-shadow-lg);
  border-color: var(--capy-primary);
}

/* Avatar with Ring Effect */
.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: var(--capy-spacing-lg);
}

.avatar-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 3px solid var(--capy-primary);
  opacity: 0.3;
  transition: all var(--capy-transition-base);
}

.teacher-card:hover .avatar-ring {
  opacity: 0.6;
  width: 170px;
  height: 170px;
  box-shadow: 0 0 20px rgba(0, 191, 165, 0.3);
}

.teacher-avatar {
  position: relative;
  z-index: 1;
  border: 4px solid var(--capy-bg-surface);
  box-shadow: var(--capy-shadow-md);
}

/* Teacher Info */
.teacher-info {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-sm);
}

.teacher-name {
  font-size: var(--capy-font-size-xl);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
  margin: 0;
}

.teacher-title {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  font-weight: var(--capy-font-weight-medium);
  margin: 0;
}

/* Stats */
.teacher-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--capy-spacing-md);
  margin: var(--capy-spacing-md) 0;
  padding: var(--capy-spacing-md) 0;
  border-top: 1px solid var(--capy-border-lighter);
  border-bottom: 1px solid var(--capy-border-lighter);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-icon {
  font-size: 18px;
  color: var(--capy-primary);
}

.stat-value {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
}

.stat-label {
  font-size: var(--capy-font-size-xs);
  color: var(--capy-text-secondary);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--capy-border-light);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .golden-teachers-container {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--capy-spacing-lg);
  }
}

@media (max-width: 768px) {
  .golden-teachers-container {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--capy-spacing-md);
    padding: 0 var(--capy-spacing-md);
  }

  .teacher-card {
    padding: var(--capy-spacing-lg) var(--capy-spacing-md);
  }

  .avatar-wrapper {
    margin-bottom: var(--capy-spacing-md);
  }

  .teacher-avatar {
    width: 110px !important;
    height: 110px !important;
  }

  .avatar-ring {
    width: 130px;
    height: 130px;
  }

  .teacher-card:hover .avatar-ring {
    width: 140px;
    height: 140px;
  }

  .teacher-name {
    font-size: var(--capy-font-size-lg);
  }

  .teacher-title {
    font-size: var(--capy-font-size-sm);
  }
}

@media (max-width: 480px) {
  .golden-teachers-container {
    grid-template-columns: 1fr;
  }
}
</style>
