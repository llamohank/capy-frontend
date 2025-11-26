<script setup>
import { VueDraggable as Draggable } from "vue-draggable-plus";
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
const props = defineProps({
  chapterinfo: {
    type: Object,
    required: true,
  },
});
const isEdit = ref(false);
const modelMode = computed(() => {
  return isEdit.value ? "編輯單元影片" : "添加單元影片";
});
const dialogFormVisible = ref(false);
const editChapterDialog = ref(false);
const editChapter = () => {
  editChapterDialog.value = true;
};
const deleteChapter = () => {
  if (props.chapterinfo?.lesson_info.length > 0) {
    ElMessage.error("該章節尚有單元影片");
    return;
  }
  //刪除api
};
const addLessonVid = () => {
  isEdit.value = false;
  dialogFormVisible.value = true;
  form.value = {
    name: "",
    isFree: false,
    cate: "",
  };
};
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
const form = ref({
  name: "",
  description: "",
  isFree: false,
  cate: "",
});
</script>
<template>
  <!-- //添加單元影片dialog form -->
  <el-dialog center v-model="dialogFormVisible" :title="modelMode" width="500">
    <el-form :model="form" label-position="top" size="large" class="dialogForm">
      <el-form-item label="單元影片標題 :">
        <el-input style="width: 80%" v-model="form.lesson_name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="對應章節 :">
        <el-input style="width: auto" disabled :value="chapterinfo?.chapter_name" />
      </el-form-item>
      <el-form-item label="單元影片簡介 :">
        <el-input v-model="form.lesson_description" type="textarea" :rows="5" />
      </el-form-item>
      <el-form-item label="是否為試看單元 :">
        <el-switch v-model="form.isFree" size="large" active-text="是" inactive-text="否" />
      </el-form-item>
      <el-form-item label="預覽影片 :">
        <el-upload
          class="upload"
          style="width: 100%"
          drag
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
          <template #tip>
            <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="上傳單元附件 :">
        <el-upload class="upload" style="width: 100%" drag>
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
          <template #tip>
            <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"> 保存更新 </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog center v-model="editChapterDialog"> 555 </el-dialog>
  <el-collapse-item>
    <template #icon="{ isActive }">
      <el-icon size="large" v-show="isActive"><ArrowDownBold /></el-icon>
      <el-icon size="large" v-show="!isActive"><ArrowRightBold /></el-icon>
    </template>
    <template #title>
      <div style="display: flex; align-items: center; gap: 12px">
        <p style="font-size: 20px; padding: 5px 0; padding-left: 20px">
          {{ chapterinfo.chapter_name
          }}<span style="font-size: 14px">
            | 共{{ chapterinfo?.lesson_info.length }}單元 時長:992分鐘</span
          >
        </p>
      </div>
    </template>
    <div>
      <ul class="course-playlist">
        <li v-for="(lesson, index) in chapterinfo?.lesson_info" :key="lesson.lessonid">
          <span
            ><span class="index">{{ index < 10 ? "0" + (index + 1) : index }}</span
            >{{ lesson.lesson_name
            }}<el-tag v-show="lesson.isFree" style="margin-left: 4px">試看單元</el-tag></span
          >
          <div>
            {{ lesson.duration_time }}
            <el-button style="margin-left: 8px" @click="editLessonVid(lesson)">查看 </el-button>
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
</style>
