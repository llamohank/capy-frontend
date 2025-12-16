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
    center
    v-model="dialogVisible"
    :title="props.isEdit ? '編輯單元影片' : '新增單元影片'"
    width="600"
  >
    <el-form :model="formModel" label-position="top" size="large" class="dialogForm">
      <el-form-item label="單元影片標題 :">
        <el-input style="width: 80%" v-model="formModel.lessonTitle" autocomplete="off" />
      </el-form-item>
      <el-form-item label="對應章節 :">
        <p>{{ currentSectionInfo?.title }}</p>
      </el-form-item>
      <el-form-item label="單元影片簡介 :">
        <el-input v-model="formModel.description" type="textarea" :rows="5" />
      </el-form-item>
      <el-form-item label="是否為試看單元 :">
        <el-switch
          v-model="formModel.freePreview"
          size="large"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>

      <el-form-item v-if="!formModel.videoUrl" label="上傳影片檔案 :">
        <div style="width: 100%">
          <el-upload
            :auto-upload="false"
            :on-change="handleVideoChange"
            :limit="1"
            :on-exceed="handleVideoExceed"
            class="upload"
            ref="videoUploadRef"
            style="width: 100%"
            drag
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
            <template #tip>
              <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
            </template>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item v-else label="預覽影片 :">
        <div>
          <VideoPlayer ref="videoPlayerRef" />
          <div>
            <el-button type="primary">重新選擇影片檔案</el-button>
            <el-button type="info">清空</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="新增單元附件 :">
        <div style="width: 100%">
          <div>
            <el-upload
              multiple
              ref="attachmentUploadRef"
              :auto-upload="false"
              :on-remove="handleAttachmentRemove"
              :on-change="handleAttachmentChange"
              :limit="3 - formModel.attachments.length"
              :on-exceed="handleAttachmentExceed"
            >
              <el-button type="primary">選擇上傳文件</el-button>
              <el-button type="info" @click.stop="handleAttachmentClear">清空上傳列表</el-button>
              <template #tip>
                <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
              </template>
            </el-upload>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-if="formModel.attachments?.length > 0" label="已有單元附件 :">
        <div>
          <ul class="attachment-list">
            <li
              class="attachment-list-item"
              v-for="attachment in defaultAttachmentList"
              :key="attachment.attachmentId"
            >
              <p style="width: 250px; display: flex">
                <span style="margin-right: 8px"
                  ><el-icon><Document /></el-icon></span
                ><el-text truncated>{{ attachment.fileName }}</el-text>
              </p>
              <div>
                <el-button link @click="handleDeleteAttachment(attachment.attachmentId)"
                  >刪除</el-button
                >
                <el-button
                  link
                  @click="handleDownloadAttachment(attachment.attachmentId)"
                  type="primary"
                  >下載</el-button
                >
              </div>
            </li>
          </ul>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save"> 保存更新 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped>
.attachment-list-item {
  display: flex;
  gap: 24px;
}
</style>
