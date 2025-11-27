<template>
  <div class="login-page flex items-center justify-center min-h-screen p-4 bg-page-bg font-sans">
    <!-- 登入卡片容器 -->
    <div class="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-2xl border border-gray-100">
      <!-- 標誌與標題 -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center space-x-2 mb-4">
          <div class="w-10 h-10 rounded-lg bg-logo-brown flex items-center justify-center text-white font-bold text-xl">
            <span class="text-xs">CAPY</span>
          </div>
          <h1 class="text-3xl font-extrabold text-gray-800">CapyCourse</h1>
        </div>
        <p class="text-gray-500">歡迎回來！請輸入您的帳號資訊。</p>
      </div>

      <!-- 登入表單 -->
      <el-form 
        ref="loginFormRef" 
        :model="loginForm" 
        :rules="rules" 
        label-position="top"
        class="space-y-6"
      >
        <!-- 帳號/電子郵件輸入 -->
        <el-form-item label="電子郵件" prop="email">
          <el-input 
            v-model="loginForm.email" 
            placeholder="請輸入您的電子郵件地址"
            clearable
            size="large"
          />
        </el-form-item>

        <!-- 密碼輸入 -->
        <el-form-item label="密碼" prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password"
            placeholder="請輸入您的密碼"
            show-password
            size="large"
          />
        </el-form-item>

        <!-- 記住我 & 忘記密碼 -->
        <div class="flex justify-between items-center text-sm">
          <el-checkbox v-model="loginForm.rememberMe" label="記住我" size="large" />
          <router-link to="/ForgotPassword" class="text-primary-green hover:text-green-700 transition duration-150">
            忘記密碼？
          </router-link>
        </div>

        <!-- 登入按鈕 -->
        <el-form-item>
          <el-button 
            type="primary" 
            round 
            class="custom-dark-green h-12 text-lg mt-4 w-full" 
            @click="submitForm(loginFormRef)"
          >
            登 入
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 註冊連結 -->
      <p class="text-center text-sm mt-6 text-gray-600">
        還沒有帳號嗎？
        <router-link to="/RegisterPage" class="text-primary-green hover:text-green-700 font-medium transition duration-150">
          立即註冊
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import type { FormItemRule } from 'element-plus'

// 表單引用
const loginFormRef = ref<InstanceType<typeof ElForm> | null>(null)

// 表單資料
const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false
})

// 驗證規則（明確指定型別）
const rules: Record<string, FormItemRule[]> = {
  email: [
    { required: true, message: '請輸入電子郵件地址', trigger: 'blur' },
    { type: 'email', message: '請輸入有效的電子郵件格式', trigger: ['blur','change'] }
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 6, message: '密碼長度不能少於 6 個字元', trigger: 'blur' }
  ]
}

// 表單提交
const submitForm = async (formEl: InstanceType<typeof ElForm> | null) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      ElMessage({
        message: `登入成功！Email: ${loginForm.email}, Remember: ${loginForm.rememberMe ? '是' : '否'}`,
        type: 'success',
        duration: 3000
      })
      console.log('Form Submitted:', loginForm)
      // TODO: 登入成功後 router.push('/HomePage')
    } else {
      ElMessage({
        message: '請檢查表單中的錯誤！',
        type: 'error'
      })
      console.log('Validation Failed:', fields)
    }
  }) 
}
</script>


<style scoped>
/* Tailwind 自訂顏色 */
.bg-page-bg { background-color: #F0FFF7; }
.bg-logo-brown { background-color: #CD853F; }
.text-primary-green { color: #517C6B; }

/* 自訂 Element Plus 按鈕 */
.custom-dark-green {
  --el-button-bg-color: #517C6B;
  --el-button-hover-bg-color: #618F7D;
  --el-button-active-bg-color: #416A5A;
  --el-button-text-color: white;
  --el-button-hover-text-color: white;
  --el-button-active-text-color: white;
  border: none;
  box-shadow: 0 4px 6px -1 rgba(0, 0, 0, 0.1), 0 2px 4px -2 rgba(0, 0, 0, 0.06);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
}
</style>
