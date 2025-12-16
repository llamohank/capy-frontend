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

const { defaultLessonInfo, currentSectionInfo } = useLesson(props.sectionInfo);
const emit = defineEmits(["update:visible"]);
// onMounted(() => console.log(props.lessonInfo));
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
  (val) => {
    if (val) {
      formModel.value = {
        ...props.lessonInfo,
        videoUrl: props.videoUrl,
        attachments: props.lessonInfo?.attachments?.map((item) => ({ ...item })) ?? [],
      };
      console.log(props.videoUrl);
    } else {
    }
  }
);
// watch(
//   () => formModel.value.videoUrl,
//   async (newVal, oldVal) => {
//     // console.log(55);
//     if (!newVal) {
//       return;
//     }
//     if (!oldVal) {
//       await nextTick();
//       // console.log(videoPlayerRef.value);
//       try {
//         await videoPlayerRef.value.init();
//         await videoPlayerRef.value.play(newVal);
//         videoMeta.value.rawVideoHeight = videoPlayerRef.value.videoHeight;
//         videoMeta.value.durationSeconds = videoPlayerRef.value.videoDuration;
//       } catch (e) {
//         console.log(e);
//         ElMessage.error("影片播放錯誤");
//         videoPlayerRef.value.destroy();
//         formModel.value.videoUrl = null;
//       }

//       // console.log(requestData.value.videoHeight);
//       // console.log(videoPlayerRef.value.videoHeight);
//       return;
//     }
//     await videoPlayerRef.value.play(newVal);
//   }
// );

const handleDownloadAttachment = async (attachmentId) => {
  const { download } = useAttachment(attachmentId);
  await download();
};
</script>
<template>
  <el-dialog center v-model="dialogVisible" title="單元影片詳情" width="600">
    <el-form :model="formModel" label-position="top" size="large" class="dialogForm">
      <el-form-item label="單元影片標題 :">
        <p>
          {{ formModel.lessonTitle }}
          <el-tag style="margin-left: 8px" v-show="formModel.freePreview">試看單元</el-tag>
        </p>
      </el-form-item>
      <el-form-item label="對應章節 :">
        <p>{{ currentSectionInfo?.title }}</p>
      </el-form-item>
      <el-form-item label="單元影片簡介 :">
        <p>{{ formModel.description }}</p>
      </el-form-item>

      <el-form-item label="預覽影片 :">
        <div>
          <div v-if="formModel.videoUrl">
            <VideoPlayer ref="videoPlayerRef" />
          </div>
          <p v-else>尚無影片</p>
        </div>
      </el-form-item>
      <el-form-item label="單元附件 :">
        <div style="width: 100%">
          <ul v-if="formModel.attachments?.length > 0" class="attachment-list">
            <li
              class="attachment-list-item"
              v-for="attachment in formModel.attachments"
              :key="attachment.attachmentId"
            >
              <p style="width: 250px; display: flex">
                <span style="margin-right: 8px"
                  ><el-icon><Document /></el-icon></span
                ><el-text truncated>{{ attachment.fileName }}</el-text>
              </p>
              <div>
                <el-button
                  link
                  @click="handleDownloadAttachment(attachment.attachmentId)"
                  type="primary"
                  >下載</el-button
                >
              </div>
            </li>
          </ul>
          <el-empty v-else description="此單元沒有附件" />
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<style scoped>
.attachment-list-item {
  display: flex;
  gap: 24px;
}
</style>
