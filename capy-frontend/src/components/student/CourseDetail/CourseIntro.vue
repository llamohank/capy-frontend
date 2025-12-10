<template>
  <div class="course-intro">
    <h2 class="intro-title">課程介紹</h2>
    <p class="course-description">{{ description }}</p>

    <!-- 試看單元 -->
    <div v-if="previewCount > 0" class="preview-section">
      <div class="preview-content">
        <div class="preview-info">
          <el-icon class="preview-icon"><VideoPlay /></el-icon>
          <span class="preview-text">本課程提供 {{ previewCount }} 堂免費試看課程，立即體驗教學風格</span>
        </div>
        <el-button plain class="preview-btn" @click="handlePreview">
          <el-icon><VideoPlay /></el-icon>
          立即試看
        </el-button>
      </div>
    </div>

    <h3 class="stats-title">課程資訊</h3>
    <div class="course-stats">
      <span class="stat-item">
        <el-icon><Clock /></el-icon>
        {{ duration }}
      </span>
      <span class="stat-item">
        <el-icon><Document /></el-icon>
        {{ sections }} sections
      </span>
      <span class="stat-item">
        <el-icon><VideoPlay /></el-icon>
        {{ attachments }} attachments
      </span>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Clock, Document, VideoPlay } from '@element-plus/icons-vue'

const props = defineProps({
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  sections: {
    type: Number,
    required: true
  },
  attachments: {
    type: Number,
    required: true
  },
  contentSections: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['preview'])

// 計算免費試看課程數量
const previewCount = computed(() => {
  if (!props.contentSections || props.contentSections.length === 0) return 0

  let count = 0
  props.contentSections.forEach(section => {
    if (section.lessons && section.lessons.length > 0) {
      section.lessons.forEach(lesson => {
        if (lesson.preview) {
          count++
        }
      })
    }
  })
  return count
})

const handlePreview = () => {
  // 觸發預覽事件，讓父組件處理（播放第一個免費課程）
  emit('preview', { fromHeader: true })
}
</script>

<style scoped>
.course-intro {
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  margin-bottom: 24px;
}

.intro-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.course-description {
  color: #333;
  font-size: 16px;
  line-height: 1.8;
  margin: 0 0 24px 0;
}

.preview-section {
  background: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary-light-7);
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 32px;
}

.preview-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.preview-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 200px;
}

.preview-icon {
  color: var(--capy-primary);
  font-size: 20px;
  flex-shrink: 0;
}

.preview-text {
  color: #333;
  font-size: 15px;
  line-height: 1.5;
}

.preview-btn {
  font-weight: 600;
  padding: 10px 24px;
  height: auto;
  border-color: var(--capy-primary);
  color: var(--capy-primary);
}

.preview-btn:hover {
  background: var(--capy-primary);
  border-color: var(--capy-primary);
  color: white;
}

.preview-btn .el-icon {
  margin-right: 6px;
}

.stats-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.course-stats {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  padding-bottom: 32px;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #333;
}

.stat-item .el-icon {
  color: #7ec8a3;
  font-size: 18px;
}

@media (max-width: 768px) {
  .course-intro {
    padding: 24px 16px;
  }

  .intro-title {
    font-size: 20px;
  }

  .course-description {
    font-size: 14px;
  }

  .preview-section {
    padding: 16px;
  }

  .preview-content {
    flex-direction: column;
    align-items: stretch;
  }

  .preview-info {
    gap: 8px;
  }

  .preview-btn {
    width: 100%;
    justify-content: center;
  }

  .stats-title {
    font-size: 18px;
  }

  .course-stats {
    gap: 20px;
  }
}
</style>
