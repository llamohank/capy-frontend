<script setup>
const notificationType = ref("review");
const dialogVisible = ref(false);
const showNormalDialog = computed({
  get: () => notificationType.value !== "review" && dialogVisible.value === true,
  set: () => {
    dialogVisible.value === false;
  },
});
const showReviewDialog = computed({
  get: () => notificationType.value === "review" && dialogVisible.value === true,
  set: () => {
    dialogVisible.value === false;
  },
});
const getNotificationDetail = () => {
  dialogVisible.value = true;
};
const changeNotificationType = (e) => {
  dialogVisible.value = false;
  notificationType.value = e;
};
</script>
<template>
  <div>
    <el-dialog
      :before-close="
        () => {
          dialogVisible = false;
        }
      "
      v-model="showNormalDialog"
      title="通知詳情"
      width="500"
    >
      <p>您的課程Java零基礎入門已上架成功!!</p>
      <span>1個月前</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false"> 確認 </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      :before-close="
        () => {
          dialogVisible = false;
        }
      "
      v-model="showReviewDialog"
      title="評論詳情"
      width="500"
    >
      <div style="display: flex; gap: 20px; padding: 12px">
        <div>
          <el-avatar
            :size="50"
            src="https://picsum.photos/200
"
          />
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px">
          <p>somebody</p>
          <div><el-rate v-model="value" disabled /> <span>1個月前</span></div>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure, magni.</p>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false"> 確認 </el-button>
        </div>
      </template>
    </el-dialog>
    <h2 class="section-heading">通知中心</h2>
    <div style="display: flex; justify-content: space-between; align-items: end">
      <div>
        <el-radio-group
          size="large"
          :model-value="notificationType"
          @update:model-value="changeNotificationType"
          fill="#6cf"
        >
          <el-radio-button label="課程評論" value="review" />
          <el-radio-button label="平台通知" value="notification" />
          <el-radio-button label="課程留言" value="comment" />
          <el-radio-button label="入帳通知" value="accounting" />
        </el-radio-group>
      </div>
      <el-button
        ><el-icon style="margin-right: 4px"><SuccessFilled /></el-icon>已讀全部</el-button
      >
    </div>
    <ul class="message-list">
      <li class="message-list-item">
        <div>
          <h3 class="message-title">課程上架通知</h3>
          <p style="margin-bottom: 12px">您的課程Java零基礎入門已上架成功!!</p>
          <span style="font-size: 14px">1個月前</span>
        </div>
        <span @click="getNotificationDetail">查看詳情</span>
      </li>
      <li class="message-list-item">
        <div>
          <h3 class="message-title">課程上架通知</h3>
          <p style="margin-bottom: 12px">您的課程Java零基礎入門已上架成功!!</p>
          <span style="font-size: 14px">1個月前</span>
        </div>
        <span>查看詳情</span>
      </li>
    </ul>
    <p class="end-text">已經到底了</p>
  </div>
</template>
<style scoped>
.message-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 48px;
}
.message-list-item {
  padding: 10px 20px;
  display: flex;
  gap: 20px;
  border-radius: 8px;
  justify-content: space-between;
  align-items: center;
  background-color: #fcfcfd;
  border-left: 5px solid rgb(216, 230, 237);
  /* transition:; */
}
.message-list-item:hover {
  transform: translateY(-2px);
}
.message-title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 12px;
}
.end-text {
  margin-top: 12px;
  text-align: center;
  color: rgb(153, 173, 183);
}
</style>
