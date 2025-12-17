<template>
  <div class="notification-content-container">
    <!-- 標題列 -->
    <div class="notification-header">
      <h4 class="header-title">通知</h4>
      <el-button
        type="primary"
        link
        :disabled="notificationStore.unreadCount === 0"
        @click="handleMarkAllAsRead"
      >
        全部標為已讀
      </el-button>
    </div>

    <!-- 通知列表 -->
    <el-scrollbar max-height="400px" class="notification-scrollbar">
      <!-- 空狀態 -->
      <div v-if="notificationStore.notifications.length === 0" class="empty-state">
        <div class="empty-icon">
          <el-icon :size="48" color="#C0C4CC">
            <Bell />
          </el-icon>
        </div>
        <p class="empty-text">暫無新通知</p>
      </div>

      <!-- 通知項目列表 -->
      <div v-else class="notification-list">
        <div
          v-for="item in notificationStore.recentNotifications"
          :key="item.id"
          class="notification-item"
          :class="{ 'is-unread': !item.isRead }"
          @click="handleNotificationClick(item)"
        >
          <!-- 左側圖標 -->
          <div class="item-icon" :style="getIconStyle(item.notificationType)">
            <el-icon :size="18">
              <component :is="getIconComponent(item.notificationType)" />
            </el-icon>
          </div>

          <!-- 中間內容 -->
          <div class="item-content">
            <h5 class="item-title">{{ item.title }}</h5>
            <p v-if="item.content" class="item-description">{{ item.content }}</p>
            <span class="item-time">{{ formatRelativeTime(item.createdAt) }}</span>
          </div>

          <!-- 右側未讀指示器 -->
          <div v-if="!item.isRead" class="item-indicator">
            <span class="unread-dot"></span>
          </div>
        </div>
      </div>
    </el-scrollbar>

    <!-- 底部按鈕 -->
    <div class="notification-footer">
      <el-button
        class="view-all-button"
        @click="handleViewAll"
      >
        查看所有通知
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Bell,
  Warning,
  CircleCloseFilled,
  ChatDotRound,
  UserFilled,
  Postcard,
  BellFilled,
  Star
} from '@element-plus/icons-vue'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const notificationStore = useNotificationStore()
const emit = defineEmits(['close'])

const getIconComponent = (type) => {
  const iconMap = {
    'account_suspended': Warning,
    'payout_failed': CircleCloseFilled,
    'transcoding_failed': Warning,
    'course_force_unpublished': CircleCloseFilled,
    'question_answered': ChatDotRound,
    'new_question': ChatDotRound,
    'new_enrollment': UserFilled,
    'new_review': Star,
    'instructor_announcement': Postcard,
    'platform_announcement': BellFilled
  }
  return iconMap[type] || Bell
}

const getIconStyle = (type) => {
  const criticalTypes = ['account_suspended', 'payout_failed', 'transcoding_failed', 'course_force_unpublished']
  const interactionTypes = ['question_answered', 'new_question', 'new_enrollment', 'new_review']
  const announcementTypes = ['instructor_announcement', 'platform_announcement']

  if (criticalTypes.includes(type)) {
    return { color: 'var(--capy-danger)', backgroundColor: 'var(--el-color-danger-light-9)' }
  } else if (interactionTypes.includes(type)) {
    return { color: 'var(--capy-primary)', backgroundColor: 'var(--el-color-primary-light-9)' }
  } else if (announcementTypes.includes(type)) {
    return { color: 'var(--capy-warning)', backgroundColor: 'var(--el-color-warning-light-9)' }
  }
  return { color: 'var(--capy-info)', backgroundColor: 'var(--el-color-info-light-9)' }
}

const formatRelativeTime = (dateString) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return '剛剛'
  else if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} 分鐘前`
  else if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} 小時前`
  else if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} 天前`
  else if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} 週前`
  else return `${Math.floor(diffInSeconds / 2592000)} 個月前`
}

const handleMarkAllAsRead = () => {
  notificationStore.markAllAsRead()
  ElMessage.success('所有通知已標記為已讀')
}

const handleNotificationClick = async (item) => {
  try {
    await notificationStore.markAsRead(item.id)
    emit('close')
    if (item.relatedEntityType === 'course' && item.relatedEntityId) {
      await router.push({ name: 'CourseDetail', params: { id: item.relatedEntityId } })
        .catch(() => router.push({ name: 'Notifications' }))
    } else {
      await router.push({ name: 'Notifications' })
    }
  } catch (error) {
    ElMessage.error('處理通知時發生錯誤')
  }
}

const handleViewAll = async () => {
  emit('close')
  await router.push({ name: 'Notifications' })
}
</script>

<style scoped>
.notification-content-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--capy-spacing-sm);
  border-bottom: 1px solid var(--capy-border-lighter);
  margin-bottom: var(--capy-spacing-sm);
}

.header-title {
  margin: 0;
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--capy-spacing-xl) var(--capy-spacing-md);
  text-align: center;
}

.empty-icon {
  margin-bottom: var(--capy-spacing-md);
}

.empty-text {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  margin: 0;
}

.notification-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: var(--capy-spacing-sm);
  padding: var(--capy-spacing-sm);
  border-radius: var(--capy-radius-sm);
  cursor: pointer;
  transition: background-color var(--capy-transition-fast);
}

.notification-item:hover {
  background-color: var(--capy-bg-elevated);
}

.notification-item.is-unread {
  background-color: var(--el-color-primary-light-9);
}

.notification-item.is-unread:hover {
  background-color: var(--el-color-primary-light-8);
}

.item-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--capy-radius-circle);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--capy-transition-fast);
}

.item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-title {
  font-size: var(--capy-font-size-sm);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-description {
  font-size: var(--capy-font-size-xs);
  color: var(--capy-text-secondary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-time {
  font-size: var(--capy-font-size-xs);
  color: var(--capy-text-placeholder);
}

.item-indicator {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding-top: 4px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--capy-radius-circle);
  background-color: var(--capy-primary);
}

.notification-footer {
  padding-top: var(--capy-spacing-sm);
  border-top: 1px solid var(--capy-border-lighter);
  margin-top: var(--capy-spacing-sm);
}

.view-all-button {
  width: 100%;
  font-size: var(--capy-font-size-sm);
  font-weight: var(--capy-font-weight-medium);
}

.notification-scrollbar :deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}
</style>
