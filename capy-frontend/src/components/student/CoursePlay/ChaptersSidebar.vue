<template>
  <div class="chapters-sidebar">
    <!-- 側邊欄頭部 -->
    <div class="sidebar-header">
      <div class="header-content">
        <h3 class="sidebar-title">課程內容</h3>
        <!-- 收合按鈕 -->
        <el-button
          class="collapse-btn"
          :icon="DArrowRight"
          circle
          size="small"
          @click="handleToggleSidebar"
        />
      </div>

      <!-- 整體進度條 -->
      <div class="progress-section">
        <div class="progress-info">
          <span class="progress-text">學習進度</span>
          <span class="progress-stats">{{ completedCount }}/{{ totalCount }}</span>
        </div>
        <el-progress
          :percentage="progressPercentage"
          :stroke-width="8"
          :show-text="false"
          :color="progressColor"
        />
      </div>
    </div>

    <!-- 章節列表 -->
    <div class="sidebar-content">
      <el-scrollbar class="chapters-scrollbar">
        <el-collapse v-model="activeChapters" accordion>
          <el-collapse-item
            v-for="chapter in chapters"
            :key="chapter.id"
            :name="chapter.id"
            class="chapter-item"
          >
            <!-- 章節標題 -->
            <template #title>
              <div class="chapter-title">
                <el-icon class="chapter-icon">
                  <Folder />
                </el-icon>
                <span class="chapter-text">{{ formatChapterTitle(chapter.title) }}</span>
                <span class="chapter-count">({{ getChapterLessonCount(chapter) }})</span>
              </div>
            </template>

            <!-- 單元列表 -->
            <div class="lessons-list">
              <div
                v-for="lesson in chapter.lessons"
                :key="lesson.id"
                class="lesson-item"
                :class="{
                  'is-active': lesson.id === currentLessonId,
                  'is-completed': lesson.completed || lesson.isCompleted,
                  'is-locked': lesson.isLocked
                }"
                @click="handleLessonClick(lesson)"
              >
                <!-- 左側狀態圖示 -->
                <div class="lesson-status">
                  <el-icon v-if="lesson.completed || lesson.isCompleted" class="status-icon completed">
                    <CircleCheck />
                  </el-icon>
                  <el-icon v-else-if="lesson.isLocked" class="status-icon locked">
                    <Lock />
                  </el-icon>
                  <el-icon v-else-if="lesson.id === currentLessonId" class="status-icon playing">
                    <VideoPlay />
                  </el-icon>
                  <div v-else class="status-dot"></div>
                </div>

                <!-- 單元資訊 -->
                <div class="lesson-info">
                  <div class="lesson-title">{{ formatLessonTitle(lesson.title) }}</div>
                  <div class="lesson-meta">
                    <span class="lesson-duration">
                      <el-icon><Clock /></el-icon>
                      {{ formatDuration(lesson.duration) }}
                    </span>
                  </div>
                </div>

                <!-- 右側播放圖示（當前播放） -->
                <div v-if="lesson.id === currentLessonId" class="lesson-playing">
                  <el-icon class="playing-icon">
                    <CaretRight />
                  </el-icon>
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  Folder,
  CircleCheck,
  Lock,
  VideoPlay,
  Clock,
  CaretRight,
  DArrowRight
} from '@element-plus/icons-vue'

/**
 * Props 定義
 */
const props = defineProps({
  chapters: {
    type: Array,
    required: true,
    default: () => []
  },
  currentLessonId: {
    type: String,
    default: ''
  },
  isCollapsed: {
    type: Boolean,
    default: false
  }
})

/**
 * Emits 定義
 */
const emit = defineEmits(['lesson-click', 'toggle-sidebar'])

// 狀態
const activeChapters = ref([])

/**
 * 進度條顏色
 */
const progressColor = computed(() => '#54CDF2')

/**
 * 計算總單元數
 */
const totalCount = computed(() => {
  return props.chapters.reduce((total, chapter) => {
    return total + chapter.lessons.length
  }, 0)
})

/**
 * 計算已完成單元數
 */
const completedCount = computed(() => {
  return props.chapters.reduce((total, chapter) => {
    return total + chapter.lessons.filter(lesson => lesson.completed || lesson.isCompleted).length
  }, 0)
})

/**
 * 計算進度百分比
 */
const progressPercentage = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((completedCount.value / totalCount.value) * 100)
})

/**
 * 取得章節的單元數量
 */
const getChapterLessonCount = (chapter) => {
  return chapter.lessons.length
}

/**
 * 格式化章節標題，將 Module 替換為章節
 */
const formatChapterTitle = (title) => {
  if (!title) return ''
  // 將 "Module X" 替換為 "章節 X"
  return title.replace(/Module\s+(\d+)/gi, '章節 $1')
}

/**
 * 格式化單元標題，將 Lesson 替換為單元
 */
const formatLessonTitle = (title) => {
  if (!title) return ''
  // 將 "Lesson X-Y" 替換為 "單元 X-Y"
  return title.replace(/Lesson\s+([\d-]+)/gi, '單元 $1')
}

/**
 * 格式化時長
 * 後端回傳的 duration 已經是 "MM:SS" 格式的字串，直接返回即可
 */
const formatDuration = (duration) => {
  // 如果已經是字串格式（MM:SS），直接返回
  if (typeof duration === 'string') {
    return duration
  }

  // 如果是數字（秒數），轉換為 MM:SS 格式
  if (typeof duration === 'number') {
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    const secs = duration % 60

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`
  }

  return '00:00'
}

/**
 * 處理單元點擊
 */
const handleLessonClick = (lesson) => {
  if (lesson.isLocked) {
    return
  }
  emit('lesson-click', lesson)
}

/**
 * 處理側邊欄切換
 */
const handleToggleSidebar = () => {
  emit('toggle-sidebar')
}

/**
 * 自動展開包含當前單元的章節
 */
const expandCurrentChapter = () => {
  if (!props.currentLessonId) return

  for (const chapter of props.chapters) {
    const hasCurrentLesson = chapter.lessons.some(
      lesson => lesson.id === props.currentLessonId
    )
    if (hasCurrentLesson) {
      activeChapters.value = [chapter.id]
      break
    }
  }
}

/**
 * 監聽當前單元變化
 */
watch(() => props.currentLessonId, () => {
  expandCurrentChapter()
}, { immediate: true })
</script>

<style scoped lang="scss">
.chapters-sidebar {
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #DCDFE6;
  background-color: #fafafa;

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .sidebar-title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin: 0;
    }

    .collapse-btn {
      background-color: #54CDF2;
      border-color: #54CDF2;
      color: #ffffff;
      transition: all 0.3s ease;

      &:hover {
        background-color: #3db8d9;
        border-color: #3db8d9;
        transform: scale(1.1);
      }

      &:active {
        background-color: #2da3c4;
        border-color: #2da3c4;
      }
    }
  }

  .progress-section {
    .progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .progress-text {
        font-size: 14px;
        color: #606266;
      }

      .progress-stats {
        font-size: 14px;
        font-weight: 600;
        color: #54CDF2;
      }
    }
  }
}

.sidebar-content {
  flex: 1;
  overflow: hidden;

  .chapters-scrollbar {
    height: 100%;

    :deep(.el-scrollbar__view) {
      padding: 8px 0;
    }
  }
}

.chapter-item {
  :deep(.el-collapse-item__header) {
    padding: 12px 20px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #EBEEF5;
    font-weight: 600;

    &:hover {
      background-color: #f0feff;
    }
  }

  :deep(.el-collapse-item__content) {
    padding: 0;
  }

  .chapter-title {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;

    .chapter-icon {
      color: #54CDF2;
      font-size: 18px;
    }

    .chapter-text {
      flex: 1;
      font-size: 15px;
      color: #303133;
    }

    .chapter-count {
      font-size: 13px;
      color: #909399;
      font-weight: 400;
    }
  }
}

.lessons-list {
  background-color: #ffffff;
}

.lesson-item {
  display: flex;
  align-items: center;
  padding: 12px 20px 12px 40px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid #f0f0f0;

  &:hover:not(.is-locked) {
    background-color: #f5f7fa;
  }

  &.is-active {
    background-color: #f0feff;
    border-left: 3px solid #54CDF2;
  }

  &.is-completed {
    .lesson-title {
      color: #67C23A;
    }
  }

  &.is-locked {
    cursor: not-allowed;
    opacity: 0.6;

    .lesson-title {
      color: #C0C4CC;
    }
  }

  .lesson-status {
    margin-right: 12px;
    flex-shrink: 0;

    .status-icon {
      font-size: 18px;

      &.completed {
        color: #67C23A;
      }

      &.locked {
        color: #FB8C00;
      }

      &.playing {
        color: #54CDF2;
      }
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #DCDFE6;
    }
  }

  .lesson-info {
    flex: 1;
    min-width: 0;

    .lesson-title {
      font-size: 14px;
      color: #303133;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .lesson-meta {
      display: flex;
      align-items: center;
      gap: 12px;

      .lesson-duration {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #909399;

        .el-icon {
          font-size: 14px;
        }
      }
    }
  }

  .lesson-playing {
    margin-left: 8px;
    flex-shrink: 0;

    .playing-icon {
      font-size: 20px;
      color: #54CDF2;
      animation: pulse 1.5s ease-in-out infinite;
    }
  }
}

// 動畫
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// 響應式設計
@media (max-width: 768px) {
  .sidebar-header {
    padding: 16px;

    .sidebar-title {
      font-size: 16px;
    }
  }

  .lesson-item {
    padding: 10px 16px 10px 32px;

    .lesson-info {
      .lesson-title {
        font-size: 13px;
      }
    }
  }
}
</style>
