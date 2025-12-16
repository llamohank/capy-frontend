<script setup>
const props = defineProps({
  detail: {
    type: Object,
    // required: true,
  },
  isVisible: {
    required: true,
    type: Boolean,
  },
});
const emit = defineEmits(["update:isVisible", "response"]);
const dialogVisible = computed({
  get() {
    return props.isVisible;
  },
  set(val) {
    if (val) {
      textarea.value = "";
    }
    emit("update:isVisible", val);
  },
});

const textarea = ref("");
const handleResponse = () => {
  if (textarea.value.trim() === "") {
    ElMessage.error("回覆內容不得為空");
    return;
  }
  emit("response", textarea.value);
  dialogVisible.value = false;
};
</script>
<template>
  <el-dialog v-model="dialogVisible" width="500" style="border-radius: 8px">
    <template #header>
      <h4 v-if="!detail.isAnswered" class="dialog-heading">回覆@{{ detail.userName }}</h4>
      <h4 v-else class="dialog-heading">留言詳請</h4>
    </template>
    <div style="padding: 20px">
      <p class="dialog-label">問題內容 :</p>
      <div class="question-section">
        <p class="question-content">{{ detail.content }}</p>
        <p>來自: {{ detail.courseTitle }} - {{ detail.lessonTitle }}</p>
        <span class="end-text">{{ detail.createdAt }}</span>
        <el-input
          v-if="!detail.isAnswered"
          v-model="textarea"
          style="width: 240px; width: 100%; margin-top: 36px"
          :rows="5"
          type="textarea"
          placeholder="請輸入回覆內容"
        />
      </div>
      <div v-if="detail.isAnswered">
        <p class="dialog-label">您的回覆 :</p>
        <div class="answer-section">
          <p class="answer-content">{{ detail.answer.content }}</p>
          <span class="end-text">{{ detail.answer.createdAt }}</span>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer" v-if="!detail.answer?.id">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleResponse"> 回覆 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped>
.dialog-heading {
  text-align: center;
  padding: 12px 0;
  /* font-weight: 500; */
  font-size: 20px;
  margin-right: -32px;
}
.dialog-footer {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.end-text {
  margin-top: 12px;
  /* text-align: center; */
  color: rgb(153, 173, 183);
}
.dialog-label {
  margin-bottom: 18px;
  font-size: 16px;
  font-weight: 500;
}

.answer-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.question-section {
  display: flex;
  flex-direction: column;
  margin-bottom: 36px;
  gap: 8px;
}
.answer-content {
  line-height: 1.5;
  font-size: 16px;
}
.question-content {
  line-height: 1.5;
  font-size: 16px;
}
</style>
