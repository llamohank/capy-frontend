<template>
  <el-dropdown
    trigger="click"
    :popper-options="{ placement: 'bottom-end' }"
    popper-class="user-dropdown-popper"
  >
    <!-- Trigger: Avatar -->
    <el-avatar
      :size="40"
      :src="userStore.userInfo.avatarUrl || defaultAvatar"
      class="user-avatar-trigger"
    />

    <!-- Dropdown Menu Content -->
    <template #dropdown>
      <div class="user-dropdown-menu">
        <!-- Header Section: User Info -->
        <div class="user-dropdown-header">
          <el-avatar
            :size="48"
            :src="userStore.userInfo.avatarUrl || defaultAvatar"
          />
          <div class="user-info">
            <div class="user-nickname">{{ userStore.userInfo.nickname || '使用者' }}</div>
            <!-- <div class="user-email">{{ userEmail }}</div> -->
          </div>
        </div>

        <!-- Menu Items -->
        <div class="user-dropdown-items">
          <!-- My Learning -->
          <div class="dropdown-item" @click="handleNavigation('/student')">
            <div class="item-icon">
              <el-icon><VideoPlay /></el-icon>
            </div>
            <span class="item-text">我的學習</span>
          </div>

          <!-- Wishlist -->
          <div class="dropdown-item" @click="handleNavigation('/student/wishlist')">
            <div class="item-icon">
              <el-icon><Star /></el-icon>
            </div>
            <span class="item-text">願望清單</span>
          </div>

          <!-- Orders / Receipts -->
          <div class="dropdown-item" @click="handleNavigation('/student/orders')">
            <div class="item-icon">
              <el-icon><Tickets /></el-icon>
            </div>
            <span class="item-text">訂單 / 收據</span>
          </div>

          <!-- Notifications -->
          <div class="dropdown-item" @click="handleNavigation('/student/notifications')">
            <div class="item-icon">
              <el-icon><Bell /></el-icon>
            </div>
            <span class="item-text">通知</span>
          </div>

          <!-- Role Switcher (Dynamic) -->
          <div
            v-if="showRoleSwitcher"
            class="dropdown-item role-switcher-item"
            @click="handleRoleSwitch"
          >
            <div class="item-icon role-switcher-icon">
              <el-icon><component :is="roleSwitcherIcon" /></el-icon>
            </div>
            <span class="item-text role-switcher-text">{{ roleSwitcherText }}</span>
          </div>

          <!-- Divider -->
          <el-divider class="dropdown-divider" />

          <!-- Log Out -->
          <div class="dropdown-item logout-item" @click="handleLogout">
            <div class="item-icon">
              <el-icon><SwitchButton /></el-icon>
            </div>
            <span class="item-text">登出</span>
          </div>
        </div>
      </div>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  VideoPlay,
  Star,
  Tickets,
  Switch,
  Monitor,
  SwitchButton,
  Bell
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 預設頭像
const defaultAvatar = '/capybaraProfile.png'

// 使用者 Email（從 userStore 取得）
const userEmail = computed(() => {
  return userStore.userInfo.email || 'user@example.com'
})

/**
 * 角色切換器顯示邏輯
 */
const showRoleSwitcher = computed(() => {
  // 暫時隱藏角色切換器，因為 API 響應中沒有 roles 資訊
  // TODO: 當後端 API 提供 roles 資訊時，更新此邏輯
  return false
})

/**
 * 角色切換器文字
 */
const roleSwitcherText = computed(() => {
  // 暫時返回預設值
  // TODO: 當後端 API 提供 roles 資訊時，更新此邏輯
  return '成為講師'
})

/**
 * 角色切換器圖示
 */
const roleSwitcherIcon = computed(() => {
  // 暫時返回預設圖示
  // TODO: 當後端 API 提供 roles 資訊時，更新此邏輯
  return Switch
})

/**
 * 角色切換器連結
 */
const roleSwitcherLink = computed(() => {
  // 暫時返回預設連結
  // TODO: 當後端 API 提供 roles 資訊時，更新此邏輯
  return '/instructor/landing' // 成為講師的落地頁
})

/**
 * 處理導航
 */
const handleNavigation = (path) => {
  router.push(path)
}

/**
 * 處理角色切換
 */
const handleRoleSwitch = () => {
  router.push(roleSwitcherLink.value)
}

/**
 * 處理登出
 */
const handleLogout = async () => {
  try {
    await userStore.logout()
    ElMessage.success('已成功登出')
    await router.push('/login')
  } catch (error) {
    console.error('登出失敗:', error)
    // 即使登出失敗，仍然導向登入頁
    ElMessage.warning('登出時發生錯誤，但已清除本地狀態')
    await router.push('/login')
  }
}
</script>

<style scoped>
/* Avatar Trigger */
.user-avatar-trigger {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.user-avatar-trigger:hover {
  transform: scale(1.05);
}

/* Dropdown Menu Container */
.user-dropdown-menu {
  width: 260px;
  padding: 0;
}

/* Header Section */
.user-dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background-color: #FAFAFA; /* 淺灰背景以區分 */
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-nickname {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-email {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Menu Items Section */
.user-dropdown-items {
  padding: 8px 0;
}

/* Individual Dropdown Item */
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: var(--el-fill-color-light);
}

/* Icon with Background */
.item-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F5F7FA;
  border-radius: 8px;
  flex-shrink: 0;
}

.item-icon .el-icon {
  font-size: 18px;
  color: var(--el-text-color-regular);
}

/* Item Text */
.item-text {
  font-size: 14px;
  color: var(--el-text-color-primary);
  font-weight: 500;
}

/* Role Switcher Special Styling */
.role-switcher-item .role-switcher-icon {
  background-color: rgba(0, 191, 165, 0.1); /* 淺 Teal 背景 */
}

.role-switcher-item .role-switcher-icon .el-icon {
  color: #00BFA5; /* Primary Teal */
}

.role-switcher-item .role-switcher-text {
  color: #00BFA5; /* Primary Teal 文字 */
  font-weight: 600;
}

.role-switcher-item:hover .role-switcher-icon {
  background-color: rgba(0, 191, 165, 0.15);
}

/* Logout Item Special Styling */
.logout-item {
  margin-top: 4px; /* 在分隔線後增加間距 */
}

.logout-item:hover .item-icon {
  background-color: var(--el-color-danger-light-9);
}

.logout-item:hover .item-icon .el-icon {
  color: var(--el-color-danger);
}

.logout-item:hover .item-text {
  color: var(--el-color-danger);
}

/* Divider */
.dropdown-divider {
  margin: 8px 0;
}
</style>

<style>
/* Global Popper Styles (without scoped) */
.user-dropdown-popper {
  padding: 0 !important;
}

.user-dropdown-popper .el-dropdown-menu {
  padding: 0;
}

.user-dropdown-popper .el-dropdown-menu__item {
  padding: 0;
}
</style>
