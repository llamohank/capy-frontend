<script setup>
const props = defineProps({
  visible: {
    default: false,
    type: Boolean,
  },
  highlight: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  alertText: {
    type: String,
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
const open = () => {
  emit("update:visible", true);
};
const close = () => {
  emit("update:visible", false);
};
const confirm = () => {
  emit("confirm");
  close();
};
const emit = defineEmits(["update:visible", "confirm"]);
defineExpose({ open, close });
</script>
<template>
  <el-dialog v-model="dialogVisible" width="500">
    <template #header>
      <h4 class="dialog-heading">{{ props.title }}</h4>
    </template>
    <div class="dialog-body">
      <p>
        {{ props.alertText
        }}<span style="font-weight: 500; color: #409eff">{{ props.highlight }}</span
        >?
      </p>
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
  padding: 24px;
  font-size: 18px;
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
