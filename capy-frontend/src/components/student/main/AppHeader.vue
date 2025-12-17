<template>
  <el-header class="header" :class="{ 'header-minimal': isApplicationPage }">
    <div class="header-content">
      <!-- 手機版漢堡選單按鈕 -->
      <div class="mobile-menu-btn" @click="handleMobileMenuToggle">
        <el-icon :size="24" color="#fff"><Menu /></el-icon>
      </div>

      <router-link to="/" class="logo">
        <el-icon :size="24" color="#fff"><Reading /></el-icon>
        <span class="logo-text">CapyCourse</span>
      </router-link>

      <!-- 只在非申請頁面顯示 Explore 按鈕 -->
      <div v-if="!isApplicationPage" class="explore">
        <router-link to="/explore" class="header-nav-link">
          <el-icon><Compass /></el-icon>
          <span>探索</span>
        </router-link>
      </div>

      <!-- 只在非申請頁面顯示搜尋框 -->
      <div v-if="!isApplicationPage" class="header-center">
        <SearchInput />
      </div>

      <!-- 在申請頁面時顯示佔位元素，保持 Logo 和使用者選單的間距 -->
      <div v-if="isApplicationPage" class="header-spacer"></div>

      <div class="header-actions">
        <!-- 未登入時顯示按鈕 -->
        <template v-if="!userStore.isAuthenticated">
          <!-- 只在非申請頁面顯示 Become a Teacher 按鈕 -->
          <router-link v-if="!isApplicationPage" to="/instructor/landing" class="header-nav-link">
            <el-icon><School /></el-icon>
            <span>成為老師</span>
          </router-link>
          <router-link to="/login">
            <el-button class="btn-white-pop">Log In</el-button>
          </router-link>
        </template>

        <!-- 已登入時顯示使用者資訊和登出按鈕 -->
        <template v-else>
          <!-- 只在非申請頁面顯示 Become a Teacher 按鈕（僅對非講師顯示） -->
          <router-link
            v-if="!isApplicationPage && !isInstructor"
            to="/instructor/landing"
            class="header-nav-link"
          >
            <el-icon><School /></el-icon>
            <span>成為老師</span>
          </router-link>

          <!-- 只在非申請頁面顯示購物車、收藏、通知按鈕 -->
          <template v-if="!isApplicationPage">
            <!-- 交易組 (購物車 + 願望清單) -->
            <div class="icon-group transaction-group">
              <el-badge :value="cartStore.itemCount" :hidden="cartStore.isEmpty" class="icon-badge">
                <el-button circle class="icon-button" @click="handleCart">
                  <el-icon><ShoppingCart /></el-icon>
                </el-button>
              </el-badge>
              <el-badge :value="wishlistStore.itemCount" :hidden="wishlistStore.isEmpty" class="icon-badge">
                <TheWishlistPopover>
                  <template #trigger>
                    <el-button circle class="icon-button">
                      <el-icon><Star /></el-icon>
                    </el-button>
                  </template>
                </TheWishlistPopover>
              </el-badge>
            </div>

            <!-- 分隔線 -->
            <div class="icon-divider"></div>

            <!-- 通知組 -->
            <div class="icon-group notification-group">
              <!-- 連線狀態指示器 -->
              <ConnectionStatusIndicator />

              <!-- 通知按鈕 -->
              <el-badge :value="notificationStore.unreadCount" :hidden="notificationStore.unreadCount === 0" class="icon-badge">
                <TheNotificationPopover>
                  <template #trigger>
                    <el-button circle class="icon-button">
                      <el-icon><Bell /></el-icon>
                    </el-button>
                  </template>
                </TheNotificationPopover>
              </el-badge>
            </div>
          </template>

          <TheUserDropdown />
        </template>
      </div>
    </div>

    <!-- 購物車抽屜 -->
    <TheCartDrawer v-model="cartStore.isCartOpen" />
  </el-header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Reading, ShoppingCart, Star, Bell, InfoFilled, Menu, Compass, School } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useNotificationStore } from '@/stores/notification'
import TheCartDrawer from '@/components/student/cart/TheCartDrawer.vue'
import TheWishlistPopover from '@/components/student/wishlist/TheWishlistPopover.vue'
import TheNotificationPopover from '@/components/student/notifications/TheNotificationPopover.vue'
import ConnectionStatusIndicator from '@/components/student/notifications/ConnectionStatusIndicator.vue'
import TheUserDropdown from '@/components/student/main/TheUserDropdown.vue'
import SearchInput from './SearchInput.vue'

const emit = defineEmits(['toggle-mobile-menu'])

/**
 * 處理手機版選單切換
 */
const handleMobileMenuToggle = () => {
  emit('toggle-mobile-menu')
}

const route = useRoute()
const userStore = useUserStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const notificationStore = useNotificationStore()

// ==================== 初始化資料 ====================

// 元件掛載時初始化
onMounted(async () => {
  // 注意：userStore.init() 已在 App.vue 和 router 中呼叫，這裡不需要重複呼叫

  // 只有在已登入時才載入願望清單
  if (userStore.isAuthenticated) {
    // 從 localStorage 載入願望清單（快速顯示，不呼叫 API）
    wishlistStore.loadFromStorage()

    // 通知資料已由 App.vue 透過 SSE 自動維護，不需要在這裡重複載入
    // notificationStore 的 unreadCount 和 notifications 會自動更新
  }
})

/**
 * 初始化願望清單模擬資料（僅用於測試）
 */
const initMockWishlistData = () => {
  const mockWishlistCourses = [
    {
      id: 4,
      title: 'React 18 完整開發指南',
      instructor: '陳小華',
      price: 1800,
      cover_image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'
    },
    {
      id: 5,
      title: 'Node.js 後端開發實戰',
      instructor: '林大明',
      price: 2000,
      cover_image_url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400'
    },
    {
      id: 6,
      title: 'MongoDB 資料庫設計與優化',
      instructor: '黃小美',
      price: 1500,
      cover_image_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400'
    }
  ]

  mockWishlistCourses.forEach(course => {
    wishlistStore.addItem(course)
  })

  console.log('✅ 已載入模擬願望清單資料')
}

/**
 * 檢查是否在申請表單頁面
 * 在此頁面時，只顯示 Logo 和使用者選單
 */
const isApplicationPage = computed(() => {
  return route.name === 'becomeInstructor'
})

/**
 * 檢查使用者是否為講師
 * 用於控制 "Become a Teacher" 按鈕的顯示
 */
const isInstructor = computed(() => {
  // 檢查使用者是否為講師（暫時返回 false，因為 API 響應中沒有 roles）
  // TODO: 當後端 API 提供 roles 資訊時，更新此邏輯
  return false
})

/**
 * 處理購物車點擊
 */
const handleCart = () => {
  cartStore.toggleCart()
}

/**
 * 處理通知點擊
 */
const handleNotifications = () => {
  router.push({ name: 'Notifications' })
}
</script>

<style lang="scss" scoped>
@import "@/styles/breakpoints";

.mobile-menu-btn {
  display: none;
  cursor: pointer;
  padding: 8px;
  margin-right: 8px;

  @include mobile {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.header {
  background: var(--capy-primary);
  padding: 0;
  height: 70px;
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.logo-text {
  white-space: nowrap;
}

.header-center {
  flex: 1;
  max-width: 500px;
}

.header-spacer {
  flex: 1;
}

/* 申請頁面的簡化樣式 */
.header-minimal .header-content {
  justify-content: space-between;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}

/* --- New Header Nav Link Style (Button-like) --- */
.header-nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px; /* Slightly reduced height for better proportions */
  padding: 0 16px;
  border-radius: 20px; /* Pill shape */
  color: #ffffff;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 500;

  /* Glassmorphism Base */
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
}

.header-nav-link:hover {
  background-color: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-nav-link:active {
  transform: translateY(0);
  background-color: rgba(255, 255, 255, 0.15);
}

.header-nav-link .el-icon {
  font-size: 16px; /* Slightly adjusted icon size */
}

/* --- 3. 純白跳色按鈕 (Log In) --- */
.btn-white-pop {
  /* 預設狀態：純白底 + 深藍字 (對比最強) */
  --el-button-bg-color: #ffffff;
  --el-button-border-color: #ffffff;
  --el-button-text-color: #0277BD; /* 深藍色，比淺藍更有質感 */

  /* Hover 狀態：微微變灰或維持白，但加強陰影 */
  --el-button-hover-bg-color: #F8FAFC;
  --el-button-hover-border-color: #ffffff;
  --el-button-hover-text-color: var(--capy-primary);

  /* 額外特效 */
  font-weight: 700; /* 加粗 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 懸浮陰影 */
  transition: all 0.3s ease;
}

/* Log In 按鈕 Hover 時的上浮效果 */
.btn-white-pop:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

/* --- 4. 圖標組樣式 --- */
.icon-group {
  display: flex;
  align-items: center;
  gap: 20px; /* 增加圖標間距到 20px */
}

/* 圖標按鈕樣式 */
.icon-button {
  --el-button-bg-color: rgba(255, 255, 255, 0.18);
  --el-button-border-color: transparent;
  --el-button-text-color: white;

  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}
.icon-button:hover {
  border-radius: 50%; /* 圓形 hover 效果 */
}

/* Badge 樣式優化 */
.icon-badge :deep(.el-badge__content) {
  background-color: #E6A23C; /* Warning Orange 取代 Red */
  border: 2px solid var(--capy-primary); /* 與 Teal 背景形成對比 */
}

/* 分隔線 */
.icon-divider {
  width: 1px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.3); /* 半透明白色 */
  margin: 0 4px;
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: nowrap !important;
    gap: 12px !important;
    justify-content: space-between !important;
  }

  /* FORCE Hide search bar on mobile */
  .header-center {
    display: none !important;
  }

  /* FORCE Hide Explore button on mobile */
  .explore {
    display: none !important;
  }

  /* FORCE Hide "Become a Teacher" and other nav links on mobile */
  .header-nav-link {
    display: none !important;
  }

  /* FORCE Hide transaction group (cart, wishlist) on mobile */
  .transaction-group,
  .icon-group.transaction-group {
    display: none !important;
    visibility: hidden !important;
  }

  /* FORCE Hide notification group on mobile */
  .notification-group,
  .icon-group.notification-group {
    display: none !important;
    visibility: hidden !important;
  }

  /* FORCE Hide icon divider on mobile */
  .icon-divider {
    display: none !important;
    visibility: hidden !important;
  }

  /* FORCE Hide all icon badges on mobile */
  .icon-badge {
    display: none !important;
  }

  /* Adjust header actions for mobile - only show login/user dropdown */
  .header-actions {
    gap: 8px !important;
    flex-shrink: 0 !important;
  }

  /* Keep logo visible and adjust size */
  .logo {
    font-size: 18px !important;
    flex-shrink: 0 !important;
  }

  .logo-text {
    display: inline !important;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 12px !important;
  }

  .logo {
    font-size: 16px !important;
  }
}
</style>
