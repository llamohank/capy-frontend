<script setup>
import CommentDetailDialog from "./CommentDetailDialog.vue";
import { getCourseOptions, getQuestionList, answerQuestion } from "@/api/teacher/comment";
// import { useCourseStore } from "@/stores/course";
// const courseStore = useCourseStore();
const queryForm = ref({});
const isVisible = ref(false);
// const currentComment = ref({
//   questionid: 1,
//   answerId: 2,
// });
const open = () => {
  isVisible.value = true;
};
///
const courseOptions = ref([]);
const currentCourseOption = ref(null);
const fetchQuestionList = async () => {
  const res = await getQuestionList(params.value);
  questionList.value = res.content;
  totalPage.value = res.totalElements;
};
onMounted(async () => {
  courseOptions.value = await getCourseOptions();
  await fetchQuestionList();
  // console.log(res);
  // console.log(questionList.value);
});
const currentPage = ref(1);
const totalPage = ref(1);
const answerType = ref(null);
const selectOptions = computed(() => {
  return {
    courseId: currentCourseOption.value,
    answered: answerType.value,
  };
});
const params = computed(() => {
  return {
    ...selectOptions.value,
    page: currentPage.value - 1,
  };
});
watch(selectOptions, async () => {
  currentPage.value = 1;
  await fetchQuestionList();
});
const questionList = ref([]);
const currentComment = ref(null);
const handleCheckQuestion = (item) => {
  currentComment.value = item;
  isVisible.value = true;
};
const handleAnswerQuestion = async (val) => {
  const responsedanswer = currentComment.value.id;
  try {
    const res = await answerQuestion(currentComment.id, { content: val });
    const target = questionList.value.find((item) => item.id === responsedanswer);
    if (target) {
      target.answer = res;
    }
    ElMessage.success("回覆成功");
  } catch (e) {
    console.log(e);
    ElMessage.error("回覆失敗");
  }
};
</script>
<template>
  <div>
    <CommentDetailDialog
      @response="handleAnswerQuestion"
      v-model:isVisible="isVisible"
      :detail="currentComment"
    />
    <h2 class="section-heading">課程留言</h2>
    <div>
      <el-select
        size="large"
        v-model="currentCourseOption"
        clearable
        placeholder="全部課程"
        style="width: 240px; margin-right: 24px"
      >
        <el-option
          v-for="item in courseOptions"
          :key="item.courseId"
          :label="item.title"
          :value="item.courseId"
        />
      </el-select>
      <el-select
        size="large"
        clearable
        v-model="answerType"
        placeholder="顯示全部"
        style="width: 240px"
      >
        <el-option label="已回覆" :value="true" />
        <el-option label="未回覆" :value="false" />
      </el-select>
    </div>
    <div v-if="questionList.length > 0">
      <ul class="comment-list">
        <li
          v-for="item in questionList"
          :key="item.id"
          class="comment-list-item"
          :class="{ 'no-answer': !item.isAnswered }"
          @click="handleCheckQuestion(item)"
        >
          <el-tag
            class="tag"
            color="#fff"
            :type="item.isAnswered ? 'info' : 'primary'"
            round
            size="large"
            >{{ item.isAnswered ? "已回覆" : "未回覆" }}</el-tag
          >
          <div><el-avatar :size="60" :src="item.avatarUrl" /></div>
          <div class="comment-text">
            <p style="font-weight: 500; font-size: 18px">{{ item.userName }}</p>
            <p>{{ item.content }}</p>
            <div style="font-size: 14px; font-weight: 400">
              <p style="margin-bottom: 12px">
                來自: {{ item.courseTitle }} - {{ item.lessonTitle }}
              </p>
              <span class="end-text">{{ item.createdAt }}</span>
            </div>
          </div>
        </li>
      </ul>
      <div class="bottom-pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          size="large"
          :pager-count="5"
          @current-page="fetchQuestionList"
          v-model:current-page="currentPage"
          :page-size="20"
          :total="totalPage"
        />
      </div>
    </div>
    <div v-else>
      <el-empty description="還沒有通知喔..." />
    </div>
  </div>
</template>
<style scoped>
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 48px;
}
.comment-list-item {
  padding: 24px 20px;
  display: flex;
  gap: 20px;
  border-radius: 8px;
  position: relative;
  background-color: #fcfcfd;
  border-left: 5px solid rgb(216, 230, 237);
  /* transition:; */
}
.tag {
  padding: 18px 24px;
  font-size: 14px;
}
.end-text {
  margin-top: 12px;
  text-align: center;
  color: rgb(153, 173, 183);
}
.no-answer {
  border-left-color: #409eff;
}
.no-answer .tag {
  font-weight: 600;
}
.el-tag {
  position: absolute;
  top: 8%;
  right: 2%;
  border-width: 2px;
}
.comment-text {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.comment-list-item:hover {
  cursor: pointer;
}
.bottom-pagination {
  display: flex;
  margin-top: 48px;
  justify-content: center;
}
.el-select-dropdown__item {
  padding: 8px 4px;
  height: auto;
  text-align: center;
}
</style>
