<script setup>
import CourseDetailForm from "@/components/teacher/CourseDetailForm.vue";
import CourseAttachment from "@/components/teacher/CourseAttachment.vue";
import CoursePlaylist from "@/components/teacher/CoursePlaylist.vue";
import { submitCourse } from "@/api/teacher/course";
import { useCourseStore } from "@/stores/course";
import { useRouter } from "vue-router";
const courseStore = useCourseStore();
const router = useRouter();
const stepComponentList = [CourseDetailForm, CoursePlaylist, CourseAttachment];
// import { usecreateCourseStore } from "@/stores/createCourse";
// const createCourseStore = usecreateCourseStore();
// console.log(createCourseStore.currentStep);
// const activeStep = ref(0);
// const currentStep = shallowRef(CourseDetailForm);
const activeStep = ref(0);
const activeStepCom = computed(() => stepComponentList[activeStep.value]);
const activeComRef = ref(null);
let isRequesting = false;
const goNextStep = async () => {
  if (isRequesting) {
    ElMessage.warning("處理中，請稍後");
  }
  if (activeStep.value === 2) {
    return;
  }
  try {
    isRequesting = true;
    if (activeComRef.value.next) {
      await activeComRef.value.next();
      activeStep.value++;
      stepProgressRef.value.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } catch (e) {
    // console.log(e.message);
    ElMessage.error(e.message);
  } finally {
    isRequesting = false;
  }

  // currentStep.value = stepComponentList[activeStep.value];
};
const goPreviousStep = () => {
  if (activeStep.value === 0) {
    return;
  }
  activeStep.value--;
  stepProgressRef.value.scrollIntoView({ behavior: "smooth", block: "start" });
  // currentStep.value = stepComponentList[activeStep.value];
};
const saveToDraft = () => {
  router.push({ name: "mycourse" });
  ElMessage.success("已儲存為草稿");
};
const saveAndPublish = async () => {
  try {
    await submitCourse(courseStore.currentCourseId);
    ElMessage.success("申請上架成功");
    router.push({ name: "mycourse" });
  } catch (e) {
    ElMessage.error("申請上架失敗");
  }
};
const deleteCourse = async () => {
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
const stepProgressRef = ref(null);
</script>
<template>
  <div>
    <div ref="stepProgressRef" class="step-bar">
      <el-steps
        style="width: 90%"
        :active="activeStep"
        align-center
        finish-status="wait"
        process-status="finish"
      >
        <el-step title="完成課程資訊" />
        <el-step title="上傳單元影片" />
        <el-step title="確認課程詳情" />
      </el-steps>
    </div>
    <div class="step-component">
      <keep-alive>
        <component ref="activeComRef" :is="activeStepCom" />
      </keep-alive>
    </div>

    <div class="step-switch-btn-group">
      <el-button size="large" v-show="activeStep > 0" @click="goPreviousStep">上一步</el-button>
      <el-button size="large" v-show="activeStep !== 2" type="primary" @click="goNextStep"
        >下一步</el-button
      >
      <el-button size="large" v-show="activeStep === 2" type="danger" @click="deleteCourse"
        >刪除此課程</el-button
      >
      <el-button size="large" v-show="activeStep === 2" type="info" @click="saveToDraft"
        >暫存為草稿</el-button
      >
      <el-button size="large" v-show="activeStep === 2" type="primary" @click="saveAndPublish"
        >立即申請上架</el-button
      >
    </div>
  </div>
</template>
<style scoped>
.step-bar {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  margin-bottom: 32px;
}
.step-component {
  margin-bottom: 48px;
  padding: 12px 20px;
}
.step-switch-btn-group {
  display: flex;
  justify-content: center;
  gap: 24px;
}
:deep(.el-step__head) {
  height: 48px;
  display: flex;
  /* align-items: center; */
  justify-content: center;
  /* transform: translateX(50%); */
}
:deep(.el-step__head.is-finish .el-step__icon) {
  background-color: #409eff;
  /* border-color: pink; */
  color: #fff;
}
:deep(.el-step__icon) {
  height: 100%;
  width: 48px;
  /* border-width: 4px; */
  background-color: #a8abb2;
  color: #fff;
  border: none;
}
:deep(.el-step__icon-inner) {
  font-size: 18px;
  font-weight: 700;
}
:deep(.el-step__line) {
  /* position: relative; */
  top: 50% !important;
  left: 50%;
  right: -50%;
  height: 4px !important;
  /* transform: translate(-50%, -50%); */
  /* background-color: pink; */
}
</style>
