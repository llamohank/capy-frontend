<script setup>
import CourseDetailForm from "@/components/teacher/readonly/CourseDetailForm.vue";
import CourseAttachment from "@/components/teacher/readonly/CourseAttachment.vue";
import CoursePlaylist from "@/components/teacher/readonly/CoursePlaylist.vue";
const props = defineProps({
  status: {
    type: String,
  },
});
const switchAlertType = (status) => {
  switch (status) {
    case "published":
      return "success";
    case "review":
      return "warning";
    case "banned":
      return "error";
    case "draft":
    default:
      return "primary";
  }
};
//alert類型
const alertType = computed(() => {
  return switchAlertType(props.status);
});
//alert標題
const alertTitle = computed(() => {
  switch (alertType.value) {
    case "success":
      return "課程目前狀態為 : 上架中";
    case "warning":
      return "課程目前狀態為 : 審核中";
    case "error":
      return "課程目前狀態為 : 鎖定中";
    default:
      return "";
  }
});
//alert訊息
const alertDescription = computed(() => {
  switch (alertType.value) {
    case "success":
      return "僅可編輯價格";
    case "warning":
      return "審核需3-5個工作天，請耐心等候";
    case "error":
      return "請聯繫平台客服";
    default:
      return "";
  }
});
</script>
<template>
  <div class="section-heading">課程詳情</div>
  <div v-show="!(alertType === 'primary')" style="padding: 8px; margin-bottom: 32px">
    <el-alert
      :description="alertDescription"
      :title="alertTitle"
      :type="alertType"
      show-icon
      :closable="false"
      style="border-radius: 12px; padding: 18px 16px"
    />
  </div>
  <div style="display: flex; flex-direction: column; gap: 48px">
    <CourseDetailForm />
    <CoursePlaylist />
    <CourseAttachment />
    <div class="operation-btn-group">
      <el-button size="large" type="info">返回</el-button>
      <el-button size="large" type="primary">編輯價格</el-button>
    </div>
  </div>
</template>
<style>
.el-alert__content {
  gap: 12px;
  margin-left: 12px;
}
.el-alert__title {
  font-weight: 600;
  font-size: 20px !important;
}
.el-alert__description {
  font-size: 16px !important;
  font-weight: 500;
}
.operation-btn-group {
  padding: 0 30%;
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  /* justify-content: space-between; */
}
</style>
