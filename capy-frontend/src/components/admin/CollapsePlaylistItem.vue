<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { getRawSignedUrl, downloadAttachment } from "@/api/admin/course";
import VideoPlayer from "./VideoPlayer.vue";

const props = defineProps({
  sectionInfo: {
    type: Object,
    required: true,
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
  dialogFormVisible.value = true;

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
      await videoPlayerRef.value.init();
      await videoPlayerRef.value.play();
    } else if (!value && videoPlayerRef.value) {
      await videoPlayerRef.value.destroy();
      videoUrl.value = "";
    }
  }
);
</script>

<template>
  <!-- 單元影片詳情 dialog -->
  <el-dialog center v-model="dialogFormVisible" title="單元影片詳情" width="600">
    <el-form v-if="currentLesson" label-position="top" size="large" class="dialogForm">
      <el-form-item label="影片標題 :">
        <p class="lesson-title">
          {{ currentLesson.lessonTitle }}
          <el-tag style="margin-left: 8px" v-if="currentLesson.freePreview">試看單元</el-tag>
        </p>
      </el-form-item>
      <el-form-item label="對應章節 :">
        <p>{{ sectionInfo?.title }}</p>
      </el-form-item>
      <el-form-item label="影片簡介 :">
        <p>{{ currentLesson.description || "-" }}</p>
      </el-form-item>
      <el-form-item label="影片狀態 :">
        <el-tag :type="videoStatusType(currentLesson.videoAssetStatus)">
          {{ videoStatusMap[currentLesson.videoAssetStatus] || currentLesson.videoAssetStatus }}
        </el-tag>
      </el-form-item>
      <el-form-item label="預覽影片 :">
        <div v-loading="loadingVideo" style="width: 100%">
          <VideoPlayer v-if="videoUrl" ref="videoPlayerRef" :src="videoUrl" />
          <el-empty v-else description="無影片" :image-size="80" />
        </div>
      </el-form-item>
      <el-form-item label="單元附件 :" v-if="currentLesson.attachments?.length">
        <ul>
          <li
            v-for="att in currentLesson.attachments"
            :key="att.attachmentId"
            style="display: flex; align-items: center; line-height: 1.5; margin-bottom: 4px"
          >
            <el-icon style="margin-right: 4px"><Document /></el-icon>
            <span>{{ att.fileName }}</span>
            <el-button
              style="margin-left: 16px; font-size: 14px"
              type="primary"
              link
              @click="handleDownloadAttachment(att)"
            >
              下載
            </el-button>
          </li>
        </ul>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-collapse-item>
    <template #icon="{ isActive }">
      <el-icon size="large" v-show="isActive"><ArrowDownBold /></el-icon>
      <el-icon size="large" v-show="!isActive"><ArrowRightBold /></el-icon>
    </template>
    <template #title>
      <div style="display: flex; align-items: center; gap: 12px">
        <p style="font-size: 20px; padding: 5px 0; padding-left: 20px">
          {{ sectionInfo.title }}
          <span style="font-size: 14px">
            | 共{{ sortedLessons.length }}單元 時長:{{ totalDuration }}分鐘
          </span>
        </p>
      </div>
    </template>
    <div>
      <ul class="course-playlist">
        <li v-for="(lesson, index) in sortedLessons" :key="lesson.lessonId">
          <span>
            <span class="index">{{ (index + 1).toString().padStart(2, "0") }}</span>
            {{ lesson.lessonTitle }}
            <el-tag v-if="lesson.freePreview" style="margin-left: 8px" size="large">試看單元</el-tag>
          </span>
          <div>
            {{ formatDuration(lesson.lessonDurationSeconds) }}
            <el-button style="margin-left: 8px" @click="openLessonDetail(lesson)">查看</el-button>
          </div>
        </li>
      </ul>
      <el-empty v-if="!sortedLessons.length" description="暫無單元" :image-size="60" />
    </div>
  </el-collapse-item>
</template>

<style scoped>
:deep(.el-collapse-item__header) {
  background-color: rgb(221, 233, 246);
  border-radius: 8px;
}
:deep(.el-collapse-item__content) {
  padding: 10px 0;
  background-color: rgb(245, 247, 249);
  border-radius: 0 0 8px 8px;
}

.course-playlist {
  margin-top: 10px;
}
.course-playlist li {
  margin-bottom: 4px;
  background-color: #fff;
  padding: 10px 10px;

  display: flex;
  justify-content: space-between;
}
.course-playlist li .index {
  font-size: 20px;
  font-weight: 700;
  margin-right: 8px;
}
.course-playlist li:hover {
  background-color: #eff4f9;
}
.dialogForm {
  padding: 16px;
}
:deep(.el-form-item__content) {
  padding-left: 12px;
}
:deep(.el-form-item__label) {
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}
:deep(.el-form-item) {
  margin-bottom: 12px;
}
:deep(.el-dialog__header) {
  padding-top: 16px;
  padding-bottom: 48px;
}
</style>
