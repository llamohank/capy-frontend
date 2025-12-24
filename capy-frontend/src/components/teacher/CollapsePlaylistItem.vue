<script setup>
import { ref, computed, watch } from "vue";
// import { ArrowRight, CirclePlus, Clock, VideoPlay } from "@element-plus/icons-vue";

import { VueDraggable as Draggable } from "vue-draggable-plus";
import TextInputDialog from "../common/TextInputDialog.vue";
import AlertDialog from "../common/AlertDialog.vue";
import LessonFormDialog from "./LessonFormDialog.vue";
import { useLesson } from "@/composable/useLesson";
import { useCourseStore } from "@/stores/course";
import { useVideo } from "@/composable/useVideo";
import { useVideoStore } from "@/stores/video";
import { getVideoUrl } from "@/api/teacher/video";
import { createLesson, updateLesson } from "@/api/teacher/course";
const emit = defineEmits(["dragDisabled"]);
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

const courseStore = useCourseStore();
const videoStore = useVideoStore();
const { deleteSection, updateSection, deleteCourseLesson, reorderCourseLesson } = useLesson(
  props.sectionInfo
);
const uploadingList = ref([]);
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

// Section dialogs
const sectionTitle = ref(props.sectionInfo.title);
const showSectionEditDialog = ref(false);
const showSectionDeleteDialog = ref(false);

const handleEditSection = async (val) => {
  await updateSection(val);
};

const handleDeleteSection = async () => {
  await deleteSection();
};

// Lesson dialogs
const lessonDialogRef = ref(null);
const isEditLesson = ref(false);
const currentLesson = ref(null);
const showLessonDialog = ref(false);
const lessonVideoUrl = ref(null);

const handleCreateLesson = () => {
  isEditLesson.value = false;
  lessonVideoUrl.value = null;
  showLessonDialog.value = true;
};

const handleEditLesson = async (lessonInfo) => {
  isEditLesson.value = true;
  currentLesson.value = lessonInfo;
  const res = await getVideoUrl(lessonInfo.lessonId);
  if (res?.signedUrl) {
    lessonVideoUrl.value = res.signedUrl;
  }
  showLessonDialog.value = true;
};

const handleSaveLesson = async (data) => {
  data.request.courseId = courseStore.currentCourseId;
  data.request.sectionId = props.sectionInfo.sectionId;
  if (!isEditLesson.value) {
    data.request.displayOrder = props.sectionInfo.lessons.length;
  }
  const fd = new FormData();
  fd.append(
    "uploadRequest",
    new Blob([JSON.stringify(data.request)], { type: "application/json" })
  );
  for (let i = 0; i < data.fileList.length; i++) {
    fd.append("attachments", data.fileList[i]);
  }

  try {
    if (!isEditLesson.value) {
      const res = await createLesson(fd);
      await courseStore.fetchCourseOverview();
      if (data.request.videoMeta) {
        ElMessage.warning("影片上傳中，請勿離開當前頁面或重新刷新");
        // const videoStore = useVideoStore();
        // videoStore.append({ lessonId: res.lessonId, videoAssetId: res.videoInfo.videoAssetId });
        // const { uploadVideoToGCP } = useVideo(res.videoInfo.videoAssetId);
        const task = {
          lessonId: res.lessonId,
          videoId: res.videoInfo.videoAssetId,
          lessonName: res.lessonTitle,
          initiateURL: res.videoInfo.initiateUrl,
          file: data.videoFile,
          fileSize: data.videoFile.size,
          uploadedBytes: 0,
          progressPersent: 0,
          isUploading: false,
          isPause: false,
        };
        // uploadingList.value.push(res.lessonId);
        await videoStore.uploadVideoToGCP(task);
        console.log(897);
      } else {
        ElMessage.success("創建成功");
      }
    } else {
      const res = await updateLesson(fd);
      await courseStore.fetchCourseOverview();
      if (data.request.videoMeta) {
        ElMessage.warning("影片上傳中，請勿離開當前頁面或重新刷新");
        // const videoStore = useVideoStore();
        // videoStore.append({ lessonId: res.lessonId, videoAssetId: res.videoInfo.videoAssetId });
        // const { uploadVideoToGCP } = useVideo(res.videoInfo.videoAssetId);
        // await uploadVideoToGCP(res.videoInfo.initiateUrl, data.videoFile);
        const task = {
          lessonId: res.lessonId,
          videoId: res.videoInfo.videoAssetId,
          lessonName: res.lessonTitle,
          initiateURL: res.videoInfo.initiateUrl,
          file: data.videoFile,
          fileSize: data.videoFile.size,
          uploadedBytes: 0,
          progressPersent: 0,
          isUploading: false,
          isPause: false,
        };
        // console.log(uploadingList.value.length);
        // uploadingList.value.push(res.lessonId);
        // console.log(uploadingList.value.length);
        // console.log(uploadingList.value);
        await videoStore.uploadVideoToGCP(task);
        console.log(568);
      } else {
        ElMessage.success("更新成功");
      }
    }
  } catch (e) {
    console.log(e);
    const message = isEditLesson.value ? "更新失敗" : "創建失敗";
    ElMessage.error(message);
  }
};

const uploadingTaskMap = computed(() => {
  const map = new Map();
  videoStore.uploadingTasks.forEach((task) => {
    map.set(task.lessonId, task);
  });
  return map;
});
const getUploadingTask = (lessonId) => uploadingTaskMap.value.get(lessonId);
const checkIsUploading = (lessonId) => !!getUploadingTask(lessonId);
const findUploadingProgress = (lessonId) =>
  Number(getUploadingTask(lessonId)?.progressPersent || 0);
const checkIsPause = (lessonId) => getUploadingTask(lessonId)?.isPause;
// const checkUploadingStatus = (lessonId) => getUploadingTask(lessonId)?.isUploading;
const checkUploadingStatus = (lessonId) => {
  const task = getUploadingTask(lessonId);
  return task.isUploading || task.isPause;
};
const handleDeleteLesson = async (lessonId) => {
  await deleteCourseLesson(lessonId);
};

// Lesson reorder
const lessonOrderList = computed(() => {
  return props.sectionInfo.lessons.map((lesson) => lesson.lessonId);
});

let reverseFlag = false;
watch(lessonOrderList, async (newVal, oldVal) => {
  if (reverseFlag) {
    reverseFlag = false;
    return;
  }
  const map = new Map(props.sectionInfo.lessons.map((s) => [s.lessonId, s]));
  const verify = () => {
    return newVal.every((val, index) => val === oldVal[index]);
  };
  if (newVal.length <= 1) {
    return;
  }
  if (newVal.length === oldVal.length + 1 && !isEditLesson.value) {
    return;
  }
  if (newVal.length === oldVal.length && verify()) {
    return;
  }

  try {
    await reorderCourseLesson(newVal);
    ElMessage.success("單元影片順序更新!");
  } catch (e) {
    ElMessage.error("影片順序更新失敗!");
    reverseFlag = true;
    props.sectionInfo.lessons = oldVal.map((id) => map.get(id)).filter((item) => item);
  }
});

const handleStartDrag = () => {
  ElMessage.primary("拖拽以調整單元影片順序");
  console.log(isDraggable.value);
};
const isDraggable = computed(() => {
  return showSectionEditDialog.value || showSectionDeleteDialog.value || showLessonDialog.value;
});

watch(
  () => isDraggable.value,
  (val) => {
    emit("dragDisabled", !val);
  }
);
const handlePauseUploading = (lessonId) => {
  console.log(lessonId);
  videoStore.pauseUploading(lessonId);
  console.log(12);
};
const handleResumableUpload = (lessonId) => {
  videoStore.resumableUpload(lessonId);
};
const handelCancelUploading = (lessonId) => {
  videoStore.cancelUploading(lessonId);
};
</script>

<template>
  <div>
    <!-- Dialogs -->
    <TextInputDialog
      @confirm="handleEditSection"
      v-model:visible="showSectionEditDialog"
      v-model:inputValue="sectionTitle"
      title="編輯章節名稱"
      placeholder="輸入章節名稱"
    />
    <AlertDialog
      @confirm="handleDeleteSection"
      v-model:visible="showSectionDeleteDialog"
      title="刪除章節"
      alert-text="確定要刪除"
      :highlight="props.sectionInfo.title"
    />
    <LessonFormDialog
      :sectionInfo="props.sectionInfo"
      v-model:videoUrl="lessonVideoUrl"
      @confirm="handleSaveLesson"
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
            <span class="section-number">{{ String(sectionIndex).padStart(2, "0") }}</span>
            <span class="section-name">{{ sectionInfo.title }}</span>
          </div>
          <div class="section-actions">
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
            <div class="section-buttons">
              <el-button size="small" @click.stop="showSectionEditDialog = true">編輯</el-button>
              <el-button
                size="small"
                type="danger"
                plain
                @click.stop="showSectionDeleteDialog = true"
                >刪除</el-button
              >
            </div>
          </div>
        </div>
      </template>

      <div class="lessons-content">
        <!-- 新增單元按鈕 -->
        <div class="add-lesson-btn" @click="handleCreateLesson">
          <el-icon><CirclePlus /></el-icon>
          <span>上傳單元影片</span>
        </div>

        <!-- 單元列表 -->
        <div v-if="sectionInfo.lessons?.length > 0" class="lessons-list">
          <Draggable
            @start="handleStartDrag"
            v-model="sectionInfo.lessons"
            class="lessons-draggable"
          >
            <div
              v-for="(lesson, index) in sectionInfo.lessons"
              :key="lesson.lessonId"
              class="lesson-item"
            >
              <div class="lesson-left">
                <span class="lesson-index">{{ (index + 1).toString().padStart(2, "0") }}</span>
                <span class="lesson-name">{{ lesson.lessonTitle }}</span>
                <el-tag
                  v-if="lesson.freePreview"
                  size="small"
                  effect="plain"
                  type="info"
                  class="free-tag"
                >
                  試看
                </el-tag>
              </div>
              <!-- 沒有在上傳 -->
              <div class="lesson-right" v-if="!checkIsUploading(lesson.lessonId)">
                <span class="lesson-duration">
                  {{
                    lesson.videoAssetStatus === "upload_failed" ||
                    !lesson.videoAssetStatus ||
                    lesson.videoAssetStatus === "uploading"
                      ? "暫無影片"
                      : formatDuration(lesson.lessonDurationSeconds)
                  }}
                </span>
                <el-button size="small" type="primary" plain @click="handleEditLesson(lesson)">
                  編輯
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  plain
                  @click="handleDeleteLesson(lesson.lessonId)"
                >
                  刪除
                </el-button>
              </div>
              <!-- 上傳中的狀態 -->
              <div class="lesson-right uploading" v-else>
                <div v-if="checkUploadingStatus(lesson.lessonId)">
                  <!-- <span class="uploading-text">等待上傳中...</span>
                <span class="uploading-text">等待上傳中...</span> -->
                  <div style="display: flex; justify-content: space-between">
                    <div style="margin-right: 48px">
                      <el-button
                        @click="handleResumableUpload(lesson.lessonId)"
                        v-if="checkIsPause(lesson.lessonId)"
                        class="uploading-text"
                        type="primary"
                        link
                        ><el-icon size="large"><VideoPlay /></el-icon>繼續</el-button
                      >
                      <el-button
                        @click="handlePauseUploading(lesson.lessonId)"
                        v-else
                        class="uploading-text"
                        type="primary"
                        link
                        ><el-icon size="large"><VideoPause /></el-icon>暫停</el-button
                      >
                    </div>
                    <el-button
                      @click="handelCancelUploading(lesson.lessonId)"
                      size="small"
                      type="info"
                      link
                      >取消上傳</el-button
                    >
                  </div>
                  <el-progress
                    :percentage="findUploadingProgress(lesson.lessonId)"
                    style="width: 100%"
                  />
                </div>
                <div v-else>
                  <span class="uploading-text">等待上傳中...</span>
                  <el-progress
                    :percentage="100"
                    :show-text="false"
                    :indeterminate="true"
                    :duration="5"
                    style="width: 120px"
                  />
                </div>
              </div>
            </div>
          </Draggable>
        </div>

        <el-empty v-else description="暫無單元" :image-size="60" />
      </div>
    </el-collapse-item>
  </div>
</template>

<style scoped>
/* 章節摺疊樣式 */
.section-collapse-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

/* Override Element Plus Collapse Item Header */
:deep(.el-collapse-item__header) {
  background-color: #fafafa;
  border-bottom: 1px solid transparent;
  padding: 0 16px;
  height: auto;
  min-height: 56px;
  transition: all 0.2s ease;
}
:deep(.el-collapse-item__header:not(.is-active)) {
  cursor: grab;
}
:deep(.el-collapse-item__header):hover .section-number {
  font-weight: 700;
  color: var(--el-color-primary);
}
:deep(.el-collapse-item__header.is-active) {
  border-bottom-color: #e5e7eb;
  background-color: #ffffff;
}
:deep(.el-collapse-item__header.is-active) .section-number {
  font-weight: 700;
  color: var(--el-color-primary);
}

:deep(.el-collapse-item__wrap) {
  border: none;
}

:deep(.el-collapse-item__content) {
  padding: 0;
  background-color: #ffffff;
}

.collapse-icon {
  font-size: 14px;
  color: #9ca3af;
  transition: transform 0.3s;
  margin-right: 8px;
}

.collapse-icon.is-active {
  transform: rotate(90deg);
  color: #4b5563;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 0;
  gap: 12px;
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
  color: #6b7280;
  min-width: 24px;
}

.section-name {
  font-size: 15px;
  font-weight: 500;
  color: #111827;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 16px;
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
  color: #9ca3af;
}

.section-buttons {
  display: flex;
  gap: 8px;
}

/* 內容區域 */
.lessons-content {
  padding: 12px 16px;
}

/* 新增單元按鈕 */
.add-lesson-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 12px;
}

.add-lesson-btn:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
  background-color: #f9fafb;
}

/* 單元列表樣式 */
.lessons-list {
  display: flex;
  flex-direction: column;
}

.lessons-draggable {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lesson-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background-color: #fafafa;
  border-radius: 6px;
  cursor: grab;
  transition: background-color 0.15s ease;
  border-left: 2px solid transparent;
}

.lesson-item:hover {
  background-color: #f3f4f6;
}
.lesson-item:hover .lesson-index {
  color: var(--el-color-primary);
  font-weight: 700;
}

.lesson-item:active {
  cursor: grabbing;
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
  color: #d1d5db;
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
  flex-shrink: 0;
}

.lesson-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.lesson-right.uploading {
  gap: 8px;
}

.uploading-text {
  font-size: 13px;
  /* color: var(--el-color-warning); */
}

.lesson-duration {
  font-size: 13px;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
}

/* Media Queries */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .section-actions {
    width: 100%;
    justify-content: space-between;
  }

  .lesson-item {
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
