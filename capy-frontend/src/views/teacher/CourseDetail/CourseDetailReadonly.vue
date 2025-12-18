<script setup>
import CourseDetailForm from "@/components/teacher/readonly/CourseDetailForm.vue";
import CourseAttachment from "@/components/teacher/readonly/CourseAttachment.vue";
import CoursePlaylist from "@/components/teacher/readonly/CoursePlaylist.vue";
import { useCourseStore } from "@/stores/course";
import { editCoursePrice } from "@/api/teacher/course";
const courseStore = useCourseStore();
const props = defineProps({
  status: {
    type: String,
  },
});
const newPriceValue = ref("");
const dialogVisible = ref(false);
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
const detailformRef = ref(null);
const handleEditPrice = async (val) => {
  const priceRegex = new RegExp(/^(?:0|[1-9]\d*)$/);
  console.log(val);
  console.log(priceRegex.test(val));
  if (!priceRegex.test(val)) {
    ElMessage.error("請輸入正確的課程價格");
    return;
  }
  try {
    await editCoursePrice(courseStore.currentCourseId, { price: val });
    ElMessage.success("更新成功");
    if (courseStore.courseInfo) {
      courseStore.courseInfo.price = val;
      console.log(111);
    }
    if (detailformRef.value) {
      detailformRef.value.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } catch (e) {
    ElMessage.error("更新課程價格失敗");
  }
};
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
    <TextInputDialog
      @confirm="handleEditPrice"
      title="編輯課程價格"
      v-model:inputValue="newPriceValue"
      v-model:visible="dialogVisible"
      placeholder="請輸入新價格"
    />
    <div ref="detailformRef">
      <CourseDetailForm />
    </div>
    <CoursePlaylist />
    <CourseAttachment />
    <div class="operation-btn-group">
      <el-button @click="$router.push({ name: 'mycourse' })" round size="large" type="info"
        ><el-icon size="large" style="margin-right: 12px"><Back /></el-icon>返回我的課程</el-button
      >
      <el-button
        @click="dialogVisible = true"
        round
        size="large"
        v-if="alertType === 'success'"
        type="primary"
        >編輯價格</el-button
      >
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
  padding: 0 20%;
  display: flex;
  /* flex-wrap: wrap; */
  /* gap: 18px; */
  /* justify-content: center; */
  margin-bottom: 24px;
  /* justify-content: space-between; */
  /* justify-content: space-evenly; */
}
.operation-btn-group .el-button {
  padding: 24px 36px;
  /* flex: 1;
  al */
}
.operation-btn-group .el-button + .el-button {
  margin-left: auto;
}
</style>
