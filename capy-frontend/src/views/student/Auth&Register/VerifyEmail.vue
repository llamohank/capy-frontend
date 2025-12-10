<template>
  <div class="verify-email-container">
    <div class="verify-card">
      <!-- Loading 狀態 -->
      <div v-if="status === 'loading'" class="state-content">
        <div class="icon-wrapper loading">
          <el-icon :size="64" class="rotating">
            <Loading />
          </el-icon>
        </div>
        <h2 class="state-title">驗證中...</h2>
        <p class="state-description">請稍候，我們正在驗證您的電子郵件</p>
      </div>

      <!-- Success 狀態 -->
      <div v-else-if="status === 'success'" class="state-content">
        <div class="icon-wrapper success">
          <el-icon :size="64" color="var(--capy-success)">
            <CircleCheckFilled />
          </el-icon>
        </div>
        <h2 class="state-title">Email 驗證完成！</h2>
        <p class="state-description">
          您的帳號已成功啟用，請使用帳號密碼登入
          <span v-if="countdown > 0">({{ countdown }}秒後自動跳轉)</span>
        </p>
        <button class="action-button success" @click="goToLogin">
          前往登入
        </button>
      </div>

      <!-- Error 狀態 -->
      <div v-else-if="status === 'error'" class="state-content">
        <div class="icon-wrapper error">
          <el-icon :size="64" color="var(--capy-danger)">
            <CircleCloseFilled />
          </el-icon>
        </div>
        <h2 class="state-title">驗證失敗</h2>
        <p class="state-description">{{ errorMessage }}</p>
        <button class="action-button" @click="goToLogin">
          返回登入
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Loading, CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { verifyEmail as verifyEmailAPI } from '@/api/oauth/oauth.js';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 狀態管理
const status = ref('loading'); // 'loading' | 'success' | 'error'
const errorMessage = ref('');
const countdown = ref(3);
let countdownTimer = null;

/**
 * 驗證電子郵件
 * 新流程：只啟用帳號，不自動登入
 */
const verifyEmail = async (token) => {
  try {
    // 呼叫後端驗證 API - 使用 POST 請求，token 作為 query parameter
    // 後端只會啟用帳號（從 suspended 改為 active），不會簽發 JWT
    await verifyEmailAPI(token);

    // 設定成功狀態
    status.value = 'success';
    ElMessage.success('Email 驗證完成，請使用帳密登入！');

    // 開始倒數計時，3秒後自動跳轉到登入頁
    startCountdown();
  } catch (error) {
    console.error('驗證失敗:', error);
    status.value = 'error';

    // 設定錯誤訊息
    const message = error.response?.data?.message || error.message;
    if (message.includes('expired') || message.includes('過期')) {
      errorMessage.value = '驗證連結已過期，請重新註冊或聯繫客服';
    } else if (message.includes('already') || message.includes('已啟用')) {
      errorMessage.value = '此帳號已經啟用，請直接登入';
    } else if (message.includes('invalid') || message.includes('無效')) {
      errorMessage.value = '驗證連結無效，請確認連結是否正確';
    } else {
      errorMessage.value = message || '驗證失敗，請稍後再試';
    }
  }
};

/**
 * 開始倒數計時
 */
const startCountdown = () => {
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer);
      goToLogin();
    }
  }, 1000);
};

/**
 * 返回登入頁
 */
const goToLogin = () => {
  router.push('/login');
};

/**
 * 元件掛載時執行驗證
 */
onMounted(() => {
  const token = route.query.token;

  if (!token) {
    status.value = 'error';
    errorMessage.value = '缺少驗證令牌，請檢查連結是否完整';
    return;
  }

  // 執行驗證
  verifyEmail(token);
});

/**
 * 元件卸載時清除計時器
 */
import { onUnmounted } from 'vue';
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<style scoped>
/* 外層容器 */
.verify-email-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%);
  padding: 20px;
}

/* 驗證卡片 */
.verify-card {
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 100%;
  text-align: center;
}

/* 狀態內容 */
.state-content {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 圖示容器 */
.icon-wrapper {
  margin-bottom: 24px;
  animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.icon-wrapper.loading {
  color: var(--capy-primary);
}

.rotating {
  animation: rotate 1.5s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 標題 */
.state-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
}

/* 描述 */
.state-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 32px;
}

/* 按鈕 */
.action-button {
  width: 100%;
  max-width: 300px;
  padding: 14px 32px;
  border: none;
  border-radius: 10px;
  background: var(--capy-primary);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  background: var(--el-color-primary-dark-2);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(var(--capy-primary-rgb), 0.3);
}

.action-button.success {
  background: var(--capy-success);
}

.action-button.success:hover {
  background: var(--el-color-success-dark-2);
  box-shadow: 0 8px 20px rgba(103, 194, 58, 0.3);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .verify-card {
    padding: 40px 24px;
  }

  .state-title {
    font-size: 24px;
  }

  .state-description {
    font-size: 14px;
  }
}
</style>
