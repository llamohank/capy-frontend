<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useNotificationStore } from '@/stores/notification'

const userStore = useUserStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const notificationStore = useNotificationStore()

onMounted(async () => {
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

// 組件卸載時清理 SSE 連線
onUnmounted(() => {
  notificationStore.stopSSE()
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
  <RouterView />
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
</style>
