<template>
  <div class="learning-layout">
    <!-- 簡化 Header -->
    <header class="learning-header">
      <div class="header-content">
        <!-- Logo 左對齊 -->
        <div class="logo-section">
          <router-link to="/" class="logo-link">
            <!-- <img src="/vite.svg" alt="Logo" class="logo-image" /> -->
            <span class="logo-text">課程平台</span>
          </router-link>
        </div>

        <!-- 課程標題居中 -->
        <div class="course-title-section">
          <h1 class="course-title">{{ courseTitle }}</h1>
        </div>

        <!-- 使用者資訊右對齊 -->
        <div class="user-section">
          <el-dropdown trigger="click">
            <div class="user-avatar-wrapper">
              <el-avatar
                :size="36"
                :src="userAvatar"
                class="user-avatar"
              >
                <el-icon><User /></el-icon>
              </el-avatar>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-icon><User /></el-icon>
                  個人資料
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-icon><Setting /></el-icon>
                  設定
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  登出
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>

    <!-- 主內容區域 -->
    <main class="learning-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { User, Setting, SwitchButton } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 使用者資訊
const userAvatar = ref('')
const userName = ref('使用者')

// 從路由或 store 取得課程標題
const courseTitle = computed(() => {
  // 這裡可以從 route.meta 或 Pinia store 取得實際課程標題
  return route.meta?.courseTitle || '課程學習'
})

/**
 * 處理登出
 */
const handleLogout = () => {
  // 清除使用者資訊
  localStorage.removeItem('userToken')
  // 導向登入頁
  router.push('/login')
}
</script>

<style scoped lang="scss">
.learning-layout {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.learning-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #1a1a1a;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  .header-content {
    height: 100%;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 100%;
  }

  .logo-section {
    flex: 0 0 auto;
    min-width: 200px;

    .logo-link {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: #ffffff;
      transition: opacity 0.3s;

      &:hover {
        opacity: 0.8;
      }

      .logo-image {
        width: 32px;
        height: 32px;
      }

      .logo-text {
        font-size: 18px;
        font-weight: 600;
      }
    }
  }

  .course-title-section {
    flex: 1;
    display: flex;
    justify-content: center;
    padding: 0 24px;
    overflow: hidden;

    .course-title {
      font-size: 16px;
      font-weight: 500;
      color: #ffffff;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 600px;
    }
  }

  .user-section {
    flex: 0 0 auto;
    min-width: 200px;
    display: flex;
    justify-content: flex-end;

    .user-avatar-wrapper {
      cursor: pointer;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.05);
      }

      .user-avatar {
        border: 2px solid #409EFF;
      }
    }
  }
}

.learning-main {
  margin-top: 60px;
  flex: 1;
  width: 100%;
  overflow: hidden;
}

// 響應式設計
@media (max-width: 768px) {
  .learning-header {
    .header-content {
      padding: 0 16px;
    }

    .logo-section {
      min-width: auto;

      .logo-text {
        display: none;
      }
    }

    .course-title-section {
      padding: 0 16px;

      .course-title {
        font-size: 14px;
        max-width: 200px;
      }
    }

    .user-section {
      min-width: auto;
    }
  }
}
</style>
