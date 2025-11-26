<script setup>
const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
  isVisible: {
    required: true,
    type: Boolean,
  },
});
const emit = defineEmits(["update:isVisible"]);
const dialogVisible = computed({
  get() {
    return props.isVisible;
  },
  set() {
    emit("update:isVisible", false);
  },
});
const textarea = ref(null);
</script>
<template>
  <el-dialog v-model="dialogVisible" width="500" style="border-radius: 8px">
    <div style="padding: 20px">
      <el-input
        v-model="textarea"
        style="width: 240px; width: 100%"
        :rows="5"
        type="textarea"
        placeholder="請輸入回覆內容"
      />
    </div>
    <template #footer>
      <div class="dialog-footer" v-if="props.detail?.answerId">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false"> 回覆 </el-button>
      </div>
      <div v-else class="dialog-footer">
        <el-button type="info" @click="dialogVisible = false">確定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped>
.dialog-footer {
  display: flex;
  gap: 20px;
  justify-content: center;
}
</style>
