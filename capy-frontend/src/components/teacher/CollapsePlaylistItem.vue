<script setup>
import { VueDraggable as Draggable } from "vue-draggable-plus";
import TextInputDialog from "../common/TextInputDialog.vue";
import { useLesson } from "@/composable/useLesson";
import { useCourseStore } from "@/stores/course";
import AlertDialog from "../common/AlertDialog.vue";
import LessonFormDialog from "./LessonFormDialog.vue";
import { getVideoUrl } from "@/api/teacher/video";
import { createLesson, updateLesson } from "@/api/teacher/course";

const props = defineProps({
  sectionInfo: {
    type: Object,
    required: true,
  },
});
const courseStore = useCourseStore();
const { deleteSection, updateSection } = useLesson(props.sectionInfo);
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
  // currentLesson.value =
  showLessonDialog.value = true;
  // form.value = {
  //   name: "",
  //   isFree: false,
  //   cate: "",
  // };
};
const handleEditLesson = async (lessonInfo) => {
  isEditLesson.value = true;
  currentLesson.value = lessonInfo;
  const res = await getVideoUrl(lessonInfo.lessonId);
  console.log(res);
  if (res.signedUrl) {
    lessonVideoUrl.value = res.signedUrl;
  }
  showLessonDialog.value = true;
  // lessonDialogRef.value.open();
};
const handleSaveLesson = async (data) => {
  data.request.courseId = courseStore.currentCourseId;
  data.request.sectionId = props.sectionInfo.sectionId;
  if (!isEditLesson.value) {
    // data.request.lessonId=1
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

  // console.log(fd);
  if (!isEditLesson.value) {
    const res = await createLesson(fd);
    console.log(res);
  } else {
    const res = await updateLesson(fd);
    console.log(res);
  }
};
const checkIsUploading = (lessonId) => {
  return true;
};
/////////////////////////
const tableData = ref([
  {
    date: "2016-05-03",
    name: "Tom",
    isFree: true,
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    isFree: false,
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    isFree: false,
    address: "No. 189, Grove St, Los Angeles",
  },
]);

// const modelMode = computed(() => {
//   return isEdit.value ? "編輯單元影片" : "添加單元影片";
// });
// const dialogFormVisible = ref(false);
// const editChapterDialog = ref(false);
// const editChapter = () => {
//   editChapterDialog.value = true;
// };
// const deleteChapter = () => {
//   if (props.sectionInfo?.lessons.length > 0) {
//     ElMessage.error("該章節尚有單元影片");
//     return;
//   }
//   //刪除api
// };

const editLessonVid = (lesson) => {
  isEdit.value = true;
  dialogFormVisible.value = true;
  form.value = lesson;
};
const deleteLessonVid = async () => {
  try {
    await ElMessageBox.confirm("即將刪除此單元影片!", "提醒", {
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      type: "warning",
      center: true,
    });
    ElMessage.success("刪除成功");
  } catch (e) {
    ElMessage.info("已取消刪除");
  }
};
</script>
<template>
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
    :videoUrl="lessonVideoUrl"
    @confirm="handleSaveLesson"
    ref="lessonDialogRef"
    v-model:visible="showLessonDialog"
    :isEdit="isEditLesson"
    :lessonInfo="currentLesson"
  />

  <el-collapse-item>
    <template #icon="{ isActive }">
      <el-icon size="large" v-show="isActive"><ArrowDownBold /></el-icon>
      <el-icon size="large" v-show="!isActive"><ArrowRightBold /></el-icon>
    </template>
    <template #title>
      <div style="display: flex; align-items: center; gap: 12px">
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
        <Draggable v-model="tableData">
          <li v-for="(lesson, index) in sectionInfo?.lessons" :key="lesson.lessonId">
            <div style="display: flex; align-items: center">
              <span class="index">{{ index < 10 ? "0" + (index + 1) : index }}</span
              >{{ lesson.lessonTitle
              }}<el-tag v-show="lesson.freePreview" style="margin-left: 8px">試看單元</el-tag>
            </div>
            <div v-if="checkIsUploading(lesson.lessonId)">
              {{ lesson.lessonDurationSeconds }}
              <el-button style="margin-left: 8px" @click="handleEditLesson(lesson)"
                >編輯
              </el-button>
              <el-button type="info" @click="deleteLessonVid(lesson)">刪除 </el-button>
            </div>
          </li>
        </Draggable>
      </ul>
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
