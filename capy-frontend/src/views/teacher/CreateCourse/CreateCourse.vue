<script setup>
import CourseDetailForm from "@/components/teacher/CourseDetailForm.vue";
import CourseAttachment from "@/components/teacher/CourseAttachment.vue";
import CoursePlaylist from "@/components/teacher/CoursePlaylist.vue";
const stepComponentList = [CourseDetailForm, CoursePlaylist, CourseAttachment];
const activeStep = ref(0);
const currentStep = shallowRef(CourseDetailForm);
const goNextStep = () => {
  if (activeStep.value === 2) {
    return;
  }
  activeStep.value++;
  currentStep.value = stepComponentList[activeStep.value];
};
const goPreviousStep = () => {
  if (activeStep.value === 0) {
    return;
  }
  activeStep.value--;
  currentStep.value = stepComponentList[activeStep.value];
};
const saveToDraft = () => {
  console.log("draft");
};
const saveAndPublish = () => {
  console.log("publish");
};
</script>
<template>
  <div>
    <div class="step-bar">
      <el-steps
        style="width: 90%"
        :active="activeStep"
        align-center
        finish-status="wait"
        process-status="finish"
      >
        <el-step title="完成課程資訊" description="Some description" />
        <el-step title="上傳單元影片" description="Some description" />
        <el-step title="確認課程詳情" description="Some description" />
      </el-steps>
    </div>
    <div class="step-component">
      <component :is="currentStep" />
    </div>

    <div class="step-switch-btn-group">
      <el-button size="large" v-show="activeStep > 0" @click="goPreviousStep">上一步</el-button>
      <el-button size="large" v-show="activeStep !== 2" type="primary" @click="goNextStep"
        >下一步</el-button
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
  margin-bottom: 48px;
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
</style>
