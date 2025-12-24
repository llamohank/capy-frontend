<template>
  <div class="forgot-password-container">
    <!-- 左側圖片區域 -->
    <div class="left-section">
      <div class="image-wrapper">
        <img src="/Gemini_Generated_Image_wncmt4wncmt4wncm.png" alt="學習圖片" class="side-image" />
      </div>
    </div>

    <!-- 右側表單區域 -->
    <div class="right-section">
      <div class="form-container">
        <!-- 初始狀態：顯示表單 -->
        <div v-if="!isSuccess" class="form-content">
          <h1 class="title">重設密碼</h1>
          <p class="subtitle">輸入您的電子郵件地址，我們將寄送重設密碼的連結給您。</p>

          <div class="form-group">
            <label class="form-label">電子郵件</label>
            <el-input
              v-model="email"
              type="email"
              placeholder="輸入您的電子郵件"
              size="large"
              :disabled="isLoading"
            />
          </div>

          <el-button
            class="submit-button"
            :loading="isLoading"
            @click="handleSubmit"
          >
            發送重設連結
          </el-button>

          <div class="back-link">
            <router-link to="/login" class="link">返回登入</router-link>
          </div>
        </div>

        <!-- 成功狀態：顯示成功訊息 -->
        <div v-else class="success-content">
          <div class="success-icon">
            <el-icon :size="80" color="var(--capy-success)">
              <CircleCheckFilled />
            </el-icon>
          </div>
          <h2 class="success-title">檢查您的電子郵件！</h2>
          <p class="success-message">
            我們已將重設密碼的連結發送至 <strong>{{ email }}</strong>
          </p>
          <el-button
            class="back-button"
            @click="goToLogin"
          >
            返回登入
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { CircleCheckFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { forgotPassword } from '@/api/oauth/oauth';

const router = useRouter();

// 表單狀態
const email = ref('');
const isLoading = ref(false);
const isSuccess = ref(false);

// 處理提交
const handleSubmit = async () => {
  // 驗證電子郵件
  if (!email.value) {
    ElMessage.error('請輸入電子郵件');
    return;
  }

  // 簡單的電子郵件格式驗證
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    ElMessage.error('請輸入有效的電子郵件地址');
    return;
  }

  try {
    isLoading.value = true;
    await forgotPassword(email.value);
    isSuccess.value = true;
  } catch (error) {
    console.error('發送重設密碼郵件失敗:', error);
    
    // 根據錯誤類型顯示不同訊息
    if (error.response) {
      const status = error.response.status
      let errorMsg = '發送失敗，請稍後再試'

      switch (status) {
        case 404:
          errorMsg = '找不到此電子郵件地址，請確認您輸入的信箱'
          break
        case 429:
          errorMsg = '請求次數過多，請稍後再試'
          break
        case 500:
          errorMsg = '系統忙碌中，請稍後再試'
          break
        default:
          errorMsg = error.response.data?.message || '發送失敗，請稍後再試'
      }
      ElMessage.error(errorMsg)
    } else if (error.message) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('發送失敗，請稍後再試')
    }
  } finally {
    isLoading.value = false;
  }
};

// 返回登入頁面
const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
/* 外層容器 - 全螢幕並置中 */
.forgot-password-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px;
}

/* 內層容器 - 固定大小 */
.forgot-password-container > .left-section,
.forgot-password-container > .right-section {
  height: 680px;
}

.forgot-password-container > .left-section {
  width: 620px;
}

.forgot-password-container > .right-section {
  width: 520px;
}

/* 左側圖片區域 */
.left-section {
  background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border-radius: 20px 0 0 20px;
  box-shadow: -5px 0 20px rgba(0, 0, 0, 0.05);
}

.image-wrapper {
  max-width: 500px;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  height: auto;
}

.side-image {
  width: 100%;
  height: 650px;
  display: block;
  object-fit: cover;
}

/* 右側表單區域 */
.right-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: white;
  border-radius: 0 20px 20px 0;
  box-shadow: 5px 0 20px rgba(0, 0, 0, 0.05);
}

.form-container {
  width: 100%;
  max-width: 370px;
}

/* 表單內容 */
.form-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
  text-align: center;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
  text-align: center;
  line-height: 1.6;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

/* 提交按鈕 */
.submit-button {
  height: 50px;
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: var(--capy-primary);
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.submit-button:hover {
  background: var(--el-color-primary-dark-2);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(var(--capy-primary-rgb), 0.3);
}

/* 返回連結 */
.back-link {
  text-align: center;
}

.link {
  color: #666;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link:hover {
  color: var(--capy-primary);
}

/* 成功狀態 */
.success-content {
  text-align: center;
  animation: fadeIn 0.5s ease;
}

.success-icon {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.success-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.success-message {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 32px;
}

.success-message strong {
  color: var(--capy-primary);
  font-weight: 600;
}

.back-button {
  height: 45px;
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: var(--capy-primary);
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: var(--el-color-primary-dark-2);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(var(--capy-primary-rgb), 0.3);
}

/* Element Plus 覆寫 */
:deep(.el-input__wrapper) {
  padding: 12px 14px;
  border-radius: 10px;
  background: #f8f9fa;
  box-shadow: 0 0 0 2px #e5e5e5 inset;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  background: white;
}

:deep(.el-input__wrapper.is-focus) {
  background: white;
  box-shadow: 0 0 0 2px var(--capy-primary) inset;
}

:deep(.el-input__inner) {
  font-size: 14px;
  color: #1a1a1a;
}

:deep(.el-input__inner::placeholder) {
  color: #999;
}

/* 響應式設計 */
@media (max-width: 968px) {
  .forgot-password-container {
    flex-direction: column;
  }

  .forgot-password-container > .left-section,
  .forgot-password-container > .right-section {
    width: 100%;
    height: auto;
  }

  .left-section {
    min-height: 300px;
    border-radius: 20px 20px 0 0;
  }

  .right-section {
    border-radius: 0 0 20px 20px;
    padding: 40px 20px;
  }

  .side-image {
    height: 300px;
  }
}
</style>
