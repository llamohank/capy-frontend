<script setup>
import { VueDraggable as Draggable } from "vue-draggable-plus";
import TextInputDialog from "../common/TextInputDialog.vue";
import { useLesson } from "@/composable/useLesson";
import { useCourseStore } from "@/stores/course";
import { useVideo } from "@/composable/useVideo";
import AlertDialog from "../common/AlertDialog.vue";
import LessonFormDialog from "./LessonFormDialog.vue";
import { getVideoUrl } from "@/api/teacher/video";
import { createLesson, updateLesson } from "@/api/teacher/course";
import { useVideoStore } from "@/stores/video";
import transformSeconds from "@/utils/timetransform";
const props = defineProps({
  sectionInfo: {
    type: Object,
    required: true,
  },
});
const courseStore = useCourseStore();
const { deleteSection, updateSection, deleteCourseLesson, reorderCourseLesson } = useLesson(
  props.sectionInfo
);

const sectionTitle = ref(props.sectionInfo.title);
const showSectionEditDialog = ref(false);
const handleEditSection = async (val) => {
  await updateSection(val);
};
const showSectionDeleteDialog = ref(false);
const handleDeleteSection = async () => {
  await deleteSection();
};
//lesson
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
  console.log(res);
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
  console.log(data);
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
      console.log(res);
      if (data.request.videoMeta) {
        ElMessage.warning("影片上傳中，請勿離開當前頁面或重新刷新");
        //加入上傳列表 開始上傳
        const videoStore = useVideoStore();
        videoStore.append({ lessonId: res.lessonId, videoAssetId: res.videoInfo.videoAssetId });
        const { uploadVideoToGCP } = useVideo(res.videoInfo.videoAssetId);
        console.log(1);
        await uploadVideoToGCP(res.videoInfo.initiateUrl, data.videoFile);
      } else {
        // const message = isEditLesson.value ? "更新成功" : "創建成功";
        ElMessage.success("創建成功");
      }
    } else {
      const res = await updateLesson(fd);
      console.log(res);
      await courseStore.fetchCourseOverview();
      if (data.request.videoMeta) {
        ElMessage.warning("影片上傳中，請勿離開當前頁面或重新刷新");
        //加入上傳列表 開始上傳
        const videoStore = useVideoStore();
        videoStore.append({ lessonId: res.lessonId, videoAssetId: res.videoInfo.videoAssetId });
        // uploadToGCP()
        const { uploadVideoToGCP } = useVideo(res.videoInfo.videoAssetId);
        console.log(1);
        await uploadVideoToGCP(res.videoInfo.initiateUrl, data.videoFile);
      } else {
        // const message = isEditLesson.value ? "更新成功" : "創建成功";
        ElMessage.success("更新成功");
      }
    }
  } catch (e) {
    console.log(e);
    const message = isEditLesson.value ? "更新失敗" : "創建失敗";
    ElMessage.error(message);
  }
};
const checkIsUploading = (lessonId) => {
  const { isUploading } = useVideo();

  return isUploading(lessonId);
};

const handleDeleteLesson = async (lessonId) => {
  await deleteCourseLesson(lessonId);
};

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
  if (newVal.length < 1) {
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
  ElMessage.primary("托拽以調整單元影片順序");
};
</script>
<template>
  <div>
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
    <!-- //添加單元影片dialog form -->
    <LessonFormDialog
      :sectionInfo="props.sectionInfo"
      v-model:videoUrl="lessonVideoUrl"
      @confirm="handleSaveLesson"
      ref="lessonDialogRef"
      v-model:visible="showLessonDialog"
      :isEdit="isEditLesson"
      :lessonInfo="currentLesson"
    />

    <el-collapse-item :name="sectionInfo.sectionId ?? sectionInfo.id">
      <template #icon="{ isActive }">
        <el-icon size="large" v-show="isActive"><ArrowDownBold /></el-icon>
        <el-icon size="large" v-show="!isActive"><ArrowRightBold /></el-icon>
      </template>
      <template #title>
        <div
          style="
            display: flex;
            align-items: center;
            gap: 12px;
            padding-right: 24px;
            flex-wrap: wrap;
            justify-content: space-between;
          "
        >
          <p style="font-size: 20px; padding: 5px 0; padding-left: 20px">
            {{ sectionInfo?.title
            }}<span v-if="sectionInfo.lessons?.length > 0" style="font-size: 14px">
              | 共{{ sectionInfo?.lessons?.length }}單元 時長:992分鐘</span
            >
          </p>
          <div>
            <el-button @click.stop="showSectionEditDialog = true">編輯</el-button
            ><el-button @click.stop="showSectionDeleteDialog = true" type="info">刪除</el-button>
          </div>
        </div>
      </template>
      <div>
        <el-button plain class="upload-btn" @click="handleCreateLesson">
          <el-icon><CirclePlus /></el-icon>上傳單元影片</el-button
        >
        <ul v-if="sectionInfo.lessons?.length > 0" class="course-playlist">
          <Draggable @start="handleStartDrag" v-model="sectionInfo.lessons">
            <li v-for="(lesson, index) in sectionInfo?.lessons" :key="lesson.lessonId">
              <div style="display: flex; align-items: center; flex: 2">
                <span class="index">{{ index < 10 ? "0" + (index + 1) : index }}</span
                >{{ lesson.lessonTitle
                }}<el-tag v-show="lesson.freePreview" style="margin-left: 8px">試看單元</el-tag>
              </div>
              <div v-if="!checkIsUploading(lesson.lessonId)">
                {{
                  lesson.videoAssetStatus === "upload_failed"
                    ? "暫無影片"
                    : transformSeconds(lesson.lessonDurationSeconds)
                }}

                <el-button style="margin-left: 8px" @click="handleEditLesson(lesson)"
                  >編輯
                </el-button>
                <el-button type="info" @click="handleDeleteLesson(lesson.lessonId)"
                  >刪除
                </el-button>
              </div>
              <div v-else style="flex: 1">
                上傳中...請稍後
                <el-progress
                  :percentage="100"
                  :show-text="false"
                  :indeterminate="true"
                  :duration="5"
                />
              </div>
            </li>
          </Draggable>
        </ul>
      </div>
    </el-collapse-item>
  </div>
</template>
<style scoped>
:deep(.el-collapse-item__header) {
  background-color: rgb(221, 233, 246);
  border-radius: 8px;
}
:deep(.el-collapse-item__header.focusing:focus:not(:hover)) {
  color: #000;
}

:deep(.el-collapse-item__content) {
  padding: 10px 0;
  background-color: rgb(245, 247, 249);
  border-radius: 0 0 8px 8px;
}
/* :deep(.el-collapse-item) {
  background-color: rgb(245, 247, 249);
}
:deep(.el-collapse-item__wrap) {
  border-bottom: none;
} */
.upload-btn {
  width: 90%;
  margin-left: 5%;
  border: 1px dashed #000;
  text-align: center;
  border-radius: 8px;
  padding: 20px 0;
}
.course-playlist {
  margin-top: 10px;
  /* display: flex;
  flex-direction: column; */
  /* gap: 15px; */
}
.course-playlist li {
  margin-bottom: 4px;
  background-color: #fff;
  padding: 10px 10px;
  /* border-radius: 8px; */
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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

.collapse-chapter-btns {
  position: absolute;
  z-index: 10;
  display: flex;
  right: 20px;
}
</style>
