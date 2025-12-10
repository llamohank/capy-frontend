<template>
  <div class="notifications-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">我的通知</h1>
      <div class="header-actions">
        <el-button
          v-if="notificationStore.unreadCount > 0"
          type="primary"
          size="small"
          @click="handleMarkAllAsRead"
        >
          全部標記為已讀
        </el-button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <NotificationFilters v-model="activeFilter" @change="handleFilterChange" />

    <!-- Search Bar -->
    <NotificationSearchBar v-model="searchQuery" @search="handleSearch" />

    <!-- Loading State -->
    <div v-if="notificationStore.loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- Notifications List -->
    <div v-else class="notifications-list">
      <NotificationCard
        v-for="notification in displayedNotifications"
        :key="notification.id"
        :notification="notification"
        @click="handleNotificationClick"
        @delete="handleDeleteNotification"
      />

      <!-- Empty State -->
      <div v-if="displayedNotifications.length === 0" class="empty-state">
        <el-icon :size="64" color="#C0C4CC">
          <BellFilled />
        </el-icon>
        <p class="empty-text">{{ emptyStateText }}</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="notificationStore.pagination.totalElements > 0" class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="notificationStore.pagination.size"
        :total="notificationStore.pagination.totalElements"
        :pager-count="5"
        layout="total, prev, pager, next"
        background
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { BellFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useNotificationStore } from '@/stores/notification'
import NotificationCard from '@/components/student/StudentCenter/MyNotification/NotificationCard.vue'
import NotificationFilters from '@/components/student/StudentCenter/MyNotification/NotificationFilters.vue'
import NotificationSearchBar from '@/components/student/StudentCenter/MyNotification/NotificationSearchBar.vue'

// Store
const notificationStore = useNotificationStore()

// State
const activeFilter = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const announcementType = ref(undefined) // platform / instructor / other / undefined=全部

// 從 activeFilter 映射到 announcementType
const filterToAnnouncementType = {
  'all': undefined,
  'platform': 'platform',
  'instructor': 'instructor',
  'other': 'other'
}

// 顯示的通知列表（客戶端搜尋過濾）
const displayedNotifications = computed(() => {
  let filtered = notificationStore.notifications

  // 客戶端搜尋過濾
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(n =>
      n.title?.toLowerCase().includes(query) ||
      n.content?.toLowerCase().includes(query)
    )
  }

  return filtered
})

// 空狀態文字
const emptyStateText = computed(() => {
  if (searchQuery.value) {
    return '找不到符合搜尋條件的通知'
  }
  if (activeFilter.value === 'platform') {
    return '目前沒有平台公告'
  }
  if (activeFilter.value === 'instructor') {
    return '目前沒有講師公告'
  }
  return '目前沒有通知'
})

// 載入通知列表
const loadNotifications = async (page = 0) => {
  try {
    await notificationStore.fetchStudentNotifications({
      announcementType: announcementType.value,
      page,
      size: 5,
      sort: 'createdAt,DESC'
    })
  } catch (error) {
    console.error('載入通知失敗:', error)
  }
}

// 處理篩選變更
const handleFilterChange = (filter) => {
  activeFilter.value = filter
  announcementType.value = filterToAnnouncementType[filter]
  currentPage.value = 1
  loadNotifications(0)
}

// 處理搜尋
const handleSearch = () => {
  // 搜尋是客戶端過濾，不需要重新載入
}

// 處理分頁變更
const handlePageChange = (page) => {
  currentPage.value = page
  loadNotifications(page - 1) // API 的 page 從 0 開始
}

// 處理通知點擊
const handleNotificationClick = async (notification) => {
  // 標記為已讀
  if (!notification.is_read) {
    await notificationStore.markAsRead(notification.id)
  }

  // TODO: 根據通知類型導航到相關頁面
  if (notification.relatedEntityType && notification.relatedEntityId) {
    console.log(`導航到 ${notification.relatedEntityType}:${notification.relatedEntityId}`)
  }
}

// 處理刪除通知
const handleDeleteNotification = async (notificationId) => {
  try {
    await ElMessageBox.confirm(
      '確定要刪除這則通知嗎？',
      '確認刪除',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await notificationStore.deleteNotification(notificationId)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('刪除通知失敗:', error)
    }
  }
}

// 處理全部標記為已讀
const handleMarkAllAsRead = async () => {
  try {
    await notificationStore.markAllAsRead()
    await loadNotifications(currentPage.value - 1)
  } catch (error) {
    console.error('標記全部已讀失敗:', error)
  }
}

// 初始化
onMounted(async () => {
  await loadNotifications(0)
  await notificationStore.fetchUnreadCount()
})

</script>

<style scoped>
.notifications-page {
  padding: 0;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* Loading State */
.loading-container {
  padding: 20px 0;
}

/* Notifications List */
.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
  min-height: 400px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-text {
  font-size: 16px;
  color: #999;
  margin-top: 16px;
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding: 20px 0;
}

.pagination-container :deep(.el-pagination) {
  gap: 8px;
}

.pagination-container :deep(.el-pagination button),
.pagination-container :deep(.el-pager li) {
  min-width: 36px;
  height: 36px;
  line-height: 36px;
  border-radius: 6px;
  font-weight: 500;
}

.pagination-container :deep(.el-pager li.is-active) {
  background: #1a1a1a;
  color: white;
}

.pagination-container :deep(.el-pager li:hover) {
  color: #4CAF50;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .page-title {
    font-size: 22px;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 20px;
  }

  .notifications-list {
    min-height: 300px;
  }
}
</style>
