<script setup>
// import { VueDraggable as Draggable } from "vue-draggable-plus";
// import TextInputDialog from "../../common/TextInputDialog.vue";
// import { useLesson } from "@/composable/useLesson";
// import { useCourseStore } from "@/stores/course";
// import { useVideo } from "@/composable/useVideo";
import LessonFormDialog from "./LessonFormDialog.vue";
import { getVideoUrl } from "@/api/teacher/video";
// import { createLesson, updateLesson } from "@/api/teacher/course";
// import { useVideoStore } from "@/stores/video";
import transformSeconds from "@/utils/timetransform";
const props = defineProps({
  sectionInfo: {
    type: Object,
    required: true,
  },
});
// const courseStore = useCourseStore();
// const { deleteSection, updateSection, deleteCourseLesson, reorderCourseLesson } = useLesson(
//   props.sectionInfo
// );

//lesson
const isEditLesson = ref(false);
const currentLesson = ref(null);
const showLessonDialog = ref(false);
const lessonVideoUrl = ref(null);

const handleEditLesson = async (lessonInfo) => {
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
  <!-- //添加單元影片dialog form -->
  <LessonFormDialog
    :sectionInfo="props.sectionInfo"
    v-model:videoUrl="lessonVideoUrl"
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
      </div>
    </template>
    <div>
      <ul v-if="sectionInfo.lessons?.length > 0" class="course-playlist">
        <li v-for="(lesson, index) in sectionInfo?.lessons" :key="lesson.lessonId">
          <div style="display: flex; align-items: center; flex: 2">
            <span class="index">{{ index < 10 ? "0" + (index + 1) : index }}</span
            >{{ lesson.lessonTitle
            }}<el-tag v-show="lesson.freePreview" style="margin-left: 8px">試看單元</el-tag>
          </div>
          <div>
            {{
              lesson.videoAssetStatus === "upload_failed"
                ? "暫無影片"
                : transformSeconds(lesson.lessonDurationSeconds)
            }}

            <el-button style="margin-left: 8px" type="primary" @click="handleEditLesson(lesson)"
              >查看
            </el-button>
          </div>
        </li>
      </ul>
    </div>
  </el-collapse-item>
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
