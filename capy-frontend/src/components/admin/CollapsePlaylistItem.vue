<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { getRawSignedUrl, downloadAttachment } from "@/api/admin/course";
import { ElMessage } from "element-plus";
import VideoPlayer from "./VideoPlayer.vue";

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

const dialogFormVisible = ref(false);
const videoPlayerRef = ref(null);
const currentLesson = ref(null);
const videoUrl = ref("");
const loadingVideo = ref(false);

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

// 打開課程詳情對話框
const openLessonDetail = async (lesson) => {
  currentLesson.value = lesson;

  // 取得影片簽名 URL
  try {
    loadingVideo.value = true;
    const result = await getRawSignedUrl(lesson.lessonId);
    if (result?.signedUrl) {
      videoUrl.value = result.signedUrl;
    }
  } catch (error) {
    console.error("Failed to get video URL:", error);
  } finally {
    loadingVideo.value = false;
    dialogFormVisible.value = true;
  }
};

// 下載附件
const handleDownloadAttachment = async (attachment) => {
  try {
    const blob = await downloadAttachment(attachment.attachmentId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = attachment.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download attachment:", error);
    ElMessage.error("下載失敗");
  }
};

// 影片狀態對應
const videoStatusMap = {
  uploading: "上傳中",
  upload_complete: "上傳完成",
  upload_failed: "上傳失敗",
  encoding: "轉碼中",
  encoding_failed: "轉碼失敗",
  encode_completed: "轉碼完成",
};

const videoStatusType = (status) => {
  const typeMap = {
    uploading: "warning",
    upload_complete: "info",
    upload_failed: "danger",
    encoding: "warning",
    encoding_failed: "danger",
    encode_completed: "success",
  };
  return typeMap[status] || "info";
};

watch(
  () => dialogFormVisible.value,
  async (value) => {
    await nextTick();
    if (value && videoPlayerRef.value && videoUrl.value) {
      console.log(videoUrl.value);

      await videoPlayerRef.value.init();
      await videoPlayerRef.value.play(videoUrl.value);
    } else if (!value && videoPlayerRef.value) {
      await videoPlayerRef.value.destroy();
      videoUrl.value = "";
    }
  }
);
</script>

<template>
  <!-- 單元影片詳情 dialog -->
  <el-dialog
    v-model="dialogFormVisible"
    :show-close="false"
    width="800"
    :close-on-click-modal="false"
    class="lesson-dialog"
    align-center
    append-to-body
  >
    <template #header>
      <div class="dialog-header">
        <span class="dialog-title">單元詳情</span>
        <el-button class="dialog-close-btn" text circle @click="dialogFormVisible = false">
          <el-icon :size="20"><Close /></el-icon>
        </el-button>
      </div>
    </template>

    <div v-if="currentLesson" class="lesson-detail">
      <!-- 影片播放區 -->
      <div class="video-wrapper">
        <div class="video-section" v-loading="loadingVideo">
          <VideoPlayer v-if="videoUrl" ref="videoPlayerRef" :src="videoUrl" />
          <div v-else class="video-placeholder">
            <div class="placeholder-content">
              <el-icon :size="48"><VideoPlay /></el-icon>
              <span>目前無法預覽影片</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 單元資訊卡片 -->
      <div class="lesson-content">
        <!-- 標題與標籤 -->
        <div class="content-header">
          <h3 class="lesson-title">{{ currentLesson.lessonTitle }}</h3>
          <div class="lesson-badges">
            <el-tag v-if="currentLesson.freePreview" type="success" size="small" effect="plain" round>
              試看
            </el-tag>
            <el-tag :type="videoStatusType(currentLesson.videoAssetStatus)" size="small" effect="plain" round>
              {{ videoStatusMap[currentLesson.videoAssetStatus] || currentLesson.videoAssetStatus }}
            </el-tag>
          </div>
        </div>

        <!-- 資訊列表 (簡化版) -->
        <div class="info-row">
          <div class="info-item">
            <span class="label">所屬章節</span>
            <span class="value">{{ sectionInfo?.title }}</span>
          </div>
          <div class="info-item" v-if="currentLesson.lessonDurationSeconds">
            <span class="label">時長</span>
            <span class="value">{{ formatDuration(currentLesson.lessonDurationSeconds) }}</span>
          </div>
        </div>

        <el-divider v-if="currentLesson.description || currentLesson.attachments?.length" style="margin: 20px 0;" />

        <!-- 影片簡介 -->
        <div class="description-block" v-if="currentLesson.description">
          <h4 class="block-title">影片簡介</h4>
          <p class="description-text">{{ currentLesson.description }}</p>
        </div>

        <!-- 附件列表 -->
        <div class="attachments-block" v-if="currentLesson.attachments?.length">
          <div class="block-header">
            <h4 class="block-title">單元附件 ({{ currentLesson.attachments.length }})</h4>
          </div>
          <div class="attachment-list">
            <div
              v-for="att in currentLesson.attachments"
              :key="att.attachmentId"
              class="attachment-item"
            >
              <div class="attachment-info">
                <el-icon class="file-icon"><Document /></el-icon>
                <span class="attachment-name">{{ att.fileName }}</span>
              </div>
              <el-button
                link
                type="primary"
                size="small"
                @click="handleDownloadAttachment(att)"
              >
                下載
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>

  <!-- 章節摺疊項 -->
  <el-collapse-item class="section-collapse-item">
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
        @click="openLessonDetail(lesson)"
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
  margin-bottom: 8px; /* Add some spacing between items if not present */
}

/* Override Element Plus Collapse Item Header */
:deep(.el-collapse-item__header) {
  background-color: #FAFAFA; /* Simplier background */
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
  border-left: 2px solid transparent; /* Highlight indicator */
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

/* ========== Dialog 樣式 (Clean Version) ========== */
:deep(.lesson-dialog) {
  --el-dialog-border-radius: 12px;
  --el-dialog-padding-primary: 0;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

:deep(.lesson-dialog .el-dialog__header) {
  margin: 0;
  padding: 0;
  border-bottom: 1px solid #F3F4F6;
}

:deep(.lesson-dialog .el-dialog__body) {
  padding: 0;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  height: 60px;
  box-sizing: border-box;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.dialog-close-btn {
  color: #9CA3AF !important;
  margin-right: -8px;
}

.dialog-close-btn:hover {
  color: #4B5563 !important;
  background-color: #F3F4F6 !important;
}

.lesson-detail {
  display: flex;
  flex-direction: column;
}

/* 影片區域 */
.video-wrapper {
  background-color: #000;
  width: 100%;
}

.video-section {
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Shaka Player container fixes */
.video-section :deep(.player-shell) {
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  position: absolute;
  top: 0;
  left: 0;
}

.video-section :deep(.player-shell video) {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain;
}

.video-section :deep(.shaka-video-container) {
  width: 100% !important;
  height: 100% !important;
}

.video-section :deep(.shaka-controls-container) {
  width: 100% !important;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  background-color: #18181B; /* Darker clean background */
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #52525B;
}

/* 內容區域 */
.lesson-content {
  padding: 24px;
  max-height: 50vh;
  overflow-y: auto;
}

.content-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.lesson-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.lesson-badges {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

/* 簡化版資訊列 */
.info-row {
  display: flex;
  gap: 32px;
  color: #6B7280;
  font-size: 14px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item .label {
  color: #9CA3AF;
}

.info-item .value {
  color: #374151;
  font-weight: 500;
}

.block-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.description-text {
  font-size: 14px;
  line-height: 1.6;
  color: #4B5563;
  margin: 0;
  white-space: pre-wrap;
}

.attachments-block {
  margin-top: 24px;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #F9FAFB;
  border: 1px solid #F3F4F6;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.attachment-item:hover {
  border-color: #E5E7EB;
}

.attachment-info {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}

.file-icon {
  color: #9CA3AF;
  font-size: 16px;
}

.attachment-name {
  font-size: 14px;
  color: #4B5563;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
