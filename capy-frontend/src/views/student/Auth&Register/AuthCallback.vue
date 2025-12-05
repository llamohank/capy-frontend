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
 *
 * 修復：加入延遲和重試機制，確保 Cookie 在瀏覽器重導向後已完全設定
 */
onMounted(async () => {
  try {
    // 🔍 診斷 log
    console.log('🔍 [AuthCallback] onMounted 觸發')
    console.log('🔍 [AuthCallback] route.path:', route.path)
    console.log('🔍 [AuthCallback] route.query:', JSON.stringify(route.query))
    console.log('🔍 [AuthCallback] google_bind_flow:', sessionStorage.getItem('google_bind_flow'))
    console.log('🔍 [AuthCallback] oauth_redirect:', sessionStorage.getItem('oauth_redirect'))

    // 檢查 URL 參數
    const { error, code, message, googleId, flow } = route.query
    const isBindFlow = sessionStorage.getItem('google_bind_flow')

    console.log('🔍 [AuthCallback] error:', error)
    console.log('🔍 [AuthCallback] googleId:', googleId)
    console.log('🔍 [AuthCallback] flow:', flow)
    console.log('🔍 [AuthCallback] isBindFlow:', isBindFlow)

    // 情境 1：綁定流程錯誤
    if (error === 'true' && (isBindFlow === 'true' || flow === 'bind')) {
      console.log('❌ [AuthCallback] 檢測到綁定錯誤')

      const errorMessage = message ? decodeURIComponent(message) : '綁定失敗'
      ElMessage.error(errorMessage)

      sessionStorage.removeItem('google_bind_flow')
      const redirectPath = sessionStorage.getItem('oauth_redirect') || '/student-center'
      sessionStorage.removeItem('oauth_redirect')

      console.log('🔍 [AuthCallback] 重導向到:', redirectPath)
      await router.replace(redirectPath)
      return
    }

    // 情境 2：綁定流程成功（後端返回 googleId 和 flow=bind）
    if (googleId && (flow === 'bind' || isBindFlow === 'true')) {
      console.log('✅ [AuthCallback] 檢測到綁定流程，重導向到學生中心並帶上 googleId')

      // 取得原始頁面路徑
      const redirectPath = sessionStorage.getItem('oauth_redirect') || '/student-center'

      // 不要清除標記，讓 StudentProfileEditDialog 可以檢測到
      // sessionStorage.removeItem('google_bind_flow')  // ← 保留標記
      sessionStorage.removeItem('oauth_redirect')

      // 重導向到學生中心並帶上 googleId
      await router.replace({
        path: redirectPath,
        query: { googleId }
      })
      return
    }

    console.log('🔍 [AuthCallback] 非綁定流程，繼續登入流程')

    // 給予瀏覽器一點時間來同步 Cookie（修復重導向後 Cookie 未設定的問題）
    await new Promise(resolve => setTimeout(resolve, 300))

    // 嘗試從後端獲取使用者資訊（透過 Cookie 驗證）
    // 加入重試機制：最多嘗試 3 次，每次間隔 500ms
    let attempt = 0
    const maxAttempts = 3
    let lastError = null

    while (attempt < maxAttempts) {
      try {
        await userStore.init()

        // 檢查是否成功獲取使用者資訊
        if (userStore.isAuthenticated) {
          ElMessage.success('登入成功!')

          // 檢查是否有原始目標路徑
          const redirectPath = route.query.redirect || '/'

          // 跳轉到目標頁面
          await router.replace(redirectPath)
          return
        }

        // 如果沒有驗證成功但也沒有錯誤，可能需要重試
        if (attempt < maxAttempts - 1) {
          console.log(`Cookie 驗證失敗，第 ${attempt + 1} 次重試...`)
          await new Promise(resolve => setTimeout(resolve, 500))
          attempt++
          continue
        }

        // 最後一次嘗試仍失敗
        break

      } catch (err) {
        lastError = err

        // 如果是 401 錯誤，不需要重試（表示未綁定或未授權）
        if (err.response?.status === 401 || err.status === 401) {
          break
        }

        // 其他錯誤，如果還有重試次數則繼續
        if (attempt < maxAttempts - 1) {
          console.log(`驗證發生錯誤，第 ${attempt + 1} 次重試...`, err)
          await new Promise(resolve => setTimeout(resolve, 500))
          attempt++
          continue
        }

        break
      }
    }

    // 所有嘗試都失敗後的處理
    if (!userStore.isAuthenticated) {
      // 如果無法獲取使用者資訊，表示 Cookie 無效或未設定
      // 可能是未綁定的 Google 帳號，重導向到登入頁面
      if (lastError?.response?.status === 401 || lastError?.status === 401) {
        ElMessage.info('請完成帳號註冊')
      } else {
        ElMessage.warning('請完成帳號設定')
      }
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
