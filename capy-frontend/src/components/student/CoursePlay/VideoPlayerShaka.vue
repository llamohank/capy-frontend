<template>
  <div class="video-player-container">
    <!-- 載入中狀態 -->
    <div v-if="loading" class="loading-overlay">
      <el-icon class="is-loading" :size="48">
        <Loading />
      </el-icon>
      <p class="loading-text">載入影片中...</p>
    </div>

    <!-- 錯誤狀態 -->
    <div v-if="error" class="error-overlay">
      <el-icon :size="48" color="#F56C6C">
        <CircleClose />
      </el-icon>
      <p class="error-text">{{ error }}</p>
      <el-button @click="retryLoad" type="primary">重試</el-button>
    </div>

    <!-- 影片容器 -->
    <div ref="videoContainer" class="video-wrapper">
      <video
        ref="videoElement"
        class="video-element"
        :poster="poster"
        playsinline
        crossorigin="use-credentials"
      ></video>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { Loading, CircleClose } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import VideoPlayer from '@llamohank/custom-shaka-player'

/**
 * Props 定義
 * @property {string} videoUrl - 影片串流 URL (DASH/HLS)
 * @property {string} poster - 封面圖 URL
 * @property {boolean} autoplay - 是否自動播放
 * @property {boolean} muted - 是否靜音（預設 false）
 * @property {number} startTime - 起始播放秒數
 */
const props = defineProps({
  videoUrl: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    default: ''
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  muted: {
    type: Boolean,
    default: false
  },
  startTime: {
    type: Number,
    default: 0
  }
})

/**
 * Emits 定義
 * @event timeupdate - 播放時間更新 (currentTime, duration)
 * @event ended - 影片播放結束
 * @event error - 播放錯誤 (errorMessage)
 */
const emit = defineEmits(['timeupdate', 'ended', 'error'])

// Refs
const videoElement = ref(null)
const videoContainer = ref(null)
const loading = ref(true)
const error = ref('')

// Custom VideoPlayer 實例
let player = null
let progressSaveInterval = null

/**
 * 初始化自訂 Video Player
 */
const initPlayer = async () => {
  try {
    loading.value = true
    error.value = ''

    // 建立自訂播放器實例
    player = new VideoPlayer(
      videoElement.value,
      videoContainer.value,
      { seekJumpSeconds: 10 }
    )

    // 初始化播放器
    const initialized = await player.initialize()
    if (!initialized) {
      throw new Error('您的瀏覽器不支援影片播放功能')
    }

    // 配置 Shaka Player 網路請求，確保所有 HLS 請求都帶上憑證
    if (player.shakaPlayer) {
      player.shakaPlayer.getNetworkingEngine().registerRequestFilter((type, request) => {
        // 為所有請求添加 withCredentials
        request.allowCrossSiteCredentials = true
      })
    }

    // 載入影片
    await player.play(props.videoUrl, {
      posterUrl: props.poster
    })

    // 設定起始時間
    if (props.startTime > 0) {
      videoElement.value.currentTime = props.startTime
    } else {
      // 嘗試從 localStorage 恢復播放進度
      const savedProgress = getSavedProgress()
      if (savedProgress > 0) {
        videoElement.value.currentTime = savedProgress
      }
    }

    // 設定靜音
    if (props.muted) {
      videoElement.value.muted = true
    }

    // 自動播放
    if (props.autoplay) {
      await videoElement.value.play()
    }

    loading.value = false

    // 設定事件監聽
    setupEventListeners()

    // 啟動進度自動儲存
    startProgressSaving()

  } catch (err) {
    console.error('播放器初始化失敗:', err)
    error.value = err.message || '影片載入失敗，請稍後再試'
    loading.value = false
    emit('error', error.value)
  }
}

/**
 * 設定影片事件監聽
 */
const setupEventListeners = () => {
  const video = videoElement.value
  if (!video) return

  // 時間更新事件
  video.addEventListener('timeupdate', () => {
    emit('timeupdate', {
      currentTime: video.currentTime,
      duration: video.duration
    })
  })

  // 播放結束事件
  video.addEventListener('ended', () => {
    emit('ended')
    clearSavedProgress()
  })

  // 鍵盤快捷鍵
  video.addEventListener('keydown', handleKeyboard)
}

/**
 * 處理鍵盤快捷鍵
 * @param {KeyboardEvent} e - 鍵盤事件
 */
const handleKeyboard = (e) => {
  const video = videoElement.value
  if (!video) return

  switch (e.key) {
    case ' ':
      e.preventDefault()
      video.paused ? video.play() : video.pause()
      break
    case 'ArrowLeft':
      e.preventDefault()
      video.currentTime = Math.max(0, video.currentTime - 10)
      break
    case 'ArrowRight':
      e.preventDefault()
      video.currentTime = Math.min(video.duration, video.currentTime + 10)
      break
    case 'ArrowUp':
      e.preventDefault()
      video.volume = Math.min(1, video.volume + 0.1)
      break
    case 'ArrowDown':
      e.preventDefault()
      video.volume = Math.max(0, video.volume - 0.1)
      break
  }
}


/**
 * 重試載入
 */
const retryLoad = () => {
  error.value = ''
  initPlayer()
}

/**
 * 啟動進度自動儲存
 */
const startProgressSaving = () => {
  // 每 5 秒儲存一次播放進度
  progressSaveInterval = setInterval(() => {
    if (videoElement.value && !videoElement.value.paused) {
      saveProgress(videoElement.value.currentTime)
    }
  }, 5000)
}

/**
 * 儲存播放進度
 * @param {number} time - 當前播放時間
 */
const saveProgress = (time) => {
  const key = `video_progress_${props.videoUrl}`
  localStorage.setItem(key, time.toString())
}

/**
 * 取得已儲存的播放進度
 * @returns {number} 播放進度（秒）
 */
const getSavedProgress = () => {
  const key = `video_progress_${props.videoUrl}`
  const saved = localStorage.getItem(key)
  return saved ? parseFloat(saved) : 0
}

/**
 * 清除已儲存的播放進度
 */
const clearSavedProgress = () => {
  const key = `video_progress_${props.videoUrl}`
  localStorage.removeItem(key)
}

/**
 * 監聽 videoUrl 變化
 */
watch(() => props.videoUrl, async (newUrl) => {
  if (newUrl && player) {
    loading.value = true
    try {
      await player.play(newUrl, {
        posterUrl: props.poster
      })
      loading.value = false
    } catch (err) {
      error.value = '切換影片失敗'
      loading.value = false
    }
  }
})

// 生命週期
onMounted(async () => {
  await nextTick()
  initPlayer()
})

onBeforeUnmount(async () => {
  // 清理播放器
  if (player) {
    await player.destroy()
    player = null
  }

  // 清理定時器
  if (progressSaveInterval) {
    clearInterval(progressSaveInterval)
  }

  // 儲存最後的播放進度
  if (videoElement.value) {
    saveProgress(videoElement.value.currentTime)
  }
})
</script>

<style scoped lang="scss">
.video-player-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #000;
  overflow: hidden;
}

.video-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;

  .video-element {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.loading-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 10;
  gap: 16px;
}

.loading-text,
.error-text {
  color: #fff;
  font-size: 16px;
  margin: 0;
}

.error-text {
  color: #F56C6C;
}

// 自訂播放器控制列樣式（可選）
:deep(.shaka-controls-container) {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

:deep(.shaka-play-button),
:deep(.shaka-volume-bar-container),
:deep(.shaka-current-time),
:deep(.shaka-time-separator),
:deep(.shaka-duration) {
  color: #409EFF;
}

:deep(.shaka-seek-bar-container) {
  .shaka-seek-bar {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .shaka-buffered-range {
    background-color: rgba(255, 255, 255, 0.5);
  }

  .shaka-played-range {
    background-color: #409EFF;
  }
}
</style>
