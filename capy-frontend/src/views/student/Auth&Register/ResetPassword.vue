<template>
  <div class="reset-password-container">
    <!-- 左側圖片區域 -->
    <div class="left-section">
      <div class="image-wrapper">
        <img src="/Gemini_Generated_Image_wncmt4wncmt4wncm.png" alt="學習圖片" class="side-image" />
      </div>
    </div>

    <!-- 右側表單區域 -->
    <div class="right-section">
      <div class="form-container">
        <div class="form-content">
          <h1 class="title">設定新密碼</h1>
          <p class="subtitle">請輸入您的新密碼以完成重設流程。</p>

          <div class="form-group">
            <label class="form-label">新密碼</label>
            <el-input
              v-model="newPassword"
              type="password"
              placeholder="輸入新密碼（至少 8 個字元）"
              size="large"
              show-password
              :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label class="form-label">確認密碼</label>
            <el-input
              v-model="confirmPassword"
              type="password"
              placeholder="再次輸入新密碼"
              size="large"
              show-password
              :disabled="isLoading"
              @keyup.enter="handleSubmit"
            />
          </div>

          <!-- 密碼強度提示 -->
          <div v-if="passwordStrengthMessage" class="password-hint">
            <el-icon><InfoFilled /></el-icon>
            <span>{{ passwordStrengthMessage }}</span>
          </div>

          <el-button
            type="primary"
            class="submit-button"
            :loading="isLoading"
            @click="handleSubmit"
          >
            重設密碼
          </el-button>

          <div class="back-link">
            <router-link to="/login" class="link">返回登入</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { resetPassword } from '@/api/oauth/oauth';
import { InfoFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();

// 表單狀態
const token = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);

// 密碼強度提示
const passwordStrengthMessage = computed(() => {
  if (!newPassword.value) return '';

  if (newPassword.value.length < 8) {
    return '密碼長度至少需要 8 個字元';
  }

  // 檢查密碼強度
  const hasUpperCase = /[A-Z]/.test(newPassword.value);
  const hasLowerCase = /[a-z]/.test(newPassword.value);
  const hasNumber = /[0-9]/.test(newPassword.value);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword.value);

  const strength = [hasUpperCase, hasLowerCase, hasNumber, hasSpecial].filter(Boolean).length;

  if (strength <= 1) return '密碼強度：弱（需包含大小寫字母、數字）';
  if (strength === 2) return '密碼強度：中等';
  if (strength === 3) return '密碼強度：良好';
  return '密碼強度：優秀';
});

// 驗證密碼
const validatePasswords = () => {
  if (!newPassword.value || !confirmPassword.value) {
    ElMessage.error('請填寫所有欄位');
    return false;
  }

  if (newPassword.value.length < 8) {
    ElMessage.error('密碼長度至少需要 8 個字元');
    return false;
  }

  if (newPassword.value !== confirmPassword.value) {
    ElMessage.error('兩次密碼輸入不一致');
    return false;
  }

  return true;
};

// 處理提交
const handleSubmit = async () => {
  if (!validatePasswords()) {
    return;
  }

  try {
    isLoading.value = true;
    await resetPassword({
      token: token.value,
      newPassword: newPassword.value
    });

    ElMessage.success('密碼重設成功！請使用新密碼登入。');

    // 延遲後導向登入頁面
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  } catch (error) {
    console.error('重設密碼失敗:', error);
    ElMessage.error(error.message || '重設密碼失敗，請重新申請重設連結');

    // 如果 token 無效，延遲後導向登入頁面
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } finally {
    isLoading.value = false;
  }
};

// 初始化：驗證 token
onMounted(() => {
  // 從 URL 查詢參數中提取 token
  token.value = route.query.token || '';

  // 如果沒有 token，顯示錯誤並導向登入頁面
  if (!token.value) {
    ElMessage.error('無效的重設連結，請重新申請');
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  }
});
</script>

<style scoped>
/* 外層容器 - 全螢幕並置中 */
.reset-password-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px;
}

/* 內層容器 - 固定大小 */
.reset-password-container > .left-section,
.reset-password-container > .right-section {
  height: 680px;
}

.reset-password-container > .left-section {
  width: 620px;
}

.reset-password-container > .right-section {
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

/* 密碼強度提示 */
.password-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: #f0f9ff;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 13px;
  color: #0369a1;
  animation: slideDown 0.3s ease;
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

.password-hint .el-icon {
  font-size: 16px;
  flex-shrink: 0;
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
  .reset-password-container {
    flex-direction: column;
  }

  .reset-password-container > .left-section,
  .reset-password-container > .right-section {
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
