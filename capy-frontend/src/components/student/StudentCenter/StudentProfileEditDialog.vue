<template>
  <el-dialog
    v-model="dialogVisible"
    width="600px"
    :close-on-click-modal="false"
    class="profile-edit-dialog"
  >
    <!-- Custom Header -->
    <template #header>
      <div class="dialog-header">
        <el-icon
          v-if="currentView === 'password_change'"
          class="back-icon"
          @click="handleBackToSettings"
        >
          <ArrowLeft />
        </el-icon>
        <span class="dialog-title">{{ modalTitle }}</span>
      </div>
    </template>

    <!-- View 1: Settings (Tabs) -->
    <el-tabs v-if="currentView === 'settings'" v-model="activeTab" class="profile-tabs">
      <!-- Tab 1: Profile -->
      <el-tab-pane label="個人資料" name="profile">
        <div class="tab-content">
          <!-- Avatar Section -->
          <div class="avatar-section">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :http-request="handleAvatarUpload"
              :before-upload="beforeAvatarUpload"
              :auto-upload="false"
              :on-change="handleAvatarChange"
              accept="image/*"
            >
              <div class="avatar-container">
                <img
                  v-if="previewAvatarUrl || formData.avatarUrl"
                  :src="previewAvatarUrl || formData.avatarUrl"
                  class="avatar"
                />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                <div class="avatar-overlay">
                  <el-icon class="overlay-icon"><Camera /></el-icon>
                  <span class="overlay-text">更換頭像</span>
                </div>
              </div>
            </el-upload>
            <div class="avatar-hint">點擊頭像以更換照片</div>
          </div>

          <!-- Form Section -->
          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-width="80px"
            class="profile-form"
          >
            <el-form-item label="電子郵件" prop="email">
              <el-input
                v-model="formData.email"
                disabled
                placeholder="電子郵件"
                class="disabled-email-input"
              >
                <template #prefix>
                  <el-icon><Message /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="暱稱" prop="nickname">
              <div class="input-with-icon">
                <el-input
                  v-model="formData.nickname"
                  placeholder="請輸入暱稱"
                  maxlength="20"
                  show-word-limit
                  @input="handleNicknameInput"
                  @compositionstart="handleCompositionStart"
                  @compositionend="handleCompositionEnd"
                >
                  <template #prefix>
                    <el-icon><User /></el-icon>
                  </template>
                </el-input>
                <div v-if="nicknameValidation.checking" class="input-icon-right">
                  <el-icon class="is-loading">
                    <Loading />
                  </el-icon>
                </div>
              </div>
              <div v-show="nicknameValidation.message" :class="['validation-message-inline', nicknameValidation.type]">
                {{ nicknameValidation.message }}
              </div>
              <div v-if="!nicknameValidation.message" class="nickname-format-hint">
                僅能包含中英文、數字、底線(_)、連接號(-)、句點(.)，不允許空白
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <!-- Tab 2: Security -->
      <el-tab-pane label="安全性" name="security">
        <div class="tab-content security-content">
          <!-- Third-Party Login Section -->
          <div class="security-section">
            <h3 class="section-title-student">第三方登入</h3>
            <div class="binding-item">
              <div class="binding-info">
                <div class="binding-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div class="binding-details">
                  <div class="binding-name">Google</div>
                  <div v-if="isGoogleBound" class="binding-status bound">
                    <el-icon><CircleCheck /></el-icon>
                    <span>已連結</span>
                  </div>
                  <div v-else class="binding-status unbound">
                    <el-icon><CircleClose /></el-icon>
                    <span>未連結</span>
                  </div>
                </div>
              </div>
              <div class="binding-action">
                <el-button
                  v-if="!isGoogleBound"
                  type="default"
                  plain
                  @click="handleBindGoogle"
                  :loading="bindingGoogle"
                  :disabled="bindingGoogle"
                  class="bind-button"
                >
                  {{ bindingGoogle ? '綁定中...' : '連結 Google 帳號' }}
                </el-button>
                <el-button
                  v-else
                  type="danger"
                  plain
                  @click="handleUnbindGoogle"
                  class="unbind-button"
                >
                  解除連結
                </el-button>
              </div>
            </div>
            <div class="security-hint">
              <el-icon><InfoFilled /></el-icon>
              <span>連結 Google 帳號後，您可以使用 Google 快速登入</span>
            </div>
          </div>

          <!-- Password Section -->
          <div class="security-section">
            <h3 class="section-title-student">密碼</h3>
            <div class="password-item">
              <div class="password-info">
                <el-icon class="password-icon"><Lock /></el-icon>
                <span>變更您的登入密碼</span>
              </div>
              <el-button
                type="default"
                plain
                @click="handleChangePassword"
              >
                變更密碼
              </el-button>
            </div>
          </div>

          <!-- Danger Zone Section -->
          <div class="security-section danger-zone">
            <h3 class="section-title-student danger-title">危險區域</h3>
            <div class="danger-item">
              <div class="danger-info">
                <el-icon class="danger-icon"><Delete /></el-icon>
                <div class="danger-details">
                  <div class="danger-name">刪除帳號</div>
                  <div class="danger-description">
                    永久刪除您的帳號及所有相關資料
                  </div>
                </div>
              </div>
              <el-button
                type="danger"
                plain
                @click="handleDeleteAccount"
                class="delete-account-button"
              >
                <el-icon><Delete /></el-icon>
                刪除帳號
              </el-button>
            </div>
            <div class="danger-warning">
              <el-icon><WarningFilled /></el-icon>
              <span>此操作無法復原，您將失去所有已購買課程的存取權限</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- View 2: Password Change Form -->
    <div v-else class="password-change-view">
      <StudentPasswordForm ref="passwordFormRef" />
    </div>

    <!-- Footer -->
    <template #footer>
      <!-- Settings View Footer -->
      <div v-if="currentView === 'settings' && activeTab === 'profile'" class="dialog-footer">
        <el-button @click="handleCancel" size="large" :disabled="isLoading">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="handleSave"
          :loading="isLoading"
          size="large"
          class="save-button"
        >
          儲存變更
        </el-button>
      </div>

      <!-- Password Change View Footer -->
      <div v-if="currentView === 'password_change'" class="dialog-footer">
        <el-button @click="handleBackToSettings" size="large">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="handleUpdatePassword"
          :loading="updatingPassword"
          size="large"
          class="update-password-button"
        >
          更新密碼
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed, h, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox, ElInput } from 'element-plus'

// ===== 除錯程式碼開始 =====
console.log('=== StudentProfileEditDialog 載入 ===')
// ===== 除錯程式碼結束 =====
import {
  Plus,
  Camera,
  Message,
  User,
  CircleCheck,
  CircleClose,
  InfoFilled,
  Lock,
  ArrowLeft,
  Delete,
  WarningFilled,
  Loading
} from '@element-plus/icons-vue'
import { validateNicknameFormat, createNicknameValidator, debounce } from '@/utils/usernameValidator'
import { checkNickname } from '@/api/oauth/nicknameCheck'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import StudentPasswordForm from './StudentPasswordForm.vue'
import { bindGoogleAccount } from '@/api/oauth/oauth'
import { fetchStudentProfile, updateStudentProfile, uploadStudentAvatar, changeStudentPassword, deleteStudentAccount, unlinkGoogleAccount } from '@/api/student/studentCenter.js'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  user: {
    type: Object,
    default: () => ({
      email: '',
      nickname: '',
      avatarUrl: '',
      googleLinked: false,
      google_email: null
    })
  },
  // For backward compatibility
  currentUser: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['update:visible', 'save'])

// Refs
const formRef = ref(null)
const passwordFormRef = ref(null)
const isLoading = ref(false)
const uploading = ref(false)
const updatingPassword = ref(false)
const activeTab = ref('profile')
const currentView = ref('settings') // 'settings' | 'password_change'
const deletingAccount = ref(false)
const previewAvatarUrl = ref('') // 本地預覽 URL
const pendingAvatarFile = ref(null) // 待上傳的檔案
const bindingGoogle = ref(false) // Google 綁定載入狀態
const pendingGoogleBind = ref(null) // 儲存待綁定的 Google 資訊

// 暱稱驗證狀態
const nicknameValidation = ref({
  checking: false,
  message: '',
  type: '', // 'success' | 'error' | 'warning' | 'info'
  available: null // true: 可用, false: 不可用, null: 未檢查
})

// 中文輸入法狀態
const isComposing = ref(false)

// 原始暱稱（用於比較是否有變更）
const originalNickname = ref('')

// Router and Store
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// Form Data
const formData = ref({
  email: '',
  nickname: '',
  avatarUrl: ''
})

// Computed - Use 'user' prop or fallback to 'currentUser' for backward compatibility
const currentUserData = computed(() => {
  const userData = props.user || props.currentUser || {}
  console.log('🔍 Dialog currentUserData:', userData)
  return userData
})

// Computed - Check if Google account is bound
const isGoogleBound = computed(() => {
  const result = currentUserData.value.googleLinked === true
  console.log('🔍 isGoogleBound:', result, 'googleLinked:', currentUserData.value.googleLinked)
  return result
})

// Computed - Get Google email if available
const googleEmail = computed(() => {
  const email = currentUserData.value.google_email || currentUserData.value.email || null
  console.log('🔍 googleEmail:', email)
  return email
})

// Computed - Modal Title
const modalTitle = computed(() => {
  return currentView.value === 'password_change' ? '變更密碼' : '帳號設定'
})

// Dialog Visible (v-model)
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => {
    emit('update:visible', val)
    // Reset view when closing
    if (!val) {
      currentView.value = 'settings'
      activeTab.value = 'profile'
      // 清理預覽
      cleanupPreview()
    }
  }
})

// 清理預覽資源
const cleanupPreview = () => {
  if (previewAvatarUrl.value) {
    URL.revokeObjectURL(previewAvatarUrl.value)
    previewAvatarUrl.value = ''
  }
  pendingAvatarFile.value = null
}

// 建立暱稱驗證器
const nicknameValidator = createNicknameValidator()

// 暱稱驗證函式（帶 debounce 和 API 檢查）
const validateNicknameDebounced = debounce(async (nickname) => {
  // 如果正在組字中，不執行驗證
  if (isComposing.value) {
    return
  }

  const trimmedNickname = nickname.trim()

  // 如果暱稱與原始暱稱相同，跳過驗證
  if (trimmedNickname === originalNickname.value) {
    nicknameValidation.value.message = ''
    nicknameValidation.value.type = ''
    nicknameValidation.value.checking = false
    nicknameValidation.value.available = true
    return
  }

  // 先進行前端格式驗證
  const formatValidation = validateNicknameFormat(trimmedNickname)

  // 如果格式驗證失敗，直接顯示錯誤
  if (!formatValidation.valid) {
    nicknameValidation.value.message = formatValidation.message
    nicknameValidation.value.type = formatValidation.type
    nicknameValidation.value.checking = false
    nicknameValidation.value.available = null
    return
  }

  // 格式驗證通過，開始 API 檢查
  nicknameValidation.value.checking = true
  nicknameValidation.value.message = '檢查中...'
  nicknameValidation.value.type = 'info'

  try {
    // 呼叫 API 檢查暱稱
    const result = await nicknameValidator.validate(trimmedNickname)

    // 如果返回 null，表示這是舊的請求，被新請求取代了
    if (result === null) {
      return
    }

    // 更新驗證結果
    nicknameValidation.value.message = result.message
    nicknameValidation.value.type = result.type
    nicknameValidation.value.available = result.available
    nicknameValidation.value.checking = false
  } catch (error) {
    console.error('暱稱驗證錯誤:', error)
    nicknameValidation.value.message = '暫時無法驗證暱稱，請稍後再試'
    nicknameValidation.value.type = 'warning'
    nicknameValidation.value.available = null
    nicknameValidation.value.checking = false
  }
}, 500) // 500ms debounce

// 處理暱稱輸入
const handleNicknameInput = () => {
  // 如果正在組字中，不觸發驗證
  if (isComposing.value) {
    return
  }

  const nickname = formData.value.nickname.trim()

  // 如果長度為 0，清空驗證訊息
  if (nickname.length === 0) {
    nicknameValidation.value.message = ''
    nicknameValidation.value.type = ''
    nicknameValidation.value.checking = false
    nicknameValidation.value.available = null
    return
  }

  // 觸發 debounced 驗證
  validateNicknameDebounced(formData.value.nickname)
}

// 處理中文輸入法開始組字
const handleCompositionStart = () => {
  isComposing.value = true
}

// 處理中文輸入法結束組字
const handleCompositionEnd = () => {
  isComposing.value = false
  // 組字完成後，觸發驗證
  handleNicknameInput()
}

// 暱稱格式驗證
const validateNicknameFormatRule = (rule, value, callback) => {
  if (!value) {
    return callback()
  }

  // 使用統一的格式驗證函式
  const formatValidation = validateNicknameFormat(value)
  if (!formatValidation.valid) {
    return callback(new Error(formatValidation.message))
  }

  callback()
}

// 暱稱唯一性驗證
const validateNicknameUnique = async (rule, value, callback) => {
  if (!value) {
    return callback()
  }

  // 如果暱稱沒有改變，跳過驗證
  if (value === currentUserData.value.nickname) {
    return callback()
  }

  try {
    // 呼叫 API 檢查暱稱是否可用
    const response = await checkNickname(value.trim())

    // response 已被 http.js 攔截器解包，直接是 { available: boolean }
    if (response && response.available === false) {
      return callback(new Error('此暱稱已被使用'))
    }

    callback()
  } catch (error) {
    console.error('暱稱驗證錯誤:', error)
    // 如果 API 呼叫失敗，允許通過（避免阻擋用戶）
    callback()
  }
}

// Form Validation Rules
const rules = {
  nickname: [
    { required: true, message: '請輸入暱稱', trigger: 'blur' },
    { min: 2, max: 20, message: '暱稱長度應在 2 到 20 個字元之間', trigger: 'blur' },
    { validator: validateNicknameFormatRule, trigger: 'blur' },
    { validator: validateNicknameUnique, trigger: 'blur' }
  ]
}

// Watch for dialog visibility to fetch fresh profile data
watch(
  () => props.visible,
  async (isVisible) => {
    if (isVisible) {
      try {
        // 獲取最新的個人資料
        const response = await fetchStudentProfile()

        console.log('獲取到的個人資料:', response)

        // 從 studentProfile 物件中提取資料
        const profileData = response.studentProfile || response

        // 更新 formData
        formData.value = {
          email: profileData.email || currentUserData.value.email || '',
          nickname: profileData.nickname || currentUserData.value.nickname || '',
          avatarUrl: profileData.avatarUrl || currentUserData.value.avatarUrl || currentUserData.value.avatar || ''
        }

        // 儲存原始暱稱
        originalNickname.value = formData.value.nickname

        console.log('設定後的 formData:', formData.value)

        // 同時更新 userStore 以確保資料一致（包含 googleLinked）
        if (profileData.email) {
          userStore.updateUserInfo({
            id: profileData.userId || userStore.userInfo.id,
            email: profileData.email,
            nickname: profileData.nickname,
            avatar: profileData.avatarUrl || userStore.userInfo.avatar,
            googleLinked: profileData.googleLinked ?? userStore.userInfo.googleLinked,
            google_id: profileData.googleId || userStore.userInfo.google_id,
            google_email: profileData.googleEmail || userStore.userInfo.google_email
          })
        }
      } catch (error) {
        console.error('獲取個人資料失敗:', error)
        // 如果獲取失敗，使用現有資料
        formData.value = {
          email: currentUserData.value.email || '',
          nickname: currentUserData.value.nickname || '',
          avatarUrl: currentUserData.value.avatarUrl || currentUserData.value.avatar || ''
        }
      }
      // 清理舊的預覽
      cleanupPreview()
    }
  }
)

// Watch for prop changes to update form data
watch(
  () => currentUserData.value,
  (newUser) => {
    if (newUser && !props.visible) {
      formData.value = {
        email: newUser.email || '',
        nickname: newUser.nickname || '',
        avatarUrl: newUser.avatarUrl || newUser.avatar || ''
      }
      // 清理舊的預覽
      cleanupPreview()
    }
  },
  { immediate: true, deep: true }
)

/**
 * 壓縮圖片到指定大小以下
 * @param {File} file - 原始圖片檔案
 * @param {number} maxSizeMB - 最大檔案大小（MB）
 * @param {number} maxWidth - 最大寬度
 * @param {number} maxHeight - 最大高度
 * @returns {Promise<Blob>} 壓縮後的圖片 Blob
 */
const compressImage = (file, maxSizeMB = 1, maxWidth = 1024, maxHeight = 1024) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // 計算縮放比例
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // 嘗試不同的品質設定來達到目標大小
        let quality = 0.9
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              const sizeMB = blob.size / 1024 / 1024

              if (sizeMB <= maxSizeMB || quality <= 0.1) {
                resolve(blob)
              } else {
                // 如果還是太大，降低品質再試
                quality -= 0.1
                tryCompress()
              }
            },
            file.type || 'image/jpeg',
            quality
          )
        }

        tryCompress()
      }
      img.onerror = reject
    }
    reader.onerror = reject
  })
}

// 處理頭像選擇（本地預覽 + 壓縮）
const handleAvatarChange = async (file) => {
  if (!file || !file.raw) return

  // 清理舊的預覽 URL
  cleanupPreview()

  try {
    // 壓縮圖片到 1MB 以下
    const compressedBlob = await compressImage(file.raw, 1, 1024, 1024)

    // 創建壓縮後的 File 物件
    const compressedFile = new File(
      [compressedBlob],
      file.raw.name,
      { type: file.raw.type || 'image/jpeg' }
    )

    // 創建本地預覽 URL
    previewAvatarUrl.value = URL.createObjectURL(compressedBlob)
    pendingAvatarFile.value = compressedFile

    // 顯示壓縮資訊
    const originalSizeMB = (file.raw.size / 1024 / 1024).toFixed(2)
    const compressedSizeMB = (compressedFile.size / 1024 / 1024).toFixed(2)
    console.log(`圖片已壓縮：${originalSizeMB}MB → ${compressedSizeMB}MB`)

    if (compressedFile.size < file.raw.size) {
      ElMessage.success(`圖片已壓縮至 ${compressedSizeMB}MB`)
    }
  } catch (error) {
    console.error('圖片壓縮失敗:', error)
    ElMessage.error('圖片處理失敗，請重試')
  }
}

// Avatar Upload Handler (整合到 updateStudentProfile 中)
const handleAvatarUpload = async (file) => {
  // 這個函數現在只是準備檔案，實際上傳在 handleSave 中進行
  // 因為 updateStudentProfile API 已經包含頭像上傳功能
  return file
}

// Before Avatar Upload Validation
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上傳圖片檔案！')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('圖片大小不能超過 5MB！')
    return false
  }
  return true
}

// Handle Bind Google Account - 第一階段：導向 OAuth
const handleBindGoogle = () => {
  ElMessage.info('正在跳轉至 Google 授權頁面...')

  // 標記為綁定流程（用於回調時識別）
  sessionStorage.setItem('google_bind_flow', 'true')
  sessionStorage.setItem('oauth_redirect', window.location.pathname)

  // 重導向到後端的 Google OAuth 綁定端點
  // 加上 bind=true 參數讓後端識別這是綁定流程
  window.location.href = 'http://localhost:8080/api/oauth2/authorization/google?bind=true'
}

// Handle Bind Google Account - 第二階段：密碼確認
const confirmBindWithPassword = async (googleId) => {
  try {
    // 彈出密碼輸入對話框
    const { value: password } = await ElMessageBox.prompt(
      '為了安全起見，請輸入您的帳號密碼以確認綁定 Google 帳號',
      '確認密碼',
      {
        confirmButtonText: '確認綁定',
        cancelButtonText: '取消',
        inputType: 'password',
        inputPlaceholder: '請輸入密碼',
        inputValidator: (value) => {
          if (!value) {
            return '請輸入密碼'
          }
          if (value.length < 8) {
            return '密碼長度至少 8 個字元'
          }
          return true
        },
        inputErrorMessage: '密碼格式不正確',
        customClass: 'google-bind-password-dialog',
        confirmButtonClass: 'google-bind-confirm-button'
      }
    )

    // 呼叫綁定 API
    bindingGoogle.value = true

    const response = await bindGoogleAccount({
      googleId,
      password
    })

    // http.js 攔截器已經解包 response.data，所以 response 本身就是 data
    // 檢查回應是否有效
    if (response && (response.googleLinked !== undefined || response.success)) {
      ElMessage.success('Google 帳號綁定成功！')

      // 更新使用者資訊到 store
      userStore.updateUserInfo({
        googleLinked: response.googleLinked ?? true
      })

      // 關閉對話框
      dialogVisible.value = false

      // 重新載入頁面以刷新所有資料
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } else {
      throw new Error('綁定失敗：回應格式不正確')
    }

  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消綁定')
    } else {
      console.error('Google 綁定錯誤:', error)
      const errorMessage = error.response?.data?.message || error.message || '綁定失敗，請檢查密碼是否正確'
      ElMessage.error(errorMessage)
    }
    // 清除綁定流程標記（無論成功或失敗）
    sessionStorage.removeItem('google_bind_flow')
  } finally {
    bindingGoogle.value = false
  }
}

// Handle Unbind Google Account
const handleUnbindGoogle = async () => {
  try {
    // 第一步：顯示確認對話框
    await ElMessageBox.confirm(
      '解除 Google 帳號連結後，您將無法使用 Google 快速登入。確定要繼續嗎？',
      '解除 Google 連結',
      {
        confirmButtonText: '確定解除',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'google-unbind-confirm-dialog'
      }
    )

    // 第二步：要求輸入密碼確認
    const { value: password } = await ElMessageBox.prompt(
      '為了安全起見，請輸入您的帳號密碼以確認解除 Google 帳號連結',
      '確認密碼',
      {
        confirmButtonText: '確認解除',
        cancelButtonText: '取消',
        inputType: 'password',
        inputPlaceholder: '請輸入密碼',
        inputValidator: (value) => {
          if (!value) {
            return '請輸入密碼'
          }
          if (value.length < 8) {
            return '密碼長度至少 8 個字元'
          }
          return true
        },
        inputErrorMessage: '密碼格式不正確',
        customClass: 'google-unbind-password-dialog'
      }
    )

    // 第三步：呼叫解綁定 API
    bindingGoogle.value = true

    await unlinkGoogleAccount({
      password
    })

    ElMessage.success('已成功解除 Google 帳號連結')

    // 更新使用者資訊到 store
    userStore.updateUserInfo({
      googleLinked: false,
      google_id: null,
      google_email: null
    })

    // 關閉對話框
    dialogVisible.value = false

    // 重新載入頁面以刷新所有資料
    setTimeout(() => {
      window.location.reload()
    }, 500)

  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消解除連結')
    } else {
      console.error('解除 Google 連結錯誤:', error)

      // 處理不同的錯誤狀態
      let errorMessage = '解除連結失敗，請稍後再試'

      if (error.response) {
        const status = error.response.status
        const responseData = error.response.data

        if (status === 401) {
          // 密碼錯誤或登入過期
          if (responseData?.message?.includes('password')) {
            errorMessage = '密碼錯誤，請重新輸入'
          } else {
            errorMessage = '登入已過期，請重新登入'
            // 導向登入頁
            setTimeout(() => {
              window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
            }, 1500)
          }
        } else if (status === 409) {
          // 未綁定 Google 帳號
          errorMessage = '您尚未綁定 Google 帳號'
        } else if (responseData?.message) {
          errorMessage = responseData.message
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      ElMessage.error(errorMessage)
    }
  } finally {
    bindingGoogle.value = false
  }
}

// Handle Change Password
const handleChangePassword = () => {
  currentView.value = 'password_change'
}

// Handle Back to Settings
const handleBackToSettings = () => {
  currentView.value = 'settings'
  passwordFormRef.value?.resetForm()
}

// Handle Update Password
const handleUpdatePassword = async () => {
  if (!passwordFormRef.value) return

  try {
    // Validate password form
    const isValid = await passwordFormRef.value.validate()
    if (!isValid) return

    updatingPassword.value = true

    // Get form data
    const passwordData = passwordFormRef.value.getFormData()

    // 使用新的 API 函數變更密碼
    await changeStudentPassword(passwordData)

    ElMessage.success('密碼變更成功！建議您重新登入以確保安全。')

    // Reset form and go back to settings
    passwordFormRef.value.resetForm()
    currentView.value = 'settings'

    // 關閉對話框
    dialogVisible.value = false

  } catch (error) {
    console.error('Password change error:', error)

    // 處理不同的錯誤狀態
    let errorMessage = '密碼變更失敗，請稍後再試'

    if (error.response) {
      const status = error.response.status
      const responseData = error.response.data

      if (status === 400) {
        // 根據後端錯誤訊息顯示對應提示
        const message = responseData?.message || ''

        if (message.includes('current password incorrect')) {
          errorMessage = '當前密碼錯誤，請重新輸入'
        } else if (message.includes('must be different from current password')) {
          errorMessage = '新密碼不能與當前密碼相同，請設定不同的密碼'
        } else if (message.includes('password') || message.includes('Password')) {
          // 其他密碼相關錯誤（如格式不符）
          errorMessage = responseData.message || '密碼格式不符合要求：需8-64碼，包含大小寫字母和數字，可使用特殊字元'
        } else if (responseData?.message) {
          errorMessage = responseData.message
        } else {
          errorMessage = '密碼格式不符合要求：需8-64碼，包含大小寫字母和數字，可使用特殊字元'
        }
      } else if (status === 401 || status === 403) {
        // 未登入或 Token 失效
        errorMessage = '登入已過期，請重新登入'
        // 導向登入頁
        setTimeout(() => {
          window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
        }, 1500)
      }
    } else if (error.message) {
      errorMessage = error.message
    }

    ElMessage.error(errorMessage)
  } finally {
    updatingPassword.value = false
  }
}

// Handle Cancel
const handleCancel = () => {
  dialogVisible.value = false
  // Reset form to original values
  const userData = currentUserData.value
  formData.value = {
    email: userData.email || '',
    nickname: userData.nickname || '',
    avatarUrl: userData.avatarUrl || userData.avatar || ''
  }
  formRef.value?.clearValidate()
  // Reset to profile tab and settings view
  activeTab.value = 'profile'
  currentView.value = 'settings'
  // 清理預覽
  cleanupPreview()
}

// Handle Save
const handleSave = async () => {
  if (!formRef.value) return

  try {
    // Validate form
    await formRef.value.validate()

    // 防止重複提交
    if (isLoading.value) return

    isLoading.value = true

    // 準備更新資料
    const updateData = {
      nickname: formData.value.nickname
    }

    // 如果有待上傳的頭像，先上傳取得 URL
    if (pendingAvatarFile.value) {
      try {
        ElMessage.info('正在上傳頭像...')

        // 步驟 1：上傳頭像取得 URL
        const uploadResult = await uploadStudentAvatar(pendingAvatarFile.value)

        // uploadResult 已被攔截器解包，直接是 { avatarUrl }
        if (uploadResult && uploadResult.avatarUrl) {
          updateData.avatarUrl = uploadResult.avatarUrl
          ElMessage.success('頭像上傳成功')
        } else {
          throw new Error('頭像上傳失敗：未取得 URL')
        }
      } catch (error) {
        console.error('頭像上傳錯誤:', error)
        ElMessage.error(error.message || '頭像上傳失敗，請稍後再試')
        isLoading.value = false
        return
      }
    } else if (formData.value.avatarUrl) {
      // 如果沒有新頭像但有現有的 avatarUrl，保留它
      updateData.avatarUrl = formData.value.avatarUrl
    }

    // 步驟 2：使用 JSON 格式更新 profile
    const result = await updateStudentProfile(updateData)

    // result 已經是 data 物件：{ userId, nickname, email, avatarUrl, ... }
    if (result && result.userId) {
      // 更新 userStore
      userStore.updateUserInfo({
        userId: result.userId,
        nickname: result.nickname,
        avatarUrl: result.avatarUrl,
        email: result.email,
        googleLinked: result.googleLinked
      })

      ElMessage.success('個人資料已更新')

      // 清理預覽資源
      cleanupPreview()

      // 關閉對話框
      dialogVisible.value = false

      // Emit save event for parent component with updated data
      emit('save', result)

      // 重新載入頁面以確保所有組件都更新到最新資料
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } else {
      throw new Error('更新失敗：未取得使用者資料')
    }

  } catch (error) {
    console.error('Update profile error:', error)
    ElMessage.error(error.message || '更新失敗，請稍後再試')
  } finally {
    isLoading.value = false
  }
}

// Handle Delete Account
const handleDeleteAccount = async () => {
  try {
    // 第一步：確認刪除意圖
    await ElMessageBox.confirm(
      '您確定要刪除您的帳號嗎？您將永久失去所有已購買課程的存取權限。',
      '刪除帳號？',
      {
        confirmButtonText: '下一步',
        cancelButtonText: '取消',
        type: 'error',
        customClass: 'delete-account-confirm-dialog'
      }
    )

    // 第二步：要求輸入 DELETE 確認
    const { value: deleteConfirm } = await ElMessageBox.prompt(
      '此操作無法復原。請輸入 DELETE 以確認刪除：',
      '確認刪除',
      {
        confirmButtonText: '下一步',
        cancelButtonText: '取消',
        inputPlaceholder: '輸入 DELETE',
        inputPattern: /^DELETE$/,
        inputErrorMessage: '請輸入 DELETE（全大寫）',
        customClass: 'delete-account-input-dialog'
      }
    )

    if (deleteConfirm?.trim() !== 'DELETE') {
      ElMessage.error('輸入錯誤，已取消刪除')
      return
    }

    // 第三步：要求輸入當前密碼確認
    const { value: password } = await ElMessageBox.prompt(
      '為了安全起見，請輸入您的帳號密碼以確認刪除帳號',
      '確認密碼',
      {
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
        inputType: 'password',
        inputPlaceholder: '請輸入密碼',
        inputValidator: (value) => {
          if (!value) {
            return '請輸入密碼'
          }
          if (value.length < 8) {
            return '密碼長度至少 8 個字元'
          }
          return true
        },
        inputErrorMessage: '密碼格式不正確',
        customClass: 'delete-account-password-dialog'
      }
    )

    if (!password) {
      ElMessage.error('未輸入密碼，已取消刪除')
      return
    }

    // 第四步：呼叫 API 刪除帳號
    deletingAccount.value = true

    try {
      // 使用 API 函數刪除帳號，傳入當前密碼
      await deleteStudentAccount({
        currentPassword: password
      })

      ElMessage.success('帳號已刪除')

      // Close the dialog
      dialogVisible.value = false

      // Logout and redirect to home
      await userStore.logout()

      // Redirect to home page
      await router.push('/')

    } catch (error) {
      console.error('Delete account error:', error)

      // 處理不同的錯誤狀態
      let errorMessage = '刪除帳號失敗，請稍後再試'

      if (error.response) {
        const status = error.response.status
        const responseData = error.response.data

        if (status === 401 || status === 400) {
          // 密碼錯誤
          if (responseData?.message?.includes('password')) {
            errorMessage = '密碼錯誤，請重新嘗試'
          } else {
            errorMessage = '驗證失敗，請重新登入後再試'
          }
        } else if (responseData?.message) {
          errorMessage = responseData.message
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      ElMessage.error(errorMessage)
    } finally {
      deletingAccount.value = false
    }

  } catch (error) {
    // User cancelled or closed the dialog
    if (error !== 'cancel' && error !== 'close') {
      console.error('Delete account dialog error:', error)
    }
  }
}

// 處理 OAuth 回調
onMounted(() => {
  // 🔍 診斷 log
  console.log('🔍 [StudentProfileEditDialog] onMounted 觸發')
  console.log('🔍 [StudentProfileEditDialog] dialogVisible:', dialogVisible.value)
  console.log('🔍 [StudentProfileEditDialog] google_bind_flow:', sessionStorage.getItem('google_bind_flow'))
  console.log('🔍 [StudentProfileEditDialog] route.path:', route.path)
  console.log('🔍 [StudentProfileEditDialog] route.query:', JSON.stringify(route.query))

  // 檢查是否為 Google 綁定回調（成功情況）
  // 錯誤情況由 AuthCallback.vue 統一處理
  const isBindFlow = sessionStorage.getItem('google_bind_flow')
  const { googleId } = route.query

  console.log('🔍 [StudentProfileEditDialog] isBindFlow:', isBindFlow)
  console.log('🔍 [StudentProfileEditDialog] googleId:', googleId)

  // 綁定流程：後端返回 googleId，前端需要呼叫 API 完成綁定
  if (isBindFlow === 'true' && googleId) {
    console.log('✅ [StudentProfileEditDialog] 檢測到綁定回調，準備彈出密碼對話框')

    // 清除標記
    sessionStorage.removeItem('google_bind_flow')
    sessionStorage.removeItem('oauth_redirect')

    // 清除 URL 參數（避免重新整理時重複處理）
    router.replace({
      path: route.path,
      query: {}
    })

    // 彈出密碼確認對話框並呼叫 API
    confirmBindWithPassword(googleId)
  } else {
    console.log('❌ [StudentProfileEditDialog] 未檢測到綁定流程或參數不完整')
    if (!isBindFlow) console.log('   - google_bind_flow 不存在或不為 true')
    if (!googleId) console.log('   - googleId 不存在')
  }
})

// 清理函式
onUnmounted(() => {
  // 取消所有待處理的驗證
  if (validateNicknameDebounced.cancel) {
    validateNicknameDebounced.cancel()
  }
  if (nicknameValidator.cancel) {
    nicknameValidator.cancel()
  }
})
</script>

<style scoped>
.profile-edit-dialog {
  border-radius: var(--capy-radius-lg);
}

.profile-edit-dialog :deep(.el-dialog__header) {
  padding: var(--capy-spacing-lg);
  border-bottom: 1px solid var(--capy-border-light);
}

.profile-edit-dialog :deep(.el-dialog__body) {
  padding: var(--capy-spacing-md);
}

.profile-edit-dialog :deep(.el-dialog__footer) {
  padding: var(--capy-spacing-lg);
  border-top: 1px solid var(--capy-border-light);
}

/* Tabs */
.profile-tabs {
  margin: 0;
}

.profile-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
  padding: 0 var(--capy-spacing-lg);
}

.profile-tabs :deep(.el-tabs__nav-wrap) {
  padding: 0;
}

.profile-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: var(--capy-border-light);
}

.profile-tabs :deep(.el-tabs__item) {
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-medium);
  color: var(--capy-text-secondary);
  padding: var(--capy-spacing-md) var(--capy-spacing-md);
  height: 48px;
  line-height: 48px;
}

.profile-tabs :deep(.el-tabs__item.is-active) {
  color: var(--capy-primary);
}

.profile-tabs :deep(.el-tabs__active-bar) {
  background-color: var(--capy-primary);
  height: 2px;
}

.tab-content {
  padding: var(--capy-spacing-xl) var(--capy-spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-xl);
}

/* Avatar Section */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--capy-spacing-sm);
}

.avatar-uploader {
  cursor: pointer;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: var(--capy-radius-circle);
  overflow: hidden;
  border: 3px solid var(--capy-border-light);
  transition: all var(--capy-transition-base);
}

.avatar-container:hover {
  border-color: var(--capy-primary);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-uploader-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: var(--capy-text-placeholder);
  background-color: var(--capy-bg-base);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--capy-spacing-xs);
  opacity: 0;
  transition: opacity var(--capy-transition-base);
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.overlay-icon {
  font-size: 32px;
  color: white;
}

.overlay-text {
  font-size: var(--capy-font-size-sm);
  color: white;
  font-weight: var(--capy-font-weight-medium);
}

.avatar-hint {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
  text-align: center;
}

/* Form Section */
.profile-form {
  width: 100%;
}

.profile-form :deep(.el-form-item__label) {
  font-weight: var(--capy-font-weight-medium);
  color: var(--capy-text-primary);
}

/* 改善 Email 輸入框的可讀性 */
.disabled-email-input :deep(.el-input__wrapper) {
  background-color: var(--capy-bg-base);
  cursor: not-allowed;
}

.disabled-email-input :deep(.el-input__inner) {
  color: var(--el-text-color-regular) !important;
  -webkit-text-fill-color: var(--el-text-color-regular) !important;
}

.profile-form :deep(.el-input__prefix) {
  color: var(--capy-text-secondary);
}

/* 輸入框帶 icon */
.input-with-icon {
  position: relative;
}

.input-icon-right {
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--capy-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
}

.input-icon-right .is-loading {
  animation: rotating 1.5s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 驗證訊息 */
.validation-message-inline {
  margin-top: 8px;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  animation: slideDown 0.3s ease;
  display: flex;
  align-items: center;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.validation-message-inline.success {
  color: var(--el-color-success);
  background: var(--el-color-success-light-9);
}

.validation-message-inline.error {
  color: var(--capy-danger);
  background: var(--el-color-danger-light-9);
}

.validation-message-inline.warning {
  color: var(--el-color-warning);
  background: var(--el-color-warning-light-9);
}

.validation-message-inline.info {
  color: var(--capy-primary);
  background: var(--el-color-primary-light-9);
}

/* 暱稱格式提示 */
.nickname-format-hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--capy-text-secondary);
  padding: 6px 12px;
  background: var(--capy-bg-base);
  border-radius: var(--capy-radius-sm);
  line-height: 1.4;
}

/* Footer */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--capy-spacing-sm);
}

.save-button {
  background-color: var(--capy-primary);
  border-color: var(--capy-primary);
}

.save-button:hover {
  background-color: var(--el-color-primary-light-1);
  border-color: var(--el-color-primary-light-1);
}

.save-button:active {
  background-color: var(--el-color-primary-dark-1);
  border-color: var(--el-color-primary-dark-1);
}

/* Security Tab */
.security-content {
  gap: var(--capy-spacing-2xl);
}

.security-section {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-md);
}

.section-title-student {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  margin: 0;
  padding-bottom: var(--capy-spacing-sm);
  border-bottom: 1px solid var(--capy-border-light);
}

/* Binding Item */
.binding-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--capy-spacing-lg);
  background-color: var(--capy-bg-base);
  border-radius: var(--capy-radius-md);
  border: 1px solid var(--capy-border-light);
}

.binding-info {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-md);
}

.binding-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: var(--capy-radius-md);
  border: 1px solid var(--capy-border-light);
}

.binding-details {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-xs);
}

.binding-name {
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
}

.binding-status {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-xs);
  font-size: var(--capy-font-size-sm);
}

.binding-status.bound {
  color: var(--el-color-success);
}

.binding-status.unbound {
  color: var(--capy-text-secondary);
}

.binding-email {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
}

.binding-action .bind-button {
  color: var(--capy-primary);
  border-color: var(--capy-primary);
}

.binding-action .bind-button:hover {
  background-color: var(--capy-primary);
  color: white;
}

.binding-action .unbind-button {
  color: var(--capy-danger);
  border-color: var(--capy-danger);
}

.binding-action .unbind-button:hover {
  background-color: var(--capy-danger);
  color: white;
}

.security-hint {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-xs);
  padding: var(--capy-spacing-sm) var(--capy-spacing-md);
  background-color: var(--el-color-info-light-9);
  border-radius: var(--capy-radius-sm);
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
}

.security-hint .el-icon {
  color: var(--el-color-info);
}

/* Password Item */
.password-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--capy-spacing-lg);
  background-color: var(--capy-bg-base);
  border-radius: var(--capy-radius-md);
  border: 1px solid var(--capy-border-light);
}

.password-info {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-sm);
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-primary);
}

.password-icon {
  font-size: 20px;
  color: var(--capy-text-secondary);
}

/* Custom Header */
.dialog-header {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-md);
}

.back-icon {
  font-size: 20px;
  color: var(--capy-text-secondary);
  cursor: pointer;
  transition: color var(--capy-transition-base);
}

.back-icon:hover {
  color: var(--capy-primary);
}

.dialog-title {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
}

/* Password Change View */
.password-change-view {
  padding: var(--capy-spacing-lg) var(--capy-spacing-md);
  min-height: 400px;
}

.update-password-button {
  background-color: var(--capy-primary);
  border-color: var(--capy-primary);
}

.update-password-button:hover {
  background-color: var(--el-color-primary-light-1);
  border-color: var(--el-color-primary-light-1);
}

.update-password-button:active {
  background-color: var(--el-color-primary-dark-1);
  border-color: var(--el-color-primary-dark-1);
}
/* Danger Zone Section */
.danger-zone {
  margin-top: var(--capy-spacing-xl);
  padding-top: var(--capy-spacing-xl);
  border-top: 2px solid var(--capy-danger);
}

.danger-title {
  color: var(--capy-danger);
  border-bottom-color: var(--capy-danger);
}

.danger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--capy-spacing-lg);
  background-color: #FEF0F0;
  border-radius: var(--capy-radius-md);
  border: 1px solid #FBC4C4;
}

.danger-info {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-md);
}

.danger-icon {
  font-size: 24px;
  color: var(--capy-danger);
}

.danger-details {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-xs);
}

.danger-name {
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-danger);
}

.danger-description {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
}

.delete-account-button {
  color: var(--capy-danger);
  border-color: var(--capy-danger);
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-xs);
}

.delete-account-button:hover {
  background-color: var(--capy-danger);
  color: white;
}

.delete-account-button:active {
  background-color: #F56C6C;
  border-color: #F56C6C;
}

.danger-warning {
  display: flex;
  align-items: flex-start;
  gap: var(--capy-spacing-xs);
  padding: var(--capy-spacing-sm) var(--capy-spacing-md);
  background-color: #FEF0F0;
  border-radius: var(--capy-radius-sm);
  border: 1px solid #FBC4C4;
  font-size: var(--capy-font-size-sm);
  color: var(--capy-danger);
  line-height: 1.5;
}

.danger-warning .el-icon {
  color: var(--capy-danger);
  font-size: 16px;
  margin-top: 2px;
  flex-shrink: 0;
}


/* Responsive */
@media (max-width: 768px) {
  .profile-edit-dialog {
    width: 90% !important;
  }

  .avatar-container {
    width: 100px;
    height: 100px;
  }

  .overlay-icon {
    font-size: 24px;
  }

  .overlay-text {
    font-size: var(--capy-font-size-xs);
  }

  .binding-item,
  .password-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--capy-spacing-md);
  }

  .binding-action,
  .password-item > .el-button {
    width: 100%;
  .danger-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--capy-spacing-md);
  }

  .delete-account-button {
    width: 100%;
  }
  }
}
</style>

<style>
/* Delete Account Confirm Dialog - 第一步確認 */
.delete-account-confirm-dialog {
  max-width: 420px;
  min-width: 380px;
}

.delete-account-confirm-dialog .el-message-box__header {
  padding: var(--capy-spacing-xl) var(--capy-spacing-xl) var(--capy-spacing-md);
}

.delete-account-confirm-dialog .el-message-box__title {
  font-size: 20px;
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-danger);
}

.delete-account-confirm-dialog .el-message-box__content {
  padding: var(--capy-spacing-xl) var(--capy-spacing-xl);
}

.delete-account-confirm-dialog .el-message-box__message {
  font-size: 16px;
  line-height: 1.8;
  color: var(--capy-text-primary);
}

.delete-account-confirm-dialog .el-message-box__btns {
  padding: var(--capy-spacing-lg) var(--capy-spacing-xl) var(--capy-spacing-xl);
  gap: 12px;
  display: flex;
  justify-content: flex-end;
}

.delete-account-confirm-dialog .el-message-box__btns .el-button {
  padding: 10px 24px;
  font-size: var(--capy-font-size-base);
  min-width: 100px;
  border-radius: var(--capy-radius-base);
  font-weight: var(--capy-font-weight-medium);
}

.delete-account-confirm-dialog .el-message-box__btns .el-button--primary {
  background-color: var(--capy-danger) !important;
  border-color: var(--capy-danger) !important;
  color: white !important;
  transition: all var(--capy-transition-fast);
}

.delete-account-confirm-dialog .el-message-box__btns .el-button--primary:hover {
  background-color: var(--el-color-danger-light-3) !important;
  border-color: var(--el-color-danger-light-3) !important;
  box-shadow: var(--capy-shadow-sm);
}

.delete-account-confirm-dialog .el-message-box__btns .el-button--primary:active {
  background-color: var(--el-color-danger-dark-2) !important;
  border-color: var(--el-color-danger-dark-2) !important;
  transform: translateY(1px);
}

/* Delete Account Input Dialog - 第二步輸入 DELETE */
.delete-account-input-dialog {
  max-width: 420px;
  min-width: 380px;
  --el-color-primary: var(--capy-danger);
}

.delete-account-input-dialog .el-input {
  --el-input-focus-border-color: var(--capy-danger);
}

.delete-account-input-dialog .el-message-box__header {
  padding: var(--capy-spacing-lg) var(--capy-spacing-lg) var(--capy-spacing-sm);
}

.delete-account-input-dialog .el-message-box__title {
  font-size: 18px;
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-danger);
}

.delete-account-input-dialog .el-message-box__content {
  padding: var(--capy-spacing-lg) var(--capy-spacing-lg);
}

.delete-account-input-dialog .el-message-box__message {
  font-size: 14px;
  line-height: 1.6;
  color: var(--capy-text-primary);
  margin-bottom: var(--capy-spacing-sm);
}

.delete-account-input-dialog .el-message-box__input {
  margin-top: var(--capy-spacing-xs);
}

.delete-account-input-dialog .el-input__inner {
  font-family: monospace;
  font-size: var(--capy-font-size-base);
  text-transform: uppercase;
}

.delete-account-input-dialog .el-message-box__btns {
  padding: var(--capy-spacing-md) var(--capy-spacing-lg) var(--capy-spacing-lg);
  gap: 12px;
  display: flex;
  justify-content: flex-end;
}

.delete-account-input-dialog .el-message-box__btns .el-button {
  padding: 10px 24px;
  font-size: 14px;
  min-width: 100px;
}

.delete-account-input-dialog .el-message-box__btns .el-button--primary {
  background-color: var(--capy-danger) !important;
  border-color: var(--capy-danger) !important;
  color: var(--capy-text-inverse) !important;
  font-weight: 500;
}

.delete-account-input-dialog .el-message-box__btns .el-button--primary:hover {
  background-color: var(--el-color-danger-light-3) !important;
  border-color: var(--el-color-danger-light-3) !important;
}

.delete-account-input-dialog .el-message-box__btns .el-button--primary:active {
  background-color: var(--el-color-danger-dark-2) !important;
  border-color: var(--el-color-danger-dark-2) !important;
}

.delete-account-input-dialog .el-message-box__errormsg {
  color: var(--capy-danger);
  font-size: var(--capy-font-size-sm);
  margin-top: var(--capy-spacing-xs);
}

/* Delete Account Password Dialog - 第三步輸入密碼 */
.delete-account-password-dialog {
  max-width: 420px;
  min-width: 380px;
  --el-color-primary: var(--capy-danger);
}

.delete-account-password-dialog .el-input {
  --el-input-focus-border-color: var(--capy-danger);
}

.delete-account-password-dialog .el-message-box__header {
  padding: var(--capy-spacing-lg) var(--capy-spacing-lg) var(--capy-spacing-sm);
}

.delete-account-password-dialog .el-message-box__title {
  font-size: 18px;
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-danger);
}

.delete-account-password-dialog .el-message-box__content {
  padding: var(--capy-spacing-lg) var(--capy-spacing-lg);
}

.delete-account-password-dialog .el-message-box__message {
  font-size: 14px;
  line-height: 1.6;
  color: var(--capy-text-primary);
  margin-bottom: var(--capy-spacing-sm);
}

.delete-account-password-dialog .el-message-box__input {
  margin-top: var(--capy-spacing-xs);
}

.delete-account-password-dialog .el-message-box__btns {
  padding: var(--capy-spacing-md) var(--capy-spacing-lg) var(--capy-spacing-lg);
  gap: 12px;
  display: flex;
  justify-content: flex-end;
}

.delete-account-password-dialog .el-message-box__btns .el-button {
  padding: 10px 24px;
  font-size: 14px;
  min-width: 100px;
}

.delete-account-password-dialog .el-message-box__btns .el-button--primary {
  background-color: var(--capy-danger) !important;
  border-color: var(--capy-danger) !important;
  color: var(--capy-text-inverse) !important;
  font-weight: 500;
}

.delete-account-password-dialog .el-message-box__btns .el-button--primary:hover {
  background-color: var(--el-color-danger-light-3) !important;
  border-color: var(--el-color-danger-light-3) !important;
}

.delete-account-password-dialog .el-message-box__btns .el-button--primary:active {
  background-color: var(--el-color-danger-dark-2) !important;
  border-color: var(--el-color-danger-dark-2) !important;
}

.delete-account-password-dialog .el-message-box__errormsg {
  color: var(--capy-danger);
  font-size: var(--capy-font-size-sm);
  margin-top: var(--capy-spacing-xs);
}

/* Google Bind Password Prompt Styles */
.google-bind-password-prompt {
  border-radius: var(--capy-radius-lg);
  max-width: 450px;
}

.google-bind-password-prompt .el-message-box__header {
  padding: var(--capy-spacing-lg);
  border-bottom: 1px solid var(--capy-border-light);
}

.google-bind-password-prompt .el-message-box__title {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
}

.google-bind-password-prompt .el-message-box__content {
  padding: var(--capy-spacing-xl) var(--capy-spacing-lg);
}

.google-bind-password-prompt .el-message-box__message {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--capy-spacing-lg);
}

.google-bind-password-prompt .el-message-box__input {
  padding-top: var(--capy-spacing-md);
}

.google-bind-password-prompt .el-input__wrapper {
  padding: var(--capy-spacing-sm) var(--capy-spacing-md);
  border-radius: var(--capy-radius-sm);
  box-shadow: 0 0 0 1px var(--capy-border-base) inset;
  transition: all var(--capy-transition-base);
}

.google-bind-password-prompt .el-input__wrapper:hover {
  box-shadow: 0 0 0 1px var(--capy-primary) inset;
}

.google-bind-password-prompt .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 2px var(--capy-primary) inset;
}

.google-bind-password-prompt .el-input__inner {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-primary);
}

.google-bind-password-prompt .el-input__inner::placeholder {
  color: var(--capy-text-placeholder);
}

.google-bind-password-prompt .el-message-box__errormsg {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-danger);
  margin-top: var(--capy-spacing-xs);
  padding-left: var(--capy-spacing-xs);
}

.google-bind-password-prompt .el-message-box__btns {
  padding: var(--capy-spacing-md) var(--capy-spacing-lg);
  border-top: 1px solid var(--capy-border-light);
  display: flex;
  gap: var(--capy-spacing-sm);
  justify-content: flex-end;
}

.google-bind-password-prompt .el-button {
  padding: var(--capy-spacing-sm) var(--capy-spacing-lg);
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-medium);
  border-radius: var(--capy-radius-sm);
  transition: all var(--capy-transition-base);
}

.google-bind-password-prompt .el-button--default {
  color: var(--capy-text-secondary);
  border-color: var(--capy-border-base);
}

.google-bind-password-prompt .el-button--default:hover {
  color: var(--capy-text-primary);
  border-color: var(--capy-border-dark);
  background-color: var(--capy-bg-base);
}

.google-bind-password-prompt .el-button--primary {
  background-color: var(--capy-primary);
  border-color: var(--capy-primary);
  color: white;
}

.google-bind-password-prompt .el-button--primary:hover {
  background-color: var(--el-color-primary-light-1);
  border-color: var(--el-color-primary-light-1);
}

.google-bind-password-prompt .el-button--primary:active {
  background-color: var(--el-color-primary-dark-1);
  border-color: var(--el-color-primary-dark-1);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .google-bind-password-prompt {
    max-width: 90%;
    margin: 0 auto;
  }

  .google-bind-password-prompt .el-message-box__header,
  .google-bind-password-prompt .el-message-box__content,
  .google-bind-password-prompt .el-message-box__btns {
    padding-left: var(--capy-spacing-md);
    padding-right: var(--capy-spacing-md);
  }

  .google-bind-password-prompt .el-message-box__btns {
    flex-direction: column;
  }

  .google-bind-password-prompt .el-button {
    width: 100%;
  }
}

/* Google Unbind Confirm Dialog - 使用主色 */
.google-unbind-confirm-dialog {
  max-width: 420px;
  min-width: 380px;

}

.google-unbind-confirm-dialog .el-message-box__header {
  padding: var(--capy-spacing-xl) var(--capy-spacing-xl) var(--capy-spacing-md);
}

.google-unbind-confirm-dialog .el-message-box__title {
  font-size: 20px;
  font-weight: var(--capy-font-weight-semibold);
}

.google-unbind-confirm-dialog .el-message-box__content {
  padding: var(--capy-spacing-xl) var(--capy-spacing-xl);
}

.google-unbind-confirm-dialog .el-message-box__message {
  font-size: 16px;
  line-height: 1.8;
  color: var(--capy-text-primary);
}

/* Dialog 底部按鈕區塊 */
.google-unbind-confirm-dialog .el-message-box__btns {
  padding: var(--capy-spacing-lg) var(--capy-spacing-xl) var(--capy-spacing-xl);
  gap: 12px; /* 使用具體數值或 var(--capy-spacing-md) */
  display: flex;
  justify-content: flex-end; /* 確保按鈕靠右，符合一般對話框習慣 */
}

.google-unbind-confirm-dialog .el-message-box__btns .el-button {
  padding: 10px 24px; /* 稍微縮小一點 Padding，讓比例更協調 */
  font-size: var(--capy-font-size-base); /* 14px，保持系統一致 */
  min-width: 100px;
  border-radius: var(--capy-radius-base); /* 確保圓角一致 */
  font-weight: var(--capy-font-weight-medium); /* 500 */
}

.google-unbind-confirm-dialog .el-message-box__btns .el-button--primary {
  /* 這裡雖是 primary class，但我們視覺上把它變成 Danger */
  background-color: var(--capy-danger) !important;
  border-color: var(--capy-danger) !important;
  color: white !important;
  transition: all var(--capy-transition-fast); /* 加入過渡動畫 */
}

.google-unbind-confirm-dialog .el-message-box__btns .el-button--primary:hover {
  background-color: var(--el-color-danger-light-3) !important;
  border-color: var(--el-color-danger-light-3) !important;
  box-shadow: var(--capy-shadow-sm); /* 增加一點點懸浮感 */
}

.google-unbind-confirm-dialog .el-message-box__btns .el-button--primary:active {
  background-color: var(--el-color-danger-dark-2) !important;
  border-color: var(--el-color-danger-dark-2) !important;
  transform: translateY(1px); /* 增加按壓感 */
}

/* Google Unbind Password Dialog - 使用主色 */
.google-unbind-password-dialog {
  max-width: 420px;
  min-width: 380px;
  --el-color-primary: var(--capy-danger); /* 💡 關鍵技巧：局部覆寫變數 */
}

/* 讓 Input 框 Focus 時也變成紅色，與按鈕呼應 */
.google-unbind-password-dialog .el-input {
  --el-input-focus-border-color: var(--capy-danger);
}

.google-unbind-password-dialog .el-message-box__header {
  padding: var(--capy-spacing-lg) var(--capy-spacing-lg) var(--capy-spacing-sm);
}

.google-unbind-password-dialog .el-message-box__title {
  font-size: 18px;
  font-weight: var(--capy-font-weight-semibold);
}

.google-unbind-password-dialog .el-message-box__content {
  padding: var(--capy-spacing-lg) var(--capy-spacing-lg);
}

.google-unbind-password-dialog .el-message-box__message {
  font-size: 14px;
  line-height: 1.6;
  color: var(--capy-text-primary);
  margin-bottom: var(--capy-spacing-sm);
}

.google-unbind-password-dialog .el-message-box__input {
  margin-top: var(--capy-spacing-xs);
}

.google-unbind-password-dialog .el-message-box__btns {
 padding: var(--capy-spacing-md) var(--capy-spacing-lg) var(--capy-spacing-lg);
  gap: 12px;
  display: flex;
  justify-content: flex-end; /* 確保按鈕靠右 */
}

.google-unbind-password-dialog .el-message-box__btns .el-button {
  padding: 10px 24px;
  font-size: 14px;
  min-width: 100px;
}

.google-unbind-password-dialog .el-message-box__btns .el-button--primary {
  background-color: var(--capy-danger) !important; /* #F56C6C */
  border-color: var(--capy-danger) !important;
  color: var(--capy-text-inverse) !important;
  font-weight: 500;
}

.google-unbind-password-dialog .el-message-box__btns .el-button--primary:hover {
  background-color: var(--el-color-danger-light-3) !important;
  border-color: var(--el-color-danger-light-3) !important;
}

.google-unbind-password-dialog .el-message-box__btns .el-button--primary:active {
  background-color: var(--el-color-danger-dark-2) !important;
  border-color: var(--el-color-danger-dark-2) !important;
}
</style>


/* Google Bind Password Dialog */
.google-bind-password-dialog {
  border-radius: var(--capy-radius-lg);
  max-width: 500px;
}

.google-bind-password-dialog .el-message-box__header {
  padding: var(--capy-spacing-lg);
  border-bottom: 1px solid var(--capy-border-light);
}

.google-bind-password-dialog .el-message-box__title {
  font-size: var(--capy-font-size-xl);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
}

.google-bind-password-dialog .el-message-box__content {
  padding: var(--capy-spacing-lg);
}

.google-bind-password-dialog .el-message-box__message {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--capy-spacing-md);
}

.google-bind-password-dialog .el-message-box__input {
  margin-top: var(--capy-spacing-md);
}

.google-bind-password-dialog .el-input__wrapper {
  border-radius: var(--capy-radius-sm);
  box-shadow: 0 0 0 1px var(--capy-border-base) inset;
  transition: all var(--capy-transition-base);
}

.google-bind-password-dialog .el-input__wrapper:hover {
  box-shadow: 0 0 0 1px var(--capy-primary) inset;
}

.google-bind-password-dialog .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 2px var(--capy-primary) inset;
}

.google-bind-password-dialog .el-message-box__btns {
  padding: var(--capy-spacing-md) var(--capy-spacing-lg);
  border-top: 1px solid var(--capy-border-light);
}

.google-bind-password-dialog .el-button {
  border-radius: var(--capy-radius-sm);
  padding: 10px 20px;
  font-weight: var(--capy-font-weight-medium);
}

.google-bind-password-dialog .el-button--default {
  color: var(--capy-text-secondary);
  border-color: var(--capy-border-base);
}

.google-bind-password-dialog .el-button--default:hover {
  color: var(--capy-text-primary);
  border-color: var(--capy-primary);
  background-color: var(--el-color-primary-light-9);
}

.google-bind-password-dialog .el-button--primary {
  background-color: var(--capy-primary);
  border-color: var(--capy-primary);
  color: white;
}

.google-bind-password-dialog .el-button--primary:hover {
  background-color: var(--el-color-primary-light-1);
  border-color: var(--el-color-primary-light-1);
}

.google-bind-password-dialog .el-button--primary:active {
  background-color: var(--el-color-primary-dark-1);
  border-color: var(--el-color-primary-dark-1);
}

.google-bind-password-dialog .el-message-box__errormsg {
  color: var(--capy-danger);
  font-size: var(--capy-font-size-sm);
  margin-top: var(--capy-spacing-xs);
}
