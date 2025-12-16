<script setup>
import { useInstructorNotificationStore } from "@/stores/instructorNotification";
import { deleteNotification, markAllAsRead, markAsRead } from "@/api/teacher/notification";
const instructorNotificationStore = useInstructorNotificationStore();
onMounted(async () => {
  const res = await instructorNotificationStore.fetchNotificationList(params.value);
  totalPage.value = res.totalElements;
  // console.log(instructorNotificationStore.resultNotificationList);
});
const notificationType = ref("review");
// const currnetNotificationList = ref([]);
const params = computed(() => ({
  types: notificationType.value,
  page: currentPage.value - 1,
}));
const handleDeleteNotification = async (item) => {
  if (!item.isRead) {
    try {
      await ElMessageBox.confirm("此消息尚未已讀，確定要刪除嗎?", "提示", {
        confirmButtonText: "確認",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      });
    } catch (error) {
      return;
    }
  }
  try {
    await deleteNotification(item.id);
    instructorNotificationStore.resultNotificationList =
      instructorNotificationStore.resultNotificationList.filter(
        (notification) => notification.id !== item.id
      );
    instructorNotificationStore.removeFromDB(item.id);
    ElMessage.success("刪除成功");
  } catch (e) {
    ElMessage.error("刪除失敗");
  }
};
watch(notificationType, async () => {
  currentPage.value = 1;
  await instructorNotificationStore.fetchNotificationList(params.value);
});
const handleMarkAllAsRead = async () => {
  try {
    await markAllAsRead();
    instructorNotificationStore.resultNotificationList.forEach((item) => (item.isRead = true));
    instructorNotificationStore.temporary_list = [];
    instructorNotificationStore.DB_unreadList = [];
  } catch (e) {
    console.log(e);
  }
};
// const handleChangeNotificationType = (e) => {
//   // dialogVisible.value = false;
//   notificationType.value = e;
// };
///////////////////////
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
const currentRow = ref(null);
const handleCheckNotification = (item) => {
  currentRow.value = item;
  dialogVisible.value = true;
};
const handleReadNotification = async () => {
  await markAsRead(currentRow.value.id);
  dialogVisible.value = false;
};
const totalPage = ref(1);
const currentPage = ref(1);
watch(currentPage, async () => {
  await instructorNotificationStore.fetchNotificationList(params.value);
});
</script>
<template>
  <div>
    <el-dialog
      :before-close="handleReadNotification"
      v-model="showNormalDialog"
      title="通知詳情"
      width="500"
    >
      <p>{{ currentRow.content }}</p>
      <span>{{ currentRow.createAt }}</span>
      <!-- <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false"> 確認 </el-button>
        </div>
      </template> -->
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
        <el-radio-group size="large" v-model="notificationType" fill="#6cf">
          <el-radio-button value="review">
            <el-badge
              v-if="instructorNotificationStore.review_unread_count"
              :value="instructorNotificationStore.review_unread_count"
              :max="99"
              :offset="[8, -3]"
            >
              <span>課程評論</span>
            </el-badge>
            <span v-else>課程評論</span>
          </el-radio-button>
          <el-radio-button value="platform">
            <el-badge
              v-if="instructorNotificationStore.platform_unread_count"
              :value="instructorNotificationStore.platform_unread_count"
              :max="99"
              :offset="[8, -3]"
            >
              <span>平台通知</span>
            </el-badge>
            <span v-else>平台通知</span>
          </el-radio-button>
          <el-radio-button label="課程留言" value="comment">
            <el-badge
              v-if="instructorNotificationStore.comment_unread_count"
              :value="instructorNotificationStore.comment_unread_count"
              :max="99"
              :offset="[8, -3]"
            >
              <span>課程留言</span>
            </el-badge>
            <span v-else>課程留言</span>
          </el-radio-button>
          <el-radio-button label="入帳通知" value="payout">
            <el-badge
              v-if="instructorNotificationStore.payout_unread_count"
              :value="instructorNotificationStore.payout_unread_count"
              :max="99"
              :offset="[8, -3]"
            >
              <span>入帳通知</span>
            </el-badge>
            <span v-else>入帳通知</span>
          </el-radio-button>
          <el-radio-button label="其他" value="other">
            <el-badge
              v-if="instructorNotificationStore.other_unread_count"
              :value="instructorNotificationStore.other_unread_count"
              :max="99"
              :offset="[8, -3]"
            >
              <span>其他</span>
            </el-badge>
            <span v-else>其他</span>
          </el-radio-button>
        </el-radio-group>
      </div>
      <el-button @click="handleMarkAllAsRead"
        ><el-icon style="margin-right: 4px"><SuccessFilled /></el-icon>已讀全部</el-button
      >
    </div>
    <div v-if="instructorNotificationStore.currentNotificationList.length > 0">
      <ul class="message-list">
        <li
          v-for="item in instructorNotificationStore.currentNotificationList"
          :key="item.id"
          :class="{ unread: !item.isRead }"
          class="message-list-item"
        >
          <div>
            <h3 class="message-title">{{ item.title }}</h3>
            <p style="margin-bottom: 12px">{{ item.content }}</p>
            <span style="font-size: 14px">{{ item.createAt }}</span>
          </div>
          <div>
            <el-button link type="primary" @click="handleCheckNotification(item)">查看</el-button>
            <el-button link @click="handleDeleteNotification(item)">刪除</el-button>
          </div>
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
  margin-top: 48px;
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
.unread {
  border-left-color: #409eff;
}
.message-list-item:hover {
  transform: translateY(-2px);
}
.message-title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 12px;
}

:deep(.el-radio-button__inner) {
  padding-right: 24px;
}

.bottom-pagination {
  display: flex;
  margin-top: 48px;
  justify-content: center;
}
</style>
