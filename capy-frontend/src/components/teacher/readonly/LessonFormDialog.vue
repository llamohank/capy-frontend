<script setup>
import { useLesson } from "@/composable/useLesson";
import VideoPlayer from "../../admin/VideoPlayer.vue";
import { nextTick } from "vue";
import { useAttachment } from "@/composable/useAttachment";
const props = defineProps({
  sectionInfo: {
    type: Object,
    required: true,
  },

  visible: {
    type: Boolean,
    default: false,
  },
  lessonInfo: {
    type: Object,
    default: null,
  },
  videoUrl: {
    type: String,
    required: false,
    default: null,
  },
});

const { currentSectionInfo } = useLesson(props.sectionInfo);
const emit = defineEmits(["update:visible"]);

const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit("update:visible", val);
  },
});
const formModel = ref({
  ...props.lessonInfo,
  videoUrl: props.videoUrl,
  attachments: props.lessonInfo?.attachments?.map((item) => ({ ...item })) ?? [],
});

const videoPlayerRef = ref(null);

watch(
  () => dialogVisible.value,
  async (val) => {
    if (val) {
      formModel.value = {
        ...props.lessonInfo,
        videoUrl: props.videoUrl,
        attachments: props.lessonInfo?.attachments?.map((item) => ({ ...item })) ?? [],
      };
      console.log(props.videoUrl);
      try {
        await nextTick();
        await videoPlayerRef.value.init();
        await videoPlayerRef.value.play(props.videoUrl);
      } catch (e) {
        ElMessage.error("影片播放錯誤");
        console.log(e);
      }
    } else {
      if (videoPlayerRef.value) {
        videoPlayerRef.value.destroy();
      }
    }
  }
);

const handleDownloadAttachment = async (attachmentId) => {
  const { download } = useAttachment(attachmentId);
  await download();
};
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    :show-close="false"
    width="800"
    :close-on-click-modal="false"
    class="lesson-dialog"
    align-center
  >
    <template #header>
      <div class="dialog-header">
        <span class="dialog-title">單元影片詳情</span>
        <el-button class="dialog-close-btn" text circle @click="dialogVisible = false">
          <el-icon :size="20"><Close /></el-icon>
        </el-button>
      </div>
    </template>

    <div class="lesson-detail">
      <!-- 可滾動內容區域 -->
      <div class="lesson-content">
        <!-- 影片區域 -->
        <div class="video-wrapper">
          <div class="video-section" v-if="formModel.videoUrl">
            <VideoPlayer ref="videoPlayerRef" />
          </div>
          <div v-else class="video-placeholder">
            <div class="placeholder-content">
              <el-icon :size="48"><VideoCamera /></el-icon>
              <span>尚無影片</span>
            </div>
          </div>
        </div>

        <!-- 資訊區域 -->
        <div class="lesson-info">
          <!-- 標題 -->
          <div class="info-section">
            <h3 class="lesson-title">
              {{ formModel.lessonTitle }}
              <el-tag v-show="formModel.freePreview" size="small" type="success" style="margin-left: 8px;">試看單元</el-tag>
            </h3>
          </div>

          <!-- 所屬章節 -->
          <div class="info-row">
            <div class="info-item">
              <span class="label">所屬章節</span>
              <span class="value">{{ currentSectionInfo?.title }}</span>
            </div>
          </div>

          <el-divider style="margin: 20px 0;" />

          <!-- 影片簡介 -->
          <div class="info-section">
            <h4 class="section-title">單元影片簡介</h4>
            <p class="description-text">{{ formModel.description || '暫無簡介' }}</p>
          </div>

          <el-divider style="margin: 20px 0;" />

          <!-- 附件區塊 -->
          <div class="attachments-block">
            <div class="block-header">
              <h4 class="block-title">單元附件</h4>
            </div>
            <div v-if="formModel.attachments?.length > 0" class="attachment-list">
              <div
                v-for="attachment in formModel.attachments"
                :key="attachment.attachmentId"
                class="attachment-item"
              >
                <div class="attachment-info">
                  <el-icon class="file-icon"><Document /></el-icon>
                  <span class="attachment-name">{{ attachment.fileName }}</span>
                </div>
                <div class="attachment-actions">
                  <el-button
                    link
                    type="primary"
                    size="small"
                    @click="handleDownloadAttachment(attachment.attachmentId)"
                  >
                    下載
                  </el-button>
                </div>
              </div>
            </div>
            <p v-else class="no-attachment">此單元沒有附件</p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">關閉</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped>
/* ========== Dialog 樣式 ========== */
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

:deep(.lesson-dialog .el-dialog__footer) {
  padding: 16px 24px;
  border-top: 1px solid #F3F4F6;
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* ========== 內容區域 ========== */
.lesson-detail {
  display: flex;
  flex-direction: column;
}

/* 可滾動內容區域 */
.lesson-content {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

/* 影片區域 */
.video-wrapper {
  background-color: #000;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
}

.video-section {
  width: 100%;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

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
  aspect-ratio: 16 / 9;
  background-color: #18181B;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #52525B;
}

.placeholder-content .el-icon {
  color: #71717A;
}

/* 資訊區域 */
.lesson-info {
  display: flex;
  flex-direction: column;
}

.info-section {
  margin-bottom: 8px;
}

.lesson-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.description-text {
  font-size: 14px;
  color: #4B5563;
  line-height: 1.6;
  margin: 0;
}

/* 資訊列 */
.info-row {
  display: flex;
  gap: 32px;
  color: #6B7280;
  font-size: 14px;
  margin-bottom: 8px;
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

/* 附件區塊 */
.attachments-block {
  margin-top: 16px;
}

.block-header {
  margin-bottom: 12px;
}

.block-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0;
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

.attachment-actions {
  display: flex;
  gap: 8px;
}

.no-attachment {
  font-size: 14px;
  color: #9CA3AF;
  margin: 0;
}

/* Media Queries */
@media (max-width: 640px) {
  .dialog-header {
    padding: 12px 16px;
    height: auto;
  }

  .lesson-content {
    padding: 16px;
  }

  .info-row {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
