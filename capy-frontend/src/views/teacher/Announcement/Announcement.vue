<script setup>
import { CirclePlus } from "@element-plus/icons-vue";
import { getAnnouncementList, createAnnouncement } from "@/api/teacher/announcement";
const dialogVisible = ref(false);
const addDialogVisible = ref(false);
const currentAnnouncement = ref(null);
const checkoutDetail = (item) => {
  currentAnnouncement.value = item;
  dialogVisible.value = true;
};
///
const announcementList = ref([]);
const currentPage = ref(1);
const params = computed(() => {
  return {
    page: currentPage.value - 1,
  };
});

const totalPage = ref(1);
const fetchAnnouncementList = async () => {
  console.log(params.value);
  const res = await getAnnouncementList(params.value);
  totalPage.value = res.totalElements;
  announcementList.value = res.content;
  console.log(announcementList.value);
};
onMounted(async () => {
  fetchAnnouncementList();
});
const formModel = ref({
  title: "",
  content: "",
});
const formRef = ref(null);
const formRule = {
  title: [
    { required: true, message: "標題為必填項", trigger: "blur" },
    { min: 1, max: 30, message: "標題需在1到30字內", trigger: "blur" },
  ],
  content: [
    { required: true, message: "內容為必填項", trigger: "blur" },
    { max: 50, message: "公告內容不得超過100字", trigger: "blur" },
  ],
};
const handleCreateAnnouncement = async () => {
  try {
    await formRef.value.validate();
  } catch (e) {
    ElMessage.error("請填寫必要欄位");
    return;
  }
  try {
    await createAnnouncement(formModel.value);
    ElMessage.success("發布成功");
  } catch (e) {
    console.log(e);
    ElMessage.error("發布公告失敗");
  } finally {
    currentPage.value = 1;
    await fetchAnnouncementList();
    addDialogVisible.value = false;
  }
};
watch(addDialogVisible, (val) => {
  if (!val) {
    formRef.value.resetFields();
  }
});
</script>
<template>
  <div>
    <el-dialog v-model="dialogVisible" center title="公告詳情" width="500">
      <div style="padding: 20px">
        <p>{{ currentAnnouncement?.content }}</p>
        <span>{{ currentAnnouncement?.createdAt }}</span>
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
        status-icon
        scroll-to-error
        :rules="formRule"
        style="padding: 12px"
        label-position="top"
        size="large"
        ref="formRef"
        :model="formModel"
      >
        <el-form-item prop="title" label="標題 :" style="margin-bottom: 48px">
          <el-input placeholder="請輸入公告標題" v-model="formModel.title" />
        </el-form-item>
        <el-form-item prop="content" label="內容 :">
          <el-input
            placeholder="請輸入公告內容"
            :max="100"
            v-model="formModel.content"
            type="textarea"
            :rows="5"
          />
        </el-form-item>
        <el-form-item>
          <div
            style="display: flex; justify-content: center; gap: 12px; width: 100%; margin-top: 12px"
          >
            <el-button size="large" @click="addDialogVisible = false">取消</el-button>
            <el-button size="large" @click="handleCreateAnnouncement" type="primary"
              >發布</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <h2 class="section-heading">公告管理</h2>
    <div style="text-align: end; padding-right: 24px">
      <el-button
        class="create-announce-btn"
        @click="addDialogVisible = true"
        type="primary"
        round
        size="large"
        ><el-icon size="large" style="margin-right: 8px"><CirclePlus /></el-icon>發布公告</el-button
      >
    </div>
    <div v-if="announcementList.length > 0">
      <ul class="message-list">
        <li
          v-for="item in announcementList"
          :key="item.id"
          @click="checkoutDetail(item)"
          class="message-list-item"
        >
          <div>
            <h3 class="message-title">{{ item.title }}</h3>
            <p style="margin-bottom: 12px">{{ item.content }}</p>
            <span class="checkout">{{ item.createdAt }}</span>
          </div>
          <!-- <span class="checkout">點擊查看詳情</span> -->
        </li>
      </ul>
      <div class="bottom-pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          size="large"
          :pager-count="5"
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
.message-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
}
.message-list-item {
  padding: 24px 20px;
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
.create-announce-btn {
  padding: 18px 24px;
}
.bottom-pagination {
  display: flex;
  margin-top: 48px;
  justify-content: center;
}
:deep(.el-form-item__label) {
  font-weight: 500;
}
:deep(.el-dialog__title) {
  font-size: 20px;
  font-weight: 500;
}
</style>
