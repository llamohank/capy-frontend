<script setup>
const dialogVisible = ref(false);
const addDialogVisible = ref(false);
const currentAnnouncement = ref(null);
const checkoutDetail = (item) => {
  currentAnnouncement.value = item;
  dialogVisible.value = true;
};
const announcementlist = ref([
  {
    id: 1,
    title: "新年優惠 課程全面85折",
    detail: "老師缺錢了 大家來買課",
    time: "2025-11-18",
  },
  {
    id: 2,
    title: "新年優惠 課程全面75折",
    detail: "老師缺錢了 大家快來買",
    time: "2025-11-18",
  },
]);
</script>
<template>
  <div>
    <el-dialog v-model="dialogVisible" center title="公告詳情" width="500">
      <div style="padding: 20px">
        <p>{{ currentAnnouncement?.detail }}</p>
      </div>
    </el-dialog>
    <el-dialog
      v-model="addDialogVisible"
      style="padding-top: 24px"
      center
      title="發布公告"
      width="500"
    >
      <el-form
        style="padding: 12px"
        label-position="top"
        size="large"
        ref="formRef"
        :model="formModel"
      >
        <el-form-item>
          <template #label>
            <span style="display: block; font-size: 16px; font-weight: 500">標題 :</span>
          </template>
          <el-input />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span style="display: block; font-size: 16px; font-weight: 500">內容 :</span>
          </template>
          <el-input type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item>
          <div
            style="display: flex; justify-content: center; gap: 12px; width: 100%; margin-top: 12px"
          >
            <el-button size="large" @click="addDialogVisible = false">取消</el-button>
            <el-button size="large" type="primary">發布</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <h2 class="section-heading">公告管理</h2>
    <div style="text-align: end; padding-right: 24px">
      <el-tooltip effect="dark" content="發布公告" placement="left">
        <el-button @click="addDialogVisible = true" type="primary" circle size="large"
          ><el-icon size="large"><CirclePlus /></el-icon
        ></el-button>
      </el-tooltip>
    </div>
    <ul class="message-list">
      <li v-for="item in announcementlist" @click="checkoutDetail(item)" class="message-list-item">
        <div>
          <h3 class="message-title">{{ item.title }}</h3>
          <span style="font-style: italic; font-size: 14px">{{ item.time }}</span>
        </div>
        <span class="checkout">點擊查看詳情</span>
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
  margin-top: 20px;
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
  cursor: pointer;
}
.checkout {
  font-size: 14px;
  color: rgb(153, 173, 183);
}
.message-title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 24px;
}
.end-text {
  margin-top: 12px;
  text-align: center;
  color: rgb(153, 173, 183);
}
</style>
