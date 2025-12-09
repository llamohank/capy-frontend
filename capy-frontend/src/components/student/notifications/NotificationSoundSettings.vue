<template>
  <div class="notification-sound-settings">
    <div class="setting-item">
      <div class="setting-label">
        <el-icon><Bell /></el-icon>
        <span>通知音效</span>
      </div>
      <el-switch
        v-model="soundEnabled"
        @change="handleSoundToggle"
        active-text="開啟"
        inactive-text="關閉"
      />
    </div>

    <div v-if="soundEnabled" class="setting-item volume-control">
      <div class="setting-label">
        <el-icon><Microphone /></el-icon>
        <span>音量</span>
      </div>
      <div class="volume-slider">
        <el-slider
          v-model="volume"
          :min="0"
          :max="100"
          :show-tooltip="true"
          :format-tooltip="formatVolumeTooltip"
          @change="handleVolumeChange"
        />
      </div>
    </div>

    <div v-if="soundEnabled" class="setting-item test-buttons">
      <div class="setting-label">
        <el-icon><VideoPlay /></el-icon>
        <span>測試音效</span>
      </div>
      <div class="test-button-group">
        <el-button size="small" @click="testSound('default')">
          預設
        </el-button>
        <el-button size="small" type="success" @click="testSound('success')">
          成功
        </el-button>
        <el-button size="small" type="warning" @click="testSound('warning')">
          警告
        </el-button>
        <el-button size="small" type="danger" @click="testSound('error')">
          錯誤
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Bell, Microphone, VideoPlay } from '@element-plus/icons-vue'
import { useNotificationStore } from '@/stores/notification'
import { ElMessage } from 'element-plus'

const notificationStore = useNotificationStore()

// 音效開關狀態
const soundEnabled = ref(notificationStore.isSoundEnabled)

// 音量 (0-100)
const volume = ref(Math.round(notificationStore.getSoundVolume() * 100))

// 初始化
onMounted(() => {
  soundEnabled.value = notificationStore.isSoundEnabled
  volume.value = Math.round(notificationStore.getSoundVolume() * 100)
})

// 切換音效開關
const handleSoundToggle = (value) => {
  if (value) {
    notificationStore.enableSound()
    ElMessage.success('通知音效已開啟')
  } else {
    notificationStore.disableSound()
    ElMessage.info('通知音效已關閉')
  }
}

// 調整音量
const handleVolumeChange = (value) => {
  notificationStore.setSoundVolume(value / 100)
}

// 格式化音量提示
const formatVolumeTooltip = (value) => {
  return `${value}%`
}

// 測試音效
const testSound = (type) => {
  notificationStore.testSound(type)
}
</script>

<style scoped>
.notification-sound-settings {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-md);
  padding: var(--capy-spacing-md);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--capy-spacing-md);
}

.setting-label {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-xs);
  font-size: var(--capy-font-size-sm);
  font-weight: var(--capy-font-weight-medium);
  color: var(--capy-text-primary);
}

.volume-control {
  flex-direction: column;
  align-items: stretch;
}

.volume-slider {
  width: 100%;
  padding: 0 var(--capy-spacing-xs);
}

.test-buttons {
  flex-direction: column;
  align-items: stretch;
}

.test-button-group {
  display: flex;
  gap: var(--capy-spacing-xs);
  flex-wrap: wrap;
}

.test-button-group .el-button {
  flex: 1;
  min-width: 60px;
}
</style>
