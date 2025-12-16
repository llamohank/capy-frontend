<script setup>
import { submitCourse } from "@/api/teacher/course";
import CourseAttachment from "@/components/teacher/CourseAttachment.vue";
import CourseDetailForm from "@/components/teacher/CourseDetailForm.vue";
import CoursePlaylist from "@/components/teacher/CoursePlaylist.vue";
import { useCourseStore } from "@/stores/course";
import { useRouter } from "vue-router";
const router = useRouter();
const courseStore = useCourseStore();
const detailFormRef = ref(null);
const playlistRef = ref(null);
const attachmentRef = ref(null);

const handleDeleteCourse = async () => {
  try {
    await ElMessageBox.confirm("是否刪除此課程?", "警告", {
      confirmButtonText: "確認",
      cancelButtonText: "取消",
      type: "warning",
      center: true,
    });
  } catch (error) {
    ElMessage({
      type: "info",
      message: "已取消刪除",
    });
    return;
  }
  try {
    await courseStore.fetchDeleteCourse();
    router.push({ name: "mycourse" });
  } catch (e) {
    console.log(e);
  }
};
const handlePublishCourse = async () => {
  try {
    //ref 的next方法
    await detailFormRef.value.next();
    await playlistRef.value.next();
  } catch (e) {
    ElMessage.error(e.message);
    return;
  }
  try {
    await submitCourse(courseStore.currentCourseId);
    ElMessage.success("申請上架成功");
    router.push({ name: "mycourse" });
  } catch (e) {
    ElMessage.error("申請上架失敗");
  }
};
</script>
<template>
  <div style="display: flex; flex-direction: column; gap: 48px">
    <CourseDetailForm ref="detailFormRef" />
    <CoursePlaylist ref="playlistRef" />
    <CourseAttachment ref="attachmentRef" />
    <div class="bottom-operation-btn-group">
      <el-button size="large" type="info" @click="$router.go(-1)">返回</el-button>
      <el-button size="large" type="danger" @click="handleDeleteCourse">刪除課程</el-button>
      <el-button size="large" type="primary" @click="handlePublishCourse">申請上架</el-button>
    </div>
  </div>
</template>
<style scoped>
.bottom-operation-btn-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
}
</style>
