<script setup>
import { useLesson } from "@/composable/useLesson";
import VideoPlayer from "../admin/VideoPlayer.vue";
import { nextTick } from "vue";
import { useAttachment } from "@/composable/useAttachment";
const props = defineProps({
  sectionInfo: {
    type: Object,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: true,
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

const { defaultLessonInfo, currentSectionInfo } = useLesson(props.sectionInfo);
const emit = defineEmits(["update:visible", "confirm", "update:videoUrl"]);

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

const requestData = computed(() => {
  return {
    ...formModel.value,
    lessonDescription: formModel.value.description,
    videoMeta: videoMeta.value,
    attachmentOps: attachmentOps.value,
  };
});
let currentUploadVideo;
const videoPlayerRef = ref(null);

const videoMeta = ref({
  rawVideoHeight: videoPlayerRef.value?.videoHeight,
  fileSize: null,
  durationSeconds: videoPlayerRef.value?.videoDuration,
});
const videoUploadRef = ref(null);
const handleVideoExceed = (file) => {
  videoUploadRef.value.clearFiles();
  // const file = files[0]
  // file.uid = genFileId();
  upload.value.handleStart(file);
};
const handleVideoChange = async (file) => {
  currentUploadVideo = file.raw;
  formModel.value.videoUrl = URL.createObjectURL(file.raw);
  await nextTick();
  videoMeta.value.fileSize = file.raw.size;
};
watch(
  () => dialogVisible.value,
  (val) => {
    if (val) {
      if (!props.isEdit) {
        formModel.value = { ...defaultLessonInfo, videoUrl: props.videoUrl };
        return;
      }

      formModel.value = {
        ...props.lessonInfo,
        videoUrl: props.videoUrl,
        attachments: props.lessonInfo?.attachments?.map((item) => ({ ...item })) ?? [],
      };
      console.log(props.videoUrl);
    } else {
      emit("update:videoUrl", null);
      attachmentUploadRef.value.clearFiles();
      attachmentList.value = [];
    }
  }
);
watch(
  () => formModel.value.videoUrl,
  async (newVal, oldVal) => {
    // console.log(55);
    if (!newVal) {
      return;
    }
    if (!oldVal) {
      await nextTick();
      // console.log(videoPlayerRef.value);
      try {
        await videoPlayerRef.value.init();
        await videoPlayerRef.value.play(newVal);
        videoMeta.value.rawVideoHeight = videoPlayerRef.value.videoHeight;
        videoMeta.value.durationSeconds = videoPlayerRef.value.videoDuration;
      } catch (e) {
        console.log(e);
        ElMessage.error("影片播放錯誤");
        videoPlayerRef.value.destroy();
        formModel.value.videoUrl = null;
      }

      // console.log(requestData.value.videoHeight);
      // console.log(videoPlayerRef.value.videoHeight);
      return;
    }
    await videoPlayerRef.value.play(newVal);
  }
);
const handleAttachmentExceed = () => {
  ElMessage.error("超過上傳數量");
};
const handleAttachmentChange = (file, files) => {
  console.log(file);
  console.log(files);
  attachmentList.value = files;
};
const handleAttachmentClear = () => {
  attachmentUploadRef.value.clearFiles();
};
const handleAttachmentRemove = (file, files) => {
  console.log(file);
  console.log(files);
  attachmentList.value = files;
};
const handleDeleteAttachment = (attachmentId) => {
  const target = formModel.value.attachments.find((item) => item.attachmentId === attachmentId);
  if (!target) {
    return;
  }
  target.isDelete = true;
};
const handleDownloadAttachment = async (attachmentId) => {
  const { download } = useAttachment(attachmentId);
  await download();
};

const attachmentList = ref([]);
//新增的Ops
const newAttachmentList = computed(() =>
  attachmentList.value?.map((attachment, index) => ({ isDelete: false, fileIndex: index }))
);
const defaultAttachmentList = computed(() => {
  if (props.isEdit) {
    return formModel.value.attachments.filter((attachment) => !attachment.isDelete);
  }
  return [];
});

const deleteAttachmentList = computed(() => {
  if (props.isEdit) {
    return formModel.value.attachments.filter((attachment) => attachment.isDelete);
  }
  return [];
});
const attachmentUploadRef = ref(null);
const attachmentOps = computed(() => [...newAttachmentList.value, ...deleteAttachmentList.value]);
//新增的檔案
const attachmentFileList = computed(() => attachmentList.value?.map((file) => file.raw));
// let isDefferent = true;
// watch(
//   () => requestData,
//   (newVal, oldVal) => {
//     console.log(newVal);
//     console.log(oldVal);
//     console.log(newVal === oldVal);
//   },
//   { immediate: true }
// );
const save = () => {
  if (!formModel.value.videoUrl || formModel.value.videoUrl === props.videoUrl) {
    requestData.value.videoMeta = null;
  }
  const data = {};
  data.request = requestData.value;
  data.fileList = attachmentFileList.value;
  data.videoFile = currentUploadVideo;
  console.log(videoMeta.value);
  emit("confirm", data);
  emit("update:visible", false);

  dialogVisible.visible = false;
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
        <span class="dialog-title">{{ props.isEdit ? '編輯單元影片' : '新增單元影片' }}</span>
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
            <el-upload
              :auto-upload="false"
              :on-change="handleVideoChange"
              :limit="1"
              :on-exceed="handleVideoExceed"
              class="upload-area"
              ref="videoUploadRef"
              drag
            >
              <div class="placeholder-content">
                <el-icon :size="48"><UploadFilled /></el-icon>
                <div class="upload-text">
                  <span>將影片檔案拖曳至此處</span>
                  <span class="upload-hint">或點擊上傳</span>
                </div>
              </div>
            </el-upload>
          </div>
        </div>

        <!-- 表單區域 -->
        <el-form :model="formModel" label-position="top" class="lesson-form">
          <!-- 標題 -->
          <div class="form-section">
            <el-form-item label="單元影片標題" class="form-item-clean">
              <el-input
                v-model="formModel.lessonTitle"
                placeholder="請輸入單元影片標題"
                class="input-clean"
              />
            </el-form-item>
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
          <div class="form-section">
            <el-form-item label="單元影片簡介" class="form-item-clean">
              <el-input
                v-model="formModel.description"
                type="textarea"
                :rows="4"
                placeholder="請輸入影片簡介"
                class="textarea-clean"
              />
            </el-form-item>
          </div>

          <!-- 試看開關 -->
          <div class="form-section switch-section">
            <span class="switch-label">是否為試看單元</span>
            <el-switch
              v-model="formModel.freePreview"
              active-text="是"
              inactive-text="否"
            />
          </div>

          <!-- 重新選擇影片 -->
          <div v-if="formModel.videoUrl" class="form-section">
            <div class="video-actions">
              <el-button type="primary" plain @click="formModel.videoUrl = null">
                重新選擇影片
              </el-button>
            </div>
          </div>

          <el-divider style="margin: 20px 0;" />

          <!-- 上傳附件 -->
          <div class="attachments-block">
            <div class="block-header">
              <h4 class="block-title">單元附件</h4>
            </div>
            <el-upload
              multiple
              ref="attachmentUploadRef"
              :auto-upload="false"
              :on-remove="handleAttachmentRemove"
              :on-change="handleAttachmentChange"
              :limit="3 - formModel.attachments.length"
              :on-exceed="handleAttachmentExceed"
              class="attachment-upload"
            >
              <template #trigger>
                <el-button type="primary" plain>選擇上傳文件</el-button>
              </template>
              <el-button type="default" plain @click.stop="handleAttachmentClear" style="margin-left: 8px;">
                清空上傳列表
              </el-button>
              <template #tip>
                <div class="upload-tip">最多可上傳 {{ 3 - formModel.attachments.length }} 個檔案</div>
              </template>
            </el-upload>
          </div>

          <!-- 已有附件列表 -->
          <div class="attachments-block" v-if="formModel.attachments?.length > 0">
            <div class="block-header">
              <h4 class="block-title">已有單元附件 ({{ defaultAttachmentList.length }})</h4>
            </div>
            <div class="attachment-list">
              <div
                v-for="attachment in defaultAttachmentList"
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
                    size="small"
                    @click="handleDeleteAttachment(attachment.attachmentId)"
                  >
                    刪除
                  </el-button>
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
          </div>
        </el-form>
    </div>
  </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存更新</el-button>
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

.upload-area {
  width: 100%;
  height: 100%;
}

.upload-area :deep(.el-upload) {
  width: 100%;
  height: 100%;
}

.upload-area :deep(.el-upload-dragger) {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
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

.upload-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.upload-hint {
  color: var(--el-color-primary);
  font-size: 13px;
}

.lesson-form {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.form-section {
  margin-bottom: 0;
}

.form-item-clean {
  margin-bottom: 16px;
}

.form-item-clean :deep(.el-form-item__label) {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  padding-bottom: 8px;
}

.input-clean,
.textarea-clean {
  width: 100%;
}

.input-clean :deep(.el-input__wrapper),
.textarea-clean :deep(.el-textarea__inner) {
  border-radius: 8px;
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

/* 開關區域 */
.switch-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
}

.switch-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

/* 影片操作按鈕 */
.video-actions {
  display: flex;
  gap: 12px;
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

.attachment-upload {
  margin-bottom: 8px;
}

.upload-tip {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 8px;
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

  .switch-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
