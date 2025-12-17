<template>
  <div class="main-layout">
    <AppHeader @toggle-mobile-menu="showMobileMenu = true" />
    <main class="main-content">
      <router-view />
    </main>
    <AppFooter />

    <!-- 手機版側邊選單 -->
    <el-drawer
      v-model="showMobileMenu"
      direction="ltr"
      size="55%"
      :show-close="false"
      class="mobile-menu-drawer"
    >
      <template #header="{ close }">
        <div class="drawer-header">
          <div class="drawer-logo">
            <el-icon :size="24" color="var(--capy-primary)"><Reading /></el-icon>
            <span class="logo-text">CapyCourse</span>
          </div>
          <el-button link class="close-btn" @click="close">
            <el-icon :size="24"><Close /></el-icon>
          </el-button>
        </div>
      </template>

      <div class="drawer-content">
        <!-- 導航連結 -->
        <div class="nav-links">
          <!-- 手機版搜尋框 -->
          <div class="drawer-search-container">
            <SearchInput @search="showMobileMenu = false" />
          </div>

          <router-link to="/" class="nav-item" @click="showMobileMenu = false">
            <el-icon><HomeFilled /></el-icon>
            <span>首頁</span>
          </router-link>

          <router-link to="/explore" class="nav-item" @click="showMobileMenu = false">
            <el-icon><Compass /></el-icon>
            <span>探索課程</span>
          </router-link>

          <!-- 只有在未登入或不是講師時顯示 -->
          <router-link
            v-if="!userStore.isAuthenticated || !isInstructor"
            to="/instructor/landing"
            class="nav-item"
            @click="showMobileMenu = false"
          >
            <el-icon><School /></el-icon>
            <span>成為講師</span>
          </router-link>

                    <!-- 已登入的使用者連結 -->
                    <template v-if="userStore.isAuthenticated">
                      <div class="divider"></div>

                      <div class="nav-item is-clickable" @click="handleOpenCart">
                        <el-icon><ShoppingCart /></el-icon>
                        <span>購物車</span>
                        <el-tag v-if="cartStore.itemCount > 0" size="small" type="danger" effect="dark" round>
                          {{ cartStore.itemCount }}
                        </el-tag>
                      </div>

                      <!-- 願望清單 (可展開) -->            <div class="nav-group">
              <div class="nav-item is-clickable" @click="toggleSection('wishlist')" :class="{ 'is-active': expandedSection === 'wishlist' }">
                <el-icon><Star /></el-icon>
                <span>願望清單</span>
                <el-icon class="arrow-icon" :class="{ 'is-rotated': expandedSection === 'wishlist' }"><ArrowDown /></el-icon>
              </div>
              <div v-show="expandedSection === 'wishlist'" class="nav-content">
                <WishlistContent @close="showMobileMenu = false" />
              </div>
            </div>

             <!-- 通知中心 (可展開) -->
            <div class="nav-group">
              <div class="nav-item is-clickable" @click="toggleSection('notification')" :class="{ 'is-active': expandedSection === 'notification' }">
                <el-icon><Bell /></el-icon>
                <span>通知中心</span>
                <div class="badge-wrapper">
                  <el-tag v-if="notificationStore.unreadCount > 0" size="small" type="danger" effect="dark" round>
                    {{ notificationStore.unreadCount }}
                  </el-tag>
                  <el-icon class="arrow-icon" :class="{ 'is-rotated': expandedSection === 'notification' }"><ArrowDown /></el-icon>
                </div>
              </div>
              <div v-show="expandedSection === 'notification'" class="nav-content">
                <NotificationContent @close="showMobileMenu = false" />
              </div>
            </div>
          </template>
        </div>

        <!-- 底部操作區 -->
        <div class="drawer-footer">
          <template v-if="!userStore.isAuthenticated">
            <router-link to="/login" class="full-width-btn" @click="showMobileMenu = false">
              <el-button type="primary" size="large" class="login-btn">登入 / 註冊</el-button>
            </router-link>
          </template>

          <template v-else>
            <div class="user-info">
              <el-avatar :size="40" :src="userStore.userInfo?.avatarUrl" />
              <div class="user-details">
                <span class="user-name">{{ userStore.userInfo?.nickname || '使用者' }}</span>
                <span class="user-email">{{ userStore.userInfo?.email }}</span>
              </div>
            </div>
            <el-button @click="handleLogout" plain class="logout-btn">登出</el-button>
          </template>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Reading, Close, HomeFilled, Compass, School,
  ShoppingCart, Star, Bell, ArrowDown
} from '@element-plus/icons-vue'
import AppHeader from '@/components/student/main/AppHeader.vue'
import AppFooter from '@/components/student/main/AppFooter.vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useNotificationStore } from '@/stores/notification'
import WishlistContent from '@/components/student/wishlist/WishlistContent.vue'
import NotificationContent from '@/components/student/notifications/NotificationContent.vue'
import SearchInput from '@/components/student/main/SearchInput.vue'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()

const showMobileMenu = ref(false)
// 擴展狀態管理
const expandedSection = ref('') // 'wishlist' | 'notification' | ''

const toggleSection = (section) => {
  if (expandedSection.value === section) {
    expandedSection.value = ''
  } else {
    expandedSection.value = section
  }
}

// 檢查是否為講師 (需配合後端資料結構，此為預留)
const isInstructor = computed(() => false)

const handleOpenCart = () => {
  showMobileMenu.value = false
  cartStore.openCart()
}

const handleLogout = async () => {
  await userStore.logout()
  showMobileMenu.value = false
  router.push('/login')
}
</script>

<style lang="scss" scoped>
@import "@/styles/breakpoints";
@import "@/styles/typography";

.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

/* Mobile Menu Styles */
.mobile-menu-drawer {
  max-width: 320px !important; /* 限制最大寬度，避免在平板上太寬 */
}

.mobile-menu-drawer :deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 0;
  /* 確保 Header 不佔空間，因為我們自定義了 Header */
  display: none;
}

.mobile-menu-drawer :deep(.el-drawer__body) {
  padding: 0;
  height: 100%; /* 確保 Body 佔滿高度 */
  overflow: hidden; /* 防止 Body 出現雙重捲軸 */
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px; /* 減少 padding */
  border-bottom: 1px solid var(--capy-border-lighter);
  flex-shrink: 0; /* 防止 Header 被壓縮 */
}

.drawer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1; /* 佔據剩餘空間 */
  min-width: 0; /* 允許文字截斷 */
}

.logo-text {
  font-size: $font-lg; /* 縮小一點 (20px) */
  font-weight: bold;
  color: var(--capy-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5; /* 增加行高，防止下緣 (g, y, p) 被切掉 */
  padding-bottom: 2px; /* 額外微調，確保安全距離 */

  @include mobile {
    font-size: 18px; /* 手機版再小一點 */
  }
}

.close-btn {
  flex-shrink: 0; /* 防止按鈕被壓縮消失 */
  margin-left: 8px;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%; /* 重要：佔滿抽屜高度 */
  overflow: hidden; /* 防止整體捲動 */
}

.nav-links {
  flex: 1; /* 佔據中間剩餘空間 */
  padding: 16px; /* 減少 padding */
  display: flex;
  flex-direction: column;
  gap: 4px; /* 減少間距 */
  overflow-y: auto; /* 只有中間區域捲動 */
}

.drawer-search-container {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--capy-border-lighter);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px; /* 減少內距 */
  color: var(--capy-text-primary);
  text-decoration: none;
  border-radius: 8px;
  font-size: $font-base;
  font-weight: 500;
  transition: all 0.2s;

  &:hover, &.router-link-active {
    background-color: var(--capy-bg-surface-hover);
    color: var(--capy-primary);
  }

  .el-icon {
    font-size: 18px; /* 稍微縮小圖示 */
  }

  .el-tag {
    margin-left: auto;
  }
}

.nav-item.is-clickable {
  cursor: pointer;
  /* justify-content: space-between; Removed to fix center alignment issue */
}

.nav-group {
  display: flex;
  flex-direction: column;
}

.nav-content {
  background-color: var(--capy-bg-base);
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  margin-top: -4px; /* Connect with the item above */
  padding: 8px;
  border: 1px solid var(--capy-border-lighter);
  border-top: none;
}

.badge-wrapper {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.arrow-icon {
  margin-left: auto; /* Push to the right */
  font-size: 14px;
  transition: transform 0.3s ease;
  color: var(--capy-text-secondary);
}

.arrow-icon.is-rotated {
  transform: rotate(180deg);
}

.divider {
  height: 1px;
  background-color: var(--capy-border-lighter);
  margin: 8px 0;
}

.drawer-footer {
  padding: 16px; /* 減少 padding */
  border-top: 1px solid var(--capy-border-lighter);
  background-color: var(--capy-bg-surface);
  flex-shrink: 0; /* 防止 Footer 被擠壓 */
}

.full-width-btn {
  display: block;
  width: 100%;
  text-decoration: none;
}

.login-btn, .logout-btn {
  width: 100%;
  font-weight: 600;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.user-details {
  display: flex;
  flex-direction: column;
  min-width: 0; /* 允許文字截斷 */
}

.user-name {
  font-weight: bold;
  font-size: $font-base;
  color: var(--capy-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: $font-sm;
  color: var(--capy-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
