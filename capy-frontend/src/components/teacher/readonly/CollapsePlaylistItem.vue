<script setup>
import { ref, computed } from "vue";
import LessonFormDialog from "./LessonFormDialog.vue";
import { getVideoUrl } from "@/api/teacher/video";

const props = defineProps({
  sectionInfo: {
    type: Object,
    required: true,
  },
  sectionIndex: {
    type: Number,
    default: 1,
  },
});

// 依 displayOrder 排序的課程列表
const sortedLessons = computed(() => {
  if (!props.sectionInfo?.lessons) return [];
  return [...props.sectionInfo.lessons].sort((a, b) => a.displayOrder - b.displayOrder);
});

// 計算章節總時長
const totalDuration = computed(() => {
  if (!props.sectionInfo?.lessons) return 0;
  const totalSeconds = props.sectionInfo.lessons.reduce(
    (sum, lesson) => sum + (lesson.lessonDurationSeconds || 0),
    0
  );
  return Math.floor(totalSeconds / 60);
});

// 格式化時長 (秒 -> mm:ss)
const formatDuration = (seconds) => {
  if (!seconds) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// lesson dialog
const isEditLesson = ref(false);
const currentLesson = ref(null);
const showLessonDialog = ref(false);
const lessonVideoUrl = ref(null);

const handleViewLesson = async (lessonInfo) => {
  isEditLesson.value = true;
  currentLesson.value = lessonInfo;
  const res = await getVideoUrl(lessonInfo.lessonId);
  if (res?.signedUrl) {
    lessonVideoUrl.value = res.signedUrl;
  }
  showLessonDialog.value = true;
};
</script>

<template>
  <!-- 單元詳情 dialog -->
  <LessonFormDialog
    :sectionInfo="props.sectionInfo"
    v-model:videoUrl="lessonVideoUrl"
    ref="lessonDialogRef"
    v-model:visible="showLessonDialog"
    :isEdit="isEditLesson"
    :lessonInfo="currentLesson"
  />

  <!-- 章節摺疊項 -->
  <el-collapse-item :name="sectionInfo.sectionId ?? sectionInfo.id" class="section-collapse-item">
    <template #icon="{ isActive }">
      <el-icon class="collapse-icon" :class="{ 'is-active': isActive }">
        <ArrowRight />
      </el-icon>
    </template>
    <template #title>
      <div class="section-header">
        <div class="section-title-area">
          <span class="section-number">{{ String(sectionIndex).padStart(2, '0') }}</span>
          <span class="section-name">{{ sectionInfo.title }}</span>
        </div>
        <div class="section-meta">
          <span class="meta-item">
            <el-icon><VideoPlay /></el-icon>
            {{ sortedLessons.length }} 單元
          </span>
          <span class="meta-item">
            <el-icon><Clock /></el-icon>
            {{ totalDuration }} 分鐘
          </span>
        </div>
      </div>
    </template>

    <div class="lessons-list">
      <div
        v-for="(lesson, index) in sortedLessons"
        :key="lesson.lessonId"
        class="lesson-item"
        @click="handleViewLesson(lesson)"
      >
        <div class="lesson-left">
          <span class="lesson-index">{{ (index + 1).toString().padStart(2, "0") }}</span>
          <span class="lesson-name">{{ lesson.lessonTitle }}</span>
          <el-tag v-if="lesson.freePreview" size="small" type="success" class="free-tag">
            試看
          </el-tag>
        </div>
        <div class="lesson-right">
          <span class="lesson-duration">{{ formatDuration(lesson.lessonDurationSeconds) }}</span>
          <el-button size="small" type="primary" plain>
            查看
          </el-button>
        </div>
      </div>
      <el-empty v-if="!sortedLessons.length" description="暫無單元" :image-size="60" />
    </div>
  </el-collapse-item>
</template>

<style scoped>
/* 章節摺疊樣式 */
.section-collapse-item {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  overflow: hidden;
}

/* Override Element Plus Collapse Item Header */
:deep(.el-collapse-item__header) {
  background-color: #FAFAFA;
  border-bottom: 1px solid transparent;
  padding: 0 16px;
  height: 56px;
  transition: all 0.2s ease;
}

:deep(.el-collapse-item__header.is-active) {
  border-bottom-color: #E5E7EB;
  background-color: #FFFFFF;
}

:deep(.el-collapse-item__wrap) {
  border: none;
}

:deep(.el-collapse-item__content) {
  padding: 0;
  background-color: #FFFFFF;
}

.collapse-icon {
  font-size: 14px;
  color: #9CA3AF;
  transition: transform 0.3s;
  margin-right: 8px;
}

.collapse-icon.is-active {
  transform: rotate(90deg);
  color: #4B5563;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 8px;
}

.section-title-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-number {
  font-size: 14px;
  font-family: inherit;
  font-weight: 500;
  color: #6B7280;
  min-width: 24px;
}

.section-name {
  font-size: 15px;
  font-weight: 500;
  color: #111827;
}

.section-meta {
  display: flex;
  gap: 16px;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #9CA3AF;
}

/* 單元列表樣式 */
.lessons-list {
  padding: 4px 0;
}

.lesson-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 24px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  border-left: 2px solid transparent;
}

.lesson-item:hover {
  background-color: #F9FAFB;
  border-left-color: var(--el-color-primary-light-5);
}

.lesson-left {
  display: flex;
  align-items: center;
  gap: 16px;
  overflow: hidden;
}

.lesson-index {
  font-size: 13px;
  font-weight: 500;
  color: #D1D5DB;
  min-width: 20px;
}

.lesson-name {
  font-size: 14px;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.free-tag {
  margin-left: 8px;
}

.lesson-right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.lesson-duration {
  font-size: 13px;
  color: #9CA3AF;
  font-variant-numeric: tabular-nums;
}

/* Media Queries */
@media (max-width: 640px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .section-meta {
    width: 100%;
    justify-content: flex-start;
  }

  .lesson-item {
     padding: 12px 16px;
     flex-direction: column;
     align-items: flex-start;
     gap: 12px;
  }

  .lesson-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
