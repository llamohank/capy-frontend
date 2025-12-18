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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { bindGoogleAccount } from '@/api/oauth/oauth'
import { fetchStudentProfile } from '@/api/student/studentCenter'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

/**
 * 處理 OAuth 回調邏輯
 * 後端在 OAuth 成功後會設定 HttpOnly Cookie 並重導向到此頁面
 * 前端透過呼叫 /student/user API（帶 Cookie）來獲取使用者資訊
 *
 * 三種情境：
 * 1. /oauth-callback - 登入成功（Cookie 已由後端設定）
 * 2. /oauth-callback?googleId=...&flow=bind - Google 綁定流程
 * 3. /oauth-callback?error=true - OAuth 錯誤
 */
onMounted(async () => {
  console.log('🔍 [AuthCallback] onMounted 觸發')
  console.log('🔍 [AuthCallback] route.query:', JSON.stringify(route.query))

  try {
    // 檢查 URL 參數
    const { error, message, googleId, flow } = route.query
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

      await router.replace(redirectPath)
      return
    }

    // 情境 2：綁定流程成功
    if (googleId && (flow === 'bind' || isBindFlow === 'true')) {
      console.log('✅ [AuthCallback] 檢測到綁定流程')
      const redirectPath = sessionStorage.getItem('oauth_redirect') || '/student-center'
      sessionStorage.removeItem('oauth_redirect')

      await router.replace({
        path: redirectPath,
        query: { googleId }
      })
      return
    }

    // 情境 3：一般登入流程
    console.log('🔍 [AuthCallback] 一般登入流程')

    // 給予瀏覽器時間同步 Cookie
    await new Promise(resolve => setTimeout(resolve, 500))

    // OAuth 登入成功後，後端已設定 HttpOnly Cookie
    // 直接呼叫 /student/user API（帶 withCredentials: true）載入完整資料
    try {
      await userStore.init(true)

      if (userStore.isAuthenticated) {
        console.log('✅ [AuthCallback] OAuth 登入成功，使用者資料已載入')
        ElMessage.success('登入成功!')

        const redirectPath = route.query.redirect || '/'
        await router.replace(redirectPath)
        return
      }
    } catch (initError) {
      console.error('❌ [AuthCallback] 初始化失敗:', initError)

      // 如果是 401，表示 Cookie 無效或未設定（未綁定/未註冊）
      if (initError.response?.status === 401 || initError.status === 401) {
        console.log('🔍 [AuthCallback] 401 錯誤，Cookie 無效，重導向到登入頁')
        ElMessage.info('請完成帳號註冊或重新登入')
        await router.replace('/login')
        return
      }

      // 其他錯誤也導向登入頁
      throw initError
    }

    // 如果執行到這裡，表示沒有驗證成功
    console.log('⚠️ [AuthCallback] 未驗證成功，重導向到登入頁')
    ElMessage.warning('登入失敗，請重試')
    await router.replace('/login')

  } catch (err) {
    console.error('❌ [AuthCallback] 發生錯誤:', err)
    ElMessage.error('處理登入時發生錯誤')
    await router.replace('/login')
  }
})

/**
 * 處理 Google 帳號綁定
 * 新流程：OAuth 完成後要求輸入密碼，然後調用綁定 API
 * @param {string} googleId - Google ID (sub)
 * @param {string} googleEmail - Google Email
 */
const handleGoogleBinding = async (googleId, googleEmail) => {
  try {
    // 顯示密碼輸入對話框
    const { value: password } = await ElMessageBox.prompt(
      '請輸入您的帳號密碼以完成 Google 帳號綁定',
      '驗證身份',
      {
        confirmButtonText: '確認綁定',
        cancelButtonText: '取消',
        inputType: 'password',
        inputPlaceholder: '請輸入密碼',
        inputValidator: (value) => {
          if (!value) {
            return '請輸入密碼'
          }
          if (value.length < 6) {
            return '密碼長度至少需要 8 個字元'
          }
          return true
        },
        inputErrorMessage: '密碼格式不正確',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        customClass: 'google-bind-password-dialog'
      }
    )

    if (!password) {
      throw new Error('未輸入密碼')
    }

    // 調用綁定 API
    const response = await bindGoogleAccount({
      googleId,
      googleEmail,
      password
    })

    // 清除暫存的資料
    sessionStorage.removeItem('oauth_action')

    // 檢查回應是否成功
    if (response && response.success) {
      ElMessage.success(response.message || 'Google 帳號綁定成功')

      // 重要：不要調用 getStudentProfile()，因為後端可能已經切換了 session
      // 直接更新 userStore 中的 Google 綁定狀態
      userStore.updateUserInfo({
        ...userStore.userInfo,
        google_id: googleId,
        google_email: response.googleEmail || null,
        googleLinked: true
      })

      // 跳轉回原始頁面
      const redirectPath = sessionStorage.getItem('oauth_redirect') || '/student-center'
      sessionStorage.removeItem('oauth_redirect')
      await router.replace(redirectPath)
    } else {
      // 處理非成功回應
      throw new Error(response?.message || '綁定失敗')
    }

  } catch (error) {
    console.error('Google 綁定錯誤:', error)

    // 處理不同類型的錯誤
    let errorMessage = '綁定失敗，請稍後再試'

    if (error.response) {
      // HTTP 錯誤回應
      const status = error.response.status
      const data = error.response.data

      if (status === 401) {
        // 密碼錯誤或未授權
        errorMessage = data?.message || '密碼錯誤，請重新嘗試'
      } else if (status === 400) {
        // 請求參數錯誤
        errorMessage = data?.message || '請求參數錯誤'
      } else if (status === 409) {
        // 帳號已綁定
        errorMessage = data?.message || '此 Google 帳號已被其他使用者綁定'
      } else {
        // 其他伺服器錯誤
        errorMessage = data?.message || `伺服器錯誤 (${status})`
      }
    } else if (error.message) {
      // 自定義錯誤訊息
      errorMessage = error.message
    }

    ElMessage.error(errorMessage)

    // 清除暫存的資料
    sessionStorage.removeItem('oauth_action')

    // 跳轉回原始頁面
    const redirectPath = sessionStorage.getItem('oauth_redirect') || '/student-center'
    sessionStorage.removeItem('oauth_redirect')
    await router.replace(redirectPath)
  }
}
</script>

<style>
/* Google 綁定密碼對話框樣式 */
.google-bind-password-dialog {
  border-radius: 12px;
  max-width: 500px;
  overflow: hidden;
}

.google-bind-password-dialog .el-message-box__header {
  padding: 24px 24px 16px;
  background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%);
}

.google-bind-password-dialog .el-message-box__title {
  font-size: 20px;
  font-weight: 600;
  color: white;
}

.google-bind-password-dialog .el-message-box__headerbtn {
  top: 20px;
  right: 20px;
}

.google-bind-password-dialog .el-message-box__headerbtn .el-message-box__close {
  color: white;
  font-size: 18px;
}

.google-bind-password-dialog .el-message-box__headerbtn:hover .el-message-box__close {
  color: rgba(255, 255, 255, 0.8);
}

.google-bind-password-dialog .el-message-box__content {
  padding: 24px;
  background: white;
}

.google-bind-password-dialog .el-message-box__message {
  font-size: 15px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 20px;
}

.google-bind-password-dialog .el-message-box__input {
  padding-top: 0;
}

.google-bind-password-dialog .el-input__wrapper {
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  transition: all 0.3s;
}

.google-bind-password-dialog .el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #00bcd4 inset;
}

.google-bind-password-dialog .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 2px #00bcd4 inset;
}

.google-bind-password-dialog .el-input__inner {
  font-size: 15px;
  color: #303133;
}

.google-bind-password-dialog .el-input__inner::placeholder {
  color: #c0c4cc;
}

.google-bind-password-dialog .el-message-box__errormsg {
  font-size: 13px;
  color: #f56c6c;
  margin-top: 8px;
  padding-left: 4px;
}

.google-bind-password-dialog .el-message-box__btns {
  padding: 16px 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  background: white;
}

.google-bind-password-dialog .el-button {
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s;
  min-width: 100px;
}

.google-bind-password-dialog .el-button--default {
  color: #606266;
  border-color: #dcdfe6;
  background: white;
}

.google-bind-password-dialog .el-button--default:hover {
  color: #303133;
  border-color: #c0c4cc;
  background: #f5f7fa;
}

.google-bind-password-dialog .el-button--primary {
  background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%);
  border: none;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 188, 212, 0.3);
}

.google-bind-password-dialog .el-button--primary:hover {
  background: linear-gradient(135deg, #00acc1 0%, #00838f 100%);
  box-shadow: 0 4px 12px rgba(0, 188, 212, 0.4);
  transform: translateY(-1px);
}

.google-bind-password-dialog .el-button--primary:active {
  background: linear-gradient(135deg, #0097a7 0%, #006064 100%);
  transform: translateY(0);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .google-bind-password-dialog {
    max-width: 90%;
    margin: 0 auto;
  }

  .google-bind-password-dialog .el-message-box__header,
  .google-bind-password-dialog .el-message-box__content,
  .google-bind-password-dialog .el-message-box__btns {
    padding-left: 20px;
    padding-right: 20px;
  }

  .google-bind-password-dialog .el-message-box__btns {
    flex-direction: column;
  }

  .google-bind-password-dialog .el-button {
    width: 100%;
  }
}
</style>

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
