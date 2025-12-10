<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Top } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useNotificationStore } from '@/stores/notification'

const userStore = useUserStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const notificationStore = useNotificationStore()

// 回到頂部按鈕狀態
const showBackTop = ref(false)

// 監聽滾動事件
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  const newShowValue = scrollTop > 10  // 降低到 100px

  // 只在狀態改變時輸出日誌,避免過多日誌
  if (showBackTop.value !== newShowValue) {
    console.log('🔄 Button visibility changed!')
    console.log('📏 Scroll position:', scrollTop)
    console.log('👁️ Show button:', newShowValue)
  }

  showBackTop.value = newShowValue
}

// 回到頂部函數
const scrollToTop = () => {
  console.log('🚀 Scrolling to top...')

  // 嘗試多種滾動方式
  try {
    // 方式 1: window.scrollTo
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

    // 方式 2: document.documentElement.scrollTop
    document.documentElement.scrollTop = 0

    // 方式 3: document.body.scrollTop
    document.body.scrollTop = 0

    console.log('✅ Scroll commands executed')
  } catch (error) {
    console.error('❌ Scroll error:', error)
  }
}

onMounted(async () => {
  console.log('App.vue mounted')

  await userStore.init()

  // 只有在已登入時才從 localStorage 載入購物車和願望清單
  if (userStore.isAuthenticated) {
    cartStore.loadFromStorage()
    wishlistStore.loadFromStorage()

    // 獲取未讀通知數量
    notificationStore.fetchUnreadCount()

    // 啟動 SSE 通知服務
    notificationStore.startSSE()
  }

  // 添加滾動監聽 - 同時監聽 window 和 document
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('scroll', handleScroll, { passive: true })
  console.log('✅ Scroll listener added to window and document')

  // 初始檢查
  console.log('🔍 Initial scroll check...')
  handleScroll()

  // 保留測試代碼:3秒後強制顯示按鈕,確認按鈕功能正常
  setTimeout(() => {
    console.log('🧪 Test: Forcing button to show for 5 seconds...')
    showBackTop.value = true

    // 5秒後恢復正常狀態
    setTimeout(() => {
      console.log('🔄 Test ended, returning to normal scroll-based visibility')
      handleScroll()
    }, 5000)
  }, 3000)
})

// 監聽用戶登入狀態變化
watch(() => userStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    // 用戶登入時獲取未讀數量並啟動 SSE
    notificationStore.fetchUnreadCount()
    notificationStore.startSSE()
  } else {
    // 用戶登出時停止 SSE
    notificationStore.stopSSE()
  }
})

// 組件卸載時清理 SSE 連線和滾動監聽
onUnmounted(() => {
  notificationStore.stopSSE()
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('scroll', handleScroll)
  console.log('🗑️ Scroll listener removed')
})

// 監聽頁面可見性變化（優化）
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // 頁面隱藏時保持連線（後端有 30 分鐘超時）
      console.log('頁面隱藏，SSE 連線保持')
    } else {
      // 頁面顯示時確保連線
      if (userStore.isAuthenticated && !notificationStore.isSSEConnected) {
        console.log('頁面顯示，重新建立 SSE 連線')
        notificationStore.startSSE()
      }
    }
  })
}

</script>
<template>
  <div>
    <RouterView />

    <!-- 自定義回到頂部按鈕 -->
    <transition name="fade">
      <div
        v-show="showBackTop"
        class="custom-backtop"
        @click="scrollToTop"
      >
        <el-icon :size="20">
          <Top />
        </el-icon>
      </div>
    </transition>
  </div>
</template>
<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
}

/* 自定義回到頂部按鈕樣式 */
.custom-backtop {
  position: fixed;
  right: 40px;
  bottom: 40px;
  width: 50px;
  height: 50px;
  background: var(--capy-primary, #54CDF2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(84, 205, 242, 0.4);
  cursor: pointer;
  z-index: 9999;
  transition: all 0.3s ease;
}

.custom-backtop:hover {
  background: var(--capy-primary-dark, #3AB8DD);
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(84, 205, 242, 0.5);
}

.custom-backtop:active {
  transform: translateY(-1px);
}

/* 淡入淡出動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
