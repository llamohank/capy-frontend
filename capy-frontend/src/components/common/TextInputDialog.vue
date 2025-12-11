<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    required: true,
    type: String,
  },
  placeholder: {
    type: String,
    default: "請輸入內容",
  },
  inputValue: {
    type: String,
    default: "",
  },
});
const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit("update:visible", val);
  },
});
const inputValue = computed({
  get() {
    return props.inputValue;
  },
  set(val) {
    emit("update:inputValue", val);
  },
});
const emit = defineEmits(["confirm", "update:inputValue", "update:visible"]);
const open = () => {
  emit("update:visible", true);
};
const close = () => {
  emit("update:visible", false);
};
const confirm = () => {
  emit("confirm", inputValue.value);
  emit("update:visible", false);
  inputValue.value = "";
};
defineExpose({ open, close });
</script>
<template>
  <el-dialog v-model="dialogVisible" width="500">
    <template #header>
      <h4 class="dialog-heading">{{ props.title }}</h4>
    </template>
    <div class="dialog-body">
      <div style="text-align: center">
        <el-input
          size="large"
          v-model="inputValue"
          :placeholder="props.placeholder"
          style="width: 90%"
        />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="large" type="info" @click="dialogVisible = false">取消</el-button>
        <el-button size="large" type="primary" @click="confirm"> 確認 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped>
.dialog-footer {
  display: flex;
  gap: 24px;
  justify-content: center;
  padding-bottom: 12px;
}
.dialog-body {
  padding: 24px 12px;
  text-align: center;
  margin-bottom: 16px;
}
.username {
  font-weight: 500;
  color: #409eff;
}
.dialog-heading {
  text-align: center;
  padding: 12px 0;
  font-weight: 500;
  font-size: 24px;
  margin-right: -32px;
}
</style>
