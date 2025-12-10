<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { listAnnouncements, createAnnouncement } from "@/api/admin/announcement";
import dayjs from "dayjs";

// Dialog 狀態
const dialogVisible = ref(false);
const addDialogVisible = ref(false);
const currentAnnouncement = ref(null);

// 篩選狀態
const currentAnnouncementType = ref("");

// 資料狀態
const loading = ref(false);
const submitLoading = ref(false);
const announcementList = ref([]);
const totalElements = ref(0);

// 分頁
const currentPage = ref(1);
const pageSize = ref(10);

// 表單
const formModel = ref({
  title: "",
  content: "",
  targetAudience: "",
});

// 檢視公告詳情
const checkoutDetail = (item) => {
  currentAnnouncement.value = item;
  dialogVisible.value = true;
};

// 取得公告列表
const fetchAnnouncements = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value - 1,
      size: pageSize.value,
    };

    // 篩選公告類型
    if (currentAnnouncementType.value) {
      params.announcementType = currentAnnouncementType.value;
    }

    const result = await listAnnouncements(params);
    if (result) {
      announcementList.value = result.content || [];
      totalElements.value = result.totalElements || 0;
    }
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    ElMessage.error("取得公告列表失敗");
  } finally {
    loading.value = false;
  }
};

// 發布公告
const handleCreateAnnouncement = async () => {
  // 驗證表單
  if (!formModel.value.title.trim()) {
    ElMessage.warning("請輸入標題");
    return;
  }
  if (!formModel.value.content.trim()) {
    ElMessage.warning("請輸入內容");
    return;
  }
  if (!formModel.value.targetAudience) {
    ElMessage.warning("請選擇公告對象");
    return;
  }

  try {
    submitLoading.value = true;
    await createAnnouncement({
      title: formModel.value.title,
      content: formModel.value.content,
      targetAudience: formModel.value.targetAudience,
    });
    ElMessage.success("公告發布成功");
    addDialogVisible.value = false;
    // 刷新列表
    currentPage.value = 1;
    fetchAnnouncements();
  } catch (error) {
    console.error("Failed to create announcement:", error);
    ElMessage.error(error?.response?.data?.message || "發布公告失敗");
  } finally {
    submitLoading.value = false;
  }
};

// 處理公告類型篩選變更
const handleTypeChange = () => {
  currentPage.value = 1;
  fetchAnnouncements();
};

// 處理分頁變更
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchAnnouncements();
};

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return dayjs(dateStr).format("YYYY-MM-DD HH:mm");
};

// 格式化公告對象顯示
const formatTargetAudience = (audience) => {
  const map = {
    all: "全站用戶",
    instructors: "僅講師",
    students_of_instructor: "講師的學生",
  };
  return map[audience] || audience;
};

// 格式化公告類型顯示
const formatAnnouncementType = (type) => {
  return type === "platform" ? "管理員" : "講師";
};

// 重置表單
watch(addDialogVisible, (val) => {
  if (!val) {
    formModel.value = {
      title: "",
      content: "",
      targetAudience: "",
    };
  }
});

onMounted(() => {
  fetchAnnouncements();
});
</script>
<template>
  <div>
    <!-- //公告詳情 -->
    <el-dialog v-model="dialogVisible" center title="公告詳情" width="500">
      <template #header>
        <h4 class="dialog-heading">公告詳情</h4>
      </template>
      <div class="dialog-body">
        <p>
          {{ currentAnnouncement?.content }}
        </p>
        <p><span class="detail-label">發布人:</span>{{ currentAnnouncement?.senderNickname }}</p>
        <p>
          <span class="detail-label">發布時間:</span>
          <span style="font-style: italic; font-size: 16px">{{ formatDate(currentAnnouncement?.createdAt) }}</span>
        </p>
        <p><span class="detail-label">可見對象:</span>{{ formatTargetAudience(currentAnnouncement?.targetAudience) }}</p>
      </div>
    </el-dialog>
    <!-- //發布公告 -->
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
          <el-input v-model="formModel.title" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span style="display: block; font-size: 16px; font-weight: 500">內容 :</span>
          </template>
          <el-input v-model="formModel.content" type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span style="display: block; font-size: 16px; font-weight: 500">公告對象 :</span>
          </template>
          <el-select
            v-model="formModel.targetAudience"
            placeholder="選擇可見對象"
            style="width: 240px"
          >
            <el-option label="全站用戶" value="all" />
            <el-option label="僅講師" value="instructors" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div
            style="display: flex; justify-content: center; gap: 12px; width: 100%; margin-top: 12px"
          >
            <el-button size="large" @click="addDialogVisible = false">取消</el-button>
            <el-button size="large" type="primary" :loading="submitLoading" @click="handleCreateAnnouncement">發布</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <h2 class="section-heading">全站公告管理</h2>
    <div
      style="
        display: flex;
        padding: 0 8px;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 48px;
      "
    >
      <div style="display: flex; align-items: center; gap: 12px">
        <span style="font-weight: 500; font-size: 18px">發布人 :</span>
        <el-radio-group v-model="currentAnnouncementType" size="large" fill="#6cf" @change="handleTypeChange">
          <el-radio-button label="All" value="" />
          <el-radio-button label="平台" value="platform" />
          <el-radio-button label="講師" value="instructor" />
        </el-radio-group>
      </div>
      <el-button @click="addDialogVisible = true" type="primary" round size="large"
        ><el-icon size="large" style="margin-right: 4px"><CirclePlus /></el-icon>發布公告</el-button
      >
    </div>
    <ul v-loading="loading" class="message-list">
      <li v-for="item in announcementList" :key="item.id" @click="checkoutDetail(item)" class="message-list-item">
        <div>
          <div style="display: flex; align-items: center; margin-bottom: 24px; gap: 4px">
            <h3 class="message-title">{{ item.title }}</h3>
            <el-tag
              class="tag"
              type="info"
              effect="plain"
              round
              size="large"
              >{{ formatTargetAudience(item.targetAudience) }}</el-tag
            >
          </div>
          <p style="margin-bottom: 12px; font-weight: 500">
            {{ formatAnnouncementType(item.announcementType) }} {{ item.senderNickname }}
          </p>
          <span style="font-style: italic; font-size: 14px">{{ formatDate(item.createdAt) }}</span>
        </div>
        <span class="checkout">點擊查看詳情</span>
      </li>
      <li v-if="!loading && announcementList.length === 0" class="empty-text">
        暫無公告
      </li>
    </ul>
    <div style="justify-content: center" class="pagination-btn">
      <el-pagination 
        size="large" 
        background 
        layout="total, prev, pager, next" 
        :total="totalElements"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
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
  padding: 10px 20px;
  position: relative;
  display: flex;
  gap: 20px;
  border-radius: 8px;
  justify-content: space-between;
  align-items: center;
  background-color: #fcfcfd;
  border-left: 5px solid rgb(216, 230, 237);
  /* transition:; */
}
.dialog-body {
  padding: 24px;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* text-align: center; */
}
.detail-label {
  font-weight: 500;
  font-size: 16px;
  margin-right: 8px;
}
.dialog-heading {
  text-align: center;
  padding: 12px 0;
  font-weight: 500;
  font-size: 24px;
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
}
.end-text {
  margin-top: 12px;
  text-align: center;
  color: rgb(153, 173, 183);
}
.add-btn {
  padding: 18px 24px;
}
.empty-text {
  text-align: center;
  color: rgb(153, 173, 183);
  padding: 48px 0;
  font-size: 16px;
}
.pagination-btn {
  margin-top: 48px;
  display: flex;
}
</style>
