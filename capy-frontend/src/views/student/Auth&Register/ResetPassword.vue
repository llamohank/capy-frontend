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
              placeholder="輸入新密碼"
              size="large"
              show-password
              :disabled="isLoading"
            />
            <!-- 密碼要求說明 -->
            <div class="password-requirements">
              <div class="requirement-item" :class="{ 'met': passwordRequirements.length }">
                <el-icon><Check v-if="passwordRequirements.length" /><Close v-else /></el-icon>
                <span>至少 8 個字元</span>
              </div>
              <div class="requirement-item" :class="{ 'met': passwordRequirements.uppercase }">
                <el-icon><Check v-if="passwordRequirements.uppercase" /><Close v-else /></el-icon>
                <span>包含大寫字母 (A-Z)</span>
              </div>
              <div class="requirement-item" :class="{ 'met': passwordRequirements.lowercase }">
                <el-icon><Check v-if="passwordRequirements.lowercase" /><Close v-else /></el-icon>
                <span>包含小寫字母 (a-z)</span>
              </div>
              <div class="requirement-item" :class="{ 'met': passwordRequirements.number }">
                <el-icon><Check v-if="passwordRequirements.number" /><Close v-else /></el-icon>
                <span>包含數字 (0-9)</span>
              </div>
              <div class="requirement-item" :class="{ 'met': passwordRequirements.special }">
                <el-icon><Check v-if="passwordRequirements.special" /><Close v-else /></el-icon>
                <span>包含特殊符號</span>
              </div>
            </div>
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
          <div v-if="passwordStrengthMessage"
               :class="['password-hint', passwordHintClass]">
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
import { Check, Close } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();

// 表單狀態
const token = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);

// 密碼要求檢查
const passwordRequirements = computed(() => ({
  length: newPassword.value.length >= 8,
  uppercase: /[A-Z]/.test(newPassword.value),
  lowercase: /[a-z]/.test(newPassword.value),
  number: /[0-9]/.test(newPassword.value),
  special: /[!@#$%^&*()_+\-={}[\]:;"'<>,.?/]/.test(newPassword.value)
}));

// 密碼強度提示和驗證
const passwordStrengthMessage = computed(() => {
  if (!newPassword.value) return '';

  if (newPassword.value.length < 8) {
    return '❌ 密碼長度至少需要 8 個字元';
  }

  // 檢查密碼強度
  const hasUpperCase = /[A-Z]/.test(newPassword.value);
  const hasLowerCase = /[a-z]/.test(newPassword.value);
  const hasNumber = /[0-9]/.test(newPassword.value);
  const hasSpecial = /[!@#$%^&*()_+\-={}[\]:;"'<>,.?/]/.test(newPassword.value);

  // 必須包含大小寫字母、數字和特殊符號
  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecial) {
    const missing = [];
    if (!hasUpperCase) missing.push('大寫字母');
    if (!hasLowerCase) missing.push('小寫字母');
    if (!hasNumber) missing.push('數字');
    if (!hasSpecial) missing.push('特殊符號');
    return `❌ 密碼必須包含${missing.join('、')}`;
  }

  return '✓ 密碼強度：優秀';
});

// 檢查密碼是否符合要求
const isPasswordValid = computed(() => {
  if (!newPassword.value || newPassword.value.length < 8) return false;

  const hasUpperCase = /[A-Z]/.test(newPassword.value);
  const hasLowerCase = /[a-z]/.test(newPassword.value);
  const hasNumber = /[0-9]/.test(newPassword.value);
  const hasSpecial = /[!@#$%^&*()_+\-={}[\]:;"'<>,.?/]/.test(newPassword.value);

  return hasUpperCase && hasLowerCase && hasNumber && hasSpecial;
});

// 密碼提示的樣式 class
const passwordHintClass = computed(() => {
  const message = passwordStrengthMessage.value;
  if (message.startsWith('❌')) return 'hint-error';
  if (message.startsWith('✓')) return 'hint-success';
  return 'hint-info';
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

  // 檢查密碼是否符合強制要求
  if (!isPasswordValid.value) {
    ElMessage.error('密碼必須包含大寫字母、小寫字母、數字和特殊符號');
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
  display: flex;
  flex-direction: column;
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
  margin-bottom: 24px;
  text-align: center;
  line-height: 1.6;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 6px;
}

/* 密碼要求說明 */
.password-requirements {
  margin-top: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.requirement-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
  transition: all 0.3s ease;
}

.password-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  min-height: auto;
  animation: slideDown 0.3s ease;
  transition: all 0.3s ease;
}

.password-hint.hint-error {
  background: #fee2e2;
  color: #dc2626;
}

.password-hint.hint-success {
  background: #dcfce7;
  color: #16a34a;
}

.password-hint.hint-info {
  background: #dbeafe;
  color: #2563eb;
}

.requirement-item.optional {
  color: #999;
  font-size: 12px;
}

.requirement-item .el-icon {
  font-size: 14px;
  color: #d1d5db;
  flex-shrink: 0;
}

.requirement-item.met {
  color: #10b981;
}

.requirement-item.met .el-icon {
  color: #10b981;
}

.requirement-item.optional.met {
  color: #10b981;
}

/* 提交按鈕 */
.submit-button {
  height: 44px;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 10px;
  background: var(--capy-primary);
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 16px;
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
