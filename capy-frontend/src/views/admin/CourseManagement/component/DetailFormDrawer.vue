<script setup>
import CourseDetailForm from "../../CourseDetail/CourseDetailForm.vue";
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["update:isVisible"]);
const handleClose = () => {
  emit("update:isVisible", false);
};
//可讀寫的computed
const show = computed({
  get() {
    return props.isVisible;
  },
  set() {
    emit("update:isVisible", false);
  },
});
</script>
<template>
  <!-- 彈窗 -->
  <el-drawer
    :before-close="handleClose"
    :open-delay="200"
    :close-delay="200"
    size="70%"
    v-model="show"
  >
    <template #header>
      <h4 style="text-align: center">編輯課程詳情</h4>
    </template>
    <el-scrollbar>
      <template #default>
        <CourseDetailForm></CourseDetailForm>
        <div class="drawer-btn-group">
          <el-button type="info" size="large" @click="show = false">取消</el-button
          ><el-button type="primary" size="large">保存</el-button>
        </div>
      </template>
    </el-scrollbar>
  </el-drawer>
</template>
<style scoped>
.drawer-btn-group {
  margin-top: 50px;
  justify-self: center;
  display: flex;
  gap: 50px;
}
</style>
