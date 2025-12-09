<script setup>
import { useLesson } from "@/composable/useLesson";
import VideoPlayer from "../admin/VideoPlayer.vue";

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
const emit = defineEmits(["update:visible", "confirm"]);
const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit("update:visible", val);
  },
});
const formModel = ref({ ...props.lessonInfo, videoUrl: props.videoUrl });

const requestData = computed(() => {
  return {
    ...formModel.value,
    lessonDescription: formModel.value.description,
    videoMeta: videoMeta.value,
    attachmentOps: attachmentOps.value,
  };
});
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
const handleVideoChange = (file) => {
  formModel.value.videoUrl = URL.createObjectURL(file.raw);
  videoMeta.value.fileSize = file.raw.size;
};

watch(
  () => formModel.value.videoUrl,
  async (newVal, oldVal) => {
    // console.log(55);
    if (!oldVal) {
      await nextTick();
      // console.log(videoPlayerRef.value);
      await videoPlayerRef.value.init();
      await videoPlayerRef.value.play(newVal);
      videoMeta.value.rawVideoHeight = videoPlayerRef.value.videoHeight;
      videoMeta.value.durationSeconds = videoPlayerRef.value.videoDuration;
      // console.log(requestData.value.videoHeight);
      // console.log(videoPlayerRef.value.videoHeight);
      return;
    }
    await videoPlayerRef.play(newVal);
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
const handleAttachmentRemove = (file, files) => {
  console.log(file);
  console.log(files);
  attachmentList.value = files;
};
const attachmentList = ref([]);
//新增的Ops
const newAttachmentList = computed(() =>
  attachmentList.value?.map((attachment, index) => ({ isDelete: false, fileIndex: index }))
);
const deleteAttachmentList = computed(() => {
  if (props.isEdit) {
    return props.lessonInfo.attachments.filter((attachment) => attachment.isDelete);
  }
  return [];
});
const attachmentOps = computed(() => [...newAttachmentList.value, ...deleteAttachmentList.value]);
//新增的檔案
const attachmentFileList = computed(() => attachmentList.value?.map((file) => file.raw));
onMounted(() => {
  if (!props.isEdit) {
    formModel.value = { ...defaultLessonInfo, videoUrl: props.videoUrl };
  }
});
const save = () => {
  const data = {};
  data.request = requestData.value;
  data.fileList = attachmentFileList.value;
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
      <el-form-item label="預覽影片 :">
        <div style="width: 100%">
          <el-upload
            :auto-upload="false"
            :on-change="handleVideoChange"
            :limit="1"
            :on-exceed="handleVideoExceed"
            v-if="!formModel.videoUrl"
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
          <div v-else>
            <VideoPlayer ref="videoPlayerRef" />
            <div>
              <el-button>選擇影片檔案</el-button>
              <el-button>清空</el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="上傳單元附件 :">
        <!-- <el-upload class="upload" style="width: 100%" drag>
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
          <template #tip>
            <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
          </template>
        </el-upload> -->
        <div>
          <el-upload
            multiple
            :auto-upload="false"
            :on-remove="handleAttachmentRemove"
            :on-change="handleAttachmentChange"
            :limit="3"
            :on-exceed="handleAttachmentExceed"
          >
            <el-button type="primary">選擇上傳文件</el-button>
            <el-button type="info">清空上傳列表</el-button>
            <template #tip>
              <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
            </template>
          </el-upload>
        </div>
        <ul v-if="formModel.attachments.length > 0">
          <li>1</li>
        </ul>
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
<style scoped></style>
