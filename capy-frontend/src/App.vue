<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { Top } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";
import { useCartStore } from "@/stores/cart";
import { useWishlistStore } from "@/stores/wishlist";
import { useNotificationStore } from "@/stores/notification";

const userStore = useUserStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const notificationStore = useNotificationStore();

// 回到頂部按鈕狀態
const showBackTop = ref(false);

// 監聽滾動事件
const handleScroll = () => {
  const scrollTop =
    window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  const newShowValue = scrollTop > 10; // 降低到 100px

  // 只在狀態改變時輸出日誌,避免過多日誌
  if (showBackTop.value !== newShowValue) {
    console.log("🔄 Button visibility changed!");
    console.log("📏 Scroll position:", scrollTop);
    console.log("👁️ Show button:", newShowValue);
  }

  showBackTop.value = newShowValue;
};

// 回到頂部函數
const scrollToTop = () => {
  console.log("🚀 Scrolling to top...");

  // 嘗試多種滾動方式
  try {
    // 方式 1: window.scrollTo
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // 方式 2: document.documentElement.scrollTop
    document.documentElement.scrollTop = 0;

    // 方式 3: document.body.scrollTop
    document.body.scrollTop = 0;

    console.log("✅ Scroll commands executed");
  } catch (error) {
    console.error("❌ Scroll error:", error);
  }
};

onMounted(async () => {
  console.log("App.vue mounted");

  // 頁面重整時初始化用戶資訊
  await userStore.init();

  // 只有在已登入時才從 localStorage 載入購物車和願望清單
  if (userStore.isAuthenticated) {
    console.log("✅ 用戶已登入，開始載入資料...");

    cartStore.loadFromStorage();
    wishlistStore.loadFromStorage();

    // 🔥 關鍵修改：立即啟動 SSE（不依賴 watch）
    try {
      await notificationStore.fetchStudentNotifications({
        page: 0,
        size: 10,
      });
      await notificationStore.fetchUnreadCount();
      notificationStore.startSSE();
      console.log("✅ SSE 連線已在 onMounted 中啟動");
    } catch (error) {
      console.error("❌ 初始化通知服務失敗:", error);
    }
  } else {
    console.log("👤 訪客模式");
  }

  // 🔥 關鍵：監聽頁面卸載事件，確保 SSE 連線被關閉
  window.addEventListener("beforeunload", () => {
    console.log("⚠️ 頁面即將卸載，關閉 SSE 連線");
    if (userStore.isAuthenticated) {
      notificationStore.stopSSE();
    }
  });

  // 添加滾動監聽 - 同時監聽 window 和 document
  window.addEventListener("scroll", handleScroll, { passive: true });
  document.addEventListener("scroll", handleScroll, { passive: true });
  console.log("✅ Scroll listener added to window and document");

  // 初始檢查
  console.log("🔍 Initial scroll check...");
  handleScroll();

  // 保留測試代碼:3秒後強制顯示按鈕,確認按鈕功能正常
  setTimeout(() => {
    console.log("🧪 Test: Forcing button to show for 5 seconds...");
    showBackTop.value = true;

    // 5秒後恢復正常狀態
    setTimeout(() => {
      console.log("🔄 Test ended, returning to normal scroll-based visibility");
      handleScroll();
    }, 5000);
  }, 3000);
});

// 監聽用戶登入狀態變化（用於登入/登出事件）
watch(
  () => userStore.isAuthenticated,
  async (isAuth, oldIsAuth) => {
    console.log("🔄 isAuthenticated 變化:", { from: oldIsAuth, to: isAuth });

    // 只在狀態真正變化時處理（避免初始化時重複執行）
    if (isAuth === oldIsAuth) {
      console.log("⏭️ 狀態未變化，跳過處理");
      return;
    }

    if (isAuth) {
      console.log("✅ 用戶登入，啟動通知服務");
      // 用戶登入時載入通知列表、獲取未讀數量並啟動 SSE
      try {
        await notificationStore.fetchStudentNotifications({
          page: 0,
          size: 10,
        });
        await notificationStore.fetchUnreadCount();
        notificationStore.startSSE();
      } catch (error) {
        console.error("❌ 啟動通知服務失敗:", error);
      }
    } else {
      console.log("👋 用戶登出，停止通知服務");
      // 用戶登出時停止 SSE 並清空通知列表
      notificationStore.stopSSE();
      // 清空通知數據
      notificationStore.notifications = [];
      notificationStore.unreadCount = 0;
    }
  }
);

// 組件卸載時清理 SSE 連線和滾動監聽
onUnmounted(() => {
  notificationStore.stopSSE();
  window.removeEventListener("scroll", handleScroll);
  document.removeEventListener("scroll", handleScroll);
  console.log("🗑️ Scroll listener removed");
});

// 監聽頁面可見性變化（優化）
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", async () => {
    if (document.hidden) {
      // 頁面隱藏時保持連線（後端有 30 分鐘超時）
      console.log("頁面隱藏，SSE 連線保持");
    } else {
      // 頁面顯示時確保連線並重新載入通知
      if (userStore.isAuthenticated) {
        console.log("頁面顯示，檢查 SSE 連線狀態");

        // 重新載入通知列表和未讀數量
        await notificationStore.fetchStudentNotifications({
          page: 0,
          size: 10,
        });
        await notificationStore.fetchUnreadCount();

        // 如果 SSE 未連線，重新建立連線
        if (!notificationStore.isSSEConnected) {
          console.log("重新建立 SSE 連線");
          notificationStore.startSSE();
        }
      }
    }
  });
}
</script>
<template>
  <div>
    <RouterView />

    <!-- 自定義回到頂部按鈕 -->
    <transition name="fade">
      <div v-show="showBackTop" class="custom-backtop" @click="scrollToTop">
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
  background: var(--capy-primary, #54cdf2);
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
  background: var(--capy-primary-dark, #3ab8dd);
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
