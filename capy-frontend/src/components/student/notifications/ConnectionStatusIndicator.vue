<template>
  <el-tooltip
    :content="tooltipContent"
    placement="bottom"
    :show-after="300"
  >
    <div class="connection-status-indicator" :class="statusClass">
      <div class="status-dot" :class="dotClass"></div>
      <span v-if="showLabel" class="status-label">{{ statusLabel }}</span>
    </div>
  </el-tooltip>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notification'

// Props
const props = defineProps({
  showLabel: {
    type: Boolean,
    default: false
  }
})

// Store
const notificationStore = useNotificationStore()

// 連線狀態
const connectionState = computed(() => notificationStore.connectionState)

// 狀態樣式類別
const statusClass = computed(() => {
  return `status-${connectionState.value}`
})

const dotClass = computed(() => {
  return `dot-${connectionState.value}`
})

// 狀態標籤
const statusLabel = computed(() => {
  const labels = {
    disconnected: '未連線',
    connecting: '連線中',
    connected: '已連線',
    error: '連線錯誤'
  }
  return labels[connectionState.value] || '未知'
})

// Tooltip 內容
const tooltipContent = computed(() => {
  const messages = {
    disconnected: '通知服務未連線',
    connecting: '正在連線到通知服務...',
    connected: '通知服務已連線，即時接收通知',
    error: '通知服務連線錯誤，將自動重試'
  }
  return messages[connectionState.value] || '通知服務狀態未知'
})
</script>

<style scoped>
.connection-status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: var(--capy-radius-sm);
  cursor: help;
  transition: all var(--capy-transition-fast);
}

.connection-status-indicator:hover {
  background-color: var(--capy-bg-elevated);
}

/* 狀態點 */
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--capy-radius-circle);
  position: relative;
  transition: all var(--capy-transition-fast);
}

/* 已連線 - 綠色 */
.dot-connected {
  background-color: #67c23a;
  box-shadow: 0 0 0 0 rgba(103, 194, 58, 0.4);
  animation: pulse-green 2s infinite;
}

/* 連線中 - 黃色 */
.dot-connecting {
  background-color: #e6a23c;
  animation: pulse-yellow 1.5s infinite;
}

/* 未連線 - 灰色 */
.dot-disconnected {
  background-color: #909399;
}

/* 錯誤 - 紅色 */
.dot-error {
  background-color: #f56c6c;
  animation: pulse-red 1s infinite;
}

/* 狀態標籤 */
.status-label {
  font-size: var(--capy-font-size-xs);
  font-weight: var(--capy-font-weight-medium);
  color: var(--capy-text-secondary);
  white-space: nowrap;
}

.status-connected .status-label {
  color: #67c23a;
}

.status-connecting .status-label {
  color: #e6a23c;
}

.status-error .status-label {
  color: #f56c6c;
}

/* 脈衝動畫 */
@keyframes pulse-green {
  0% {
    box-shadow: 0 0 0 0 rgba(103, 194, 58, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(103, 194, 58, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(103, 194, 58, 0);
  }
}

@keyframes pulse-yellow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes pulse-red {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* 響應式 */
@media (max-width: 768px) {
  .status-label {
    display: none;
  }
}
</style>
