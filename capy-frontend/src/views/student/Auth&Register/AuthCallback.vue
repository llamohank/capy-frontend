<template>
  <div class="auth-callback-container">
    <div class="loading-content">
      <el-icon class="loading-icon" :size="48">
        <Loading />
      </el-icon>
      <p class="loading-text">處理登入中...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

/**
 * 處理 OAuth 回調邏輯
 * 後端在 OAuth 成功後會設定 Cookie 並重導向到此頁面
 * 前端嘗試透過 Cookie 獲取使用者資訊來判斷是否登入成功
 *
 * 三種情境：
 * 1. /oauth-callback - 登入成功（Cookie 已由後端設定）
 * 2. /login?email=...&googleId=... - 未綁定，需要註冊
 * 3. /login?oauthError=... - 錯誤或帳號停用
 *
 * 注意：情境 2 和 3 會直接 redirect 到 /login，由 LoginPage.vue 處理
 */
onMounted(async () => {
  try {
    // 嘗試從後端獲取使用者資訊（透過 Cookie 驗證）
    await userStore.init()

    // 檢查是否成功獲取使用者資訊
    if (userStore.isAuthenticated) {
      ElMessage.success('登入成功!')

      // 檢查是否有原始目標路徑
      const redirectPath = route.query.redirect || '/'

      // 跳轉到目標頁面
      await router.replace(redirectPath)
      return
    } else {
      // 如果無法獲取使用者資訊，表示 Cookie 無效或未設定
      // 可能是未綁定的 Google 帳號，重導向到登入頁面
      ElMessage.warning('請完成帳號設定')
      await router.replace('/login')
      return
    }

  } catch (err) {
    console.error('OAuth 回調處理錯誤:', err)

    // 如果是 401 錯誤，表示未綁定，需要註冊
    if (err.response?.status === 401) {
      ElMessage.info('請完成帳號註冊')
    } else {
      ElMessage.error('處理登入時發生錯誤')
    }

    await router.replace('/login')
  }
})
</script>

<style scoped>
.auth-callback-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;

  /* 使用變數確保與全站主題連動 */
  background: linear-gradient(135deg, var(--capy-primary) 0%, var(--capy-primary-dark) 100%);
}

.loading-content {
  text-align: center;
  background: white;
  padding: 48px 64px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.loading-icon {
  color: var(--capy-primary);
  animation: rotate 1.5s linear infinite;
  margin-bottom: 16px;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}
</style>
