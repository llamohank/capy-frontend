<template>
  <div class="login-container">
    <!-- 左側隨機化 Hero Section -->
    <div class="left-section" :style="{ backgroundImage: `url(${currentHero.image})` }">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">{{ currentHero.title }}</h1>
        <p class="hero-subtitle">{{ currentHero.subtitle }}</p>
        <div class="floating-badge">🔥 5,000+ Students</div>
      </div>
    </div>

    <!-- 右側表單區域 -->
    <div class="right-section">
      <div class="form-container">
        <h1 class="title">歡迎</h1>
        <p class="subtitle">請登入或註冊以繼續學習</p>

        <!-- 切換標籤 -->
        <div class="tabs">
          <button
            :class="['tab', { active: activeTab === 'login' }]"
            @click="handleTabChange('login')"
          >
            登入
          </button>
          <button
            :class="['tab', { active: activeTab === 'register' }]"
            @click="handleTabChange('register')"
          >
            註冊
          </button>
        </div>

        <!-- 登入表單 -->
        <div v-show="activeTab === 'login'" class="form-content">
          <div class="form-group">
            <label class="form-label">電子郵件</label>
            <input
              v-model="loginForm.email"
              type="email"
              class="form-input"
              placeholder="輸入電子郵件"
            />
          </div>

          <div class="form-group">
            <label class="form-label">密碼</label>
            <div class="password-input-wrapper">
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="輸入密碼"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                <el-icon>
                  <View v-if="!showPassword" />
                  <Hide v-else />
                </el-icon>
              </button>
            </div>
          </div>

          <div class="forgot-password">
            <router-link to="/forgot-password" class="link">忘記密碼？</router-link>
          </div>

          <!-- Turnstile Widget -->
          <div class="turnstile-container">
            <div ref="loginTurnstileRef"></div>
          </div>

          <button
            class="submit-button"
            @click="handleLogin"
            :disabled="isLoggingIn"
            :class="{ 'is-loading': isLoggingIn }"
          >
            <el-icon v-if="isLoggingIn" class="is-loading">
              <Loading />
            </el-icon>
            <span>{{ isLoggingIn ? '登入中...' : '登入' }}</span>
          </button>
          <button class="google-button" @click="handleGoogleLogin">
            <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            使用 Google 繼續
          </button>
        </div>

        <!-- 註冊表單 -->
        <div v-show="activeTab === 'register'" class="form-content">
          <!-- 註冊成功狀態 -->
          <div v-if="isRegisterSuccess" class="success-state">
            <div class="success-icon">
              <el-icon :size="64" color="var(--capy-primary)">
                <Message />
              </el-icon>
            </div>
            <h2 class="success-title">驗證郵件已發送</h2>
            <p class="success-description">
              我們已將驗證連結發送至 <strong>{{ registeredEmail }}</strong>。<br />
              請檢查您的收件匣以啟用您的帳號。
            </p>
            <button class="submit-button" @click="isRegisterSuccess = false; activeTab = 'login'">
              返回登入
            </button>
          </div>

          <!-- 註冊表單 -->
          <div v-else>
          <div class="form-group">
            <div class="label-with-tooltip">
              <label class="form-label">暱稱</label>
              <el-tooltip
                content="僅能包含中英文、數字、底線(_)、連接號(-)、句點(.)，不允許空白"
                placement="right"
                effect="light"
              >
                <el-icon class="help-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
            <div class="input-with-icon">
              <input
                v-model="registerForm.username"
                type="text"
                class="form-input"
                placeholder="輸入暱稱（至少 2 個字元）"
                @input="handleNicknameInput"
                @compositionstart="handleCompositionStart"
                @compositionend="handleCompositionEnd"
              />
              <div v-if="nicknameValidation.checking" class="input-icon">
                <el-icon class="is-loading">
                  <Loading />
                </el-icon>
              </div>
            </div>
            <div v-show="nicknameValidation.message" :class="['validation-message', nicknameValidation.type]">
              {{ nicknameValidation.message || '&nbsp;' }}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">電子郵件</label>
            <input
              v-model="registerForm.email"
              type="email"
              class="form-input"
              placeholder="輸入電子郵件"
              :readonly="!!registerForm.googleId"
              :class="{ 'readonly-input': !!registerForm.googleId }"
            />
            <div v-if="registerForm.googleId" class="info-message">
              此信箱來自 Google 帳號，無法修改
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">密碼</label>
            <div class="password-input-wrapper">
              <input
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="輸入密碼"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                <el-icon>
                  <View v-if="!showPassword" />
                  <Hide v-else />
                </el-icon>
              </button>
            </div>
          </div>

          <!-- 密碼強度提示 -->
          <div v-show="passwordStrengthMessage"
               :class="['password-hint', passwordHintClass]">
            <el-icon><InfoFilled /></el-icon>
            <span>{{ passwordStrengthMessage || '&nbsp;' }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">確認密碼</label>
            <div class="password-input-wrapper">
              <input
                v-model="registerForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="再次輸入密碼"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <el-icon>
                  <View v-if="!showConfirmPassword" />
                  <Hide v-else />
                </el-icon>
              </button>
            </div>
          </div>

          <div class="checkbox-group">
            <el-checkbox
              v-model="registerForm.agreeTerms"
              id="terms"
            >
              <span class="checkbox-text">
                我已閱讀並同意
                <a href="#" @click.stop.prevent="showTermsDialog = true" class="legal-link">服務條款</a>
                和
                <a href="#" @click.stop.prevent="showPrivacyDialog = true" class="legal-link">隱私權政策</a>
              </span>
            </el-checkbox>
          </div>

          <!-- Turnstile Widget -->
          <div class="turnstile-container">
            <div ref="registerTurnstileRef"></div>
          </div>

          <button
            class="submit-button"
            @click="handleRegister"
            :disabled="isRegistering"
            :class="{ 'is-loading': isRegistering }"
          >
            <el-icon v-if="isRegistering" class="is-loading">
              <Loading />
            </el-icon>
            <span>{{ isRegistering ? '註冊中...' : '建立帳號' }}</span>
          </button>

          <button class="google-button" @click="handleGoogleLogin">
            <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            使用 Google 繼續
          </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 服務條款對話框 -->
    <el-dialog
      v-model="showTermsDialog"
      title="服務條款"
      width="800px"
      :close-on-click-modal="false"
      class="legal-dialog"
    >
      <TermsOfServiceContent />
    </el-dialog>

    <!-- 隱私權政策對話框 -->
    <el-dialog
      v-model="showPrivacyDialog"
      title="隱私權政策"
      width="800px"
      :close-on-click-modal="false"
      class="legal-dialog"
    >
      <PrivacyPolicyContent />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { View, Hide, Message, Loading, InfoFilled, QuestionFilled } from '@element-plus/icons-vue';
import TermsOfServiceContent from '@/components/legal/TermsOfServiceContent.vue';
import PrivacyPolicyContent from '@/components/legal/PrivacyPolicyContent.vue';
import {
  validateNicknameFormat,
  createNicknameValidator,
  debounce,
  VALIDATION_MESSAGES,
  MIN_NICKNAME_LENGTH
} from '@/utils/usernameValidator';
import { ElMessage } from 'element-plus';
import { login, register, initiateGoogleOAuth } from '@/api/oauth/oauth';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// Turnstile 配置
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

// 檢查 Site Key 是否存在
if (!turnstileSiteKey) {
  console.error('❌ 缺少 Turnstile Site Key！');
  console.error('請確認：');
  console.error('1. 專案根目錄是否有 .env 檔案');
  console.error('2. .env 檔案中是否包含 VITE_TURNSTILE_SITE_KEY=你的site_key');
  console.error('3. 修改 .env 後需要重新啟動開發伺服器 (npm run dev)');
}

const loginTurnstileRef = ref(null);
const registerTurnstileRef = ref(null);
const loginTurnstileToken = ref('');
const registerTurnstileToken = ref('');
const loginWidgetId = ref(null);
const registerWidgetId = ref(null);

// Turnstile 回調函數
const onLoginTurnstileVerify = (token) => {
  loginTurnstileToken.value = token;
};

const onLoginTurnstileExpire = () => {
  loginTurnstileToken.value = '';
  console.log('登入 Turnstile token 已過期');
};

const onRegisterTurnstileVerify = (token) => {
  registerTurnstileToken.value = token;
  console.log('註冊 Turnstile 驗證成功:', token);
};

const onRegisterTurnstileExpire = () => {
  registerTurnstileToken.value = '';
  console.log('註冊 Turnstile token 已過期');
};

// 渲染 Turnstile Widget
const renderLoginTurnstile = () => {
  if (!window.turnstile || !loginTurnstileRef.value) {
    console.log('Turnstile 尚未載入或元素不存在');
    return;
  }

  // 檢查 Site Key
  if (!turnstileSiteKey) {
    console.error('❌ 無法渲染 Turnstile：缺少 Site Key');
    ElMessage.error('系統配置錯誤：缺少 Turnstile Site Key，請聯絡管理員');
    return;
  }

  try {
    loginWidgetId.value = window.turnstile.render(loginTurnstileRef.value, {
      sitekey: turnstileSiteKey,
      callback: onLoginTurnstileVerify,
      'expired-callback': onLoginTurnstileExpire,
      theme: 'light',
    });
    console.log('✅ 登入 Turnstile Widget 已渲染，ID:', loginWidgetId.value);
  } catch (error) {
    console.error('❌ 渲染登入 Turnstile 失敗:', error);
    ElMessage.error('人機驗證載入失敗，請重新整理頁面');
  }
};

const renderRegisterTurnstile = () => {
  if (!window.turnstile || !registerTurnstileRef.value) {
    console.log('Turnstile 尚未載入或元素不存在');
    return;
  }

  // 檢查 Site Key
  if (!turnstileSiteKey) {
    console.error('❌ 無法渲染 Turnstile：缺少 Site Key');
    ElMessage.error('系統配置錯誤：缺少 Turnstile Site Key，請聯絡管理員');
    return;
  }

  try {
    registerWidgetId.value = window.turnstile.render(registerTurnstileRef.value, {
      sitekey: turnstileSiteKey,
      callback: onRegisterTurnstileVerify,
      'expired-callback': onRegisterTurnstileExpire,
      theme: 'light',
    });
    console.log('✅ 註冊 Turnstile Widget 已渲染，ID:', registerWidgetId.value);
  } catch (error) {
    console.error('❌ 渲染註冊 Turnstile 失敗:', error);
    ElMessage.error('人機驗證載入失敗，請重新整理頁面');
  }
};

// 重置 Turnstile Widget
const resetLoginTurnstile = () => {
  if (window.turnstile && loginWidgetId.value !== null) {
    try {
      window.turnstile.reset(loginWidgetId.value);
      loginTurnstileToken.value = '';
      console.log('登入 Turnstile 已重置');
    } catch (error) {
      console.error('重置登入 Turnstile 失敗:', error);
    }
  }
};

const resetRegisterTurnstile = () => {
  if (window.turnstile && registerWidgetId.value !== null) {
    try {
      window.turnstile.reset(registerWidgetId.value);
      registerTurnstileToken.value = '';
      console.log('註冊 Turnstile 已重置');
    } catch (error) {
      console.error('重置註冊 Turnstile 失敗:', error);
    }
  }
};

// Hero Section 隨機化
const heroOptions = [
  {
    image: '/Gemini_Generated_Image_wncmt4wncmt4wncm.png',
    title: '像水豚一樣自在地學習',
    subtitle: 'CapyCourse 陪你從零開始，探索無限可能'
  },
  {
    image: '/Gemini_Generated_Image_wncmt4wncmt4wncm.png',
    title: '專注，是成長的捷徑',
    subtitle: '讓知識成為你最強的後盾'
  },
  {
    image: '/Gemini_Generated_Image_wncmt4wncmt4wncm.png',
    title: '學習，是為了更好的生活',
    subtitle: '依照你的步調，隨時隨地開始'
  }
];

const currentHero = ref(heroOptions[0]);

// 當前標籤
const activeTab = ref('login');

// 註冊成功狀態
const isRegisterSuccess = ref(false);
const registeredEmail = ref('');

// 密碼顯示狀態
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// 法律條款對話框狀態
const showTermsDialog = ref(false);
const showPrivacyDialog = ref(false);

// 登入載入狀態
const isLoggingIn = ref(false);

// 註冊載入狀態
const isRegistering = ref(false);

// 登入表單
const loginForm = reactive({
  email: '',
  password: ''
});

// 註冊表單
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
  googleId: '' // 用於儲存 Google ID（如果是從 OAuth 導向過來的）
});

// 暱稱驗證狀態
const nicknameValidation = reactive({
  message: '',
  type: '', // 'success' | 'error' | 'warning' | 'info'
  checking: false, // 是否正在檢查中
  available: null // true: 可用, false: 不可用, null: 未檢查或錯誤
});

// 中文輸入法狀態
const isComposing = ref(false);

// 密碼強度提示和驗證
const passwordStrengthMessage = computed(() => {
  if (!registerForm.password) return '';

  if (registerForm.password.length < 8) {
    return '❌ 密碼長度至少需要 8 個字元';
  }

  // 檢查密碼強度（必要條件）
  const hasUpperCase = /[A-Z]/.test(registerForm.password);
  const hasLowerCase = /[a-z]/.test(registerForm.password);
  const hasNumber = /[0-9]/.test(registerForm.password);
  const hasSpecial = /[!@#$%^&*()_+\-={}[\]:;"'<>,.?/]/.test(registerForm.password);

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
  if (!registerForm.password || registerForm.password.length < 8) return false;

  const hasUpperCase = /[A-Z]/.test(registerForm.password);
  const hasLowerCase = /[a-z]/.test(registerForm.password);
  const hasNumber = /[0-9]/.test(registerForm.password);
  const hasSpecial = /[!@#$%^&*()_+\-={}[\]:;"'<>,.?/]/.test(registerForm.password);

  return hasUpperCase && hasLowerCase && hasNumber && hasSpecial;
});

// 密碼提示的樣式 class
const passwordHintClass = computed(() => {
  const message = passwordStrengthMessage.value;
  if (message.startsWith('❌')) return 'hint-error';
  if (message.startsWith('✓')) return 'hint-success';
  return 'hint-info';
});

// 建立暱稱驗證器（處理請求競爭）
const nicknameValidator = createNicknameValidator();

// 暱稱驗證函式（帶 debounce 和 API 檢查）
const validateNicknameDebounced = debounce(async (nickname) => {
  // 如果正在組字中，不執行驗證
  if (isComposing.value) {
    return;
  }

  const trimmedNickname = nickname.trim();

  // 先進行前端格式驗證
  const formatValidation = validateNicknameFormat(trimmedNickname);

  // 如果格式驗證失敗，直接顯示錯誤
  if (!formatValidation.valid) {
    nicknameValidation.message = formatValidation.message;
    nicknameValidation.type = formatValidation.type;
    nicknameValidation.checking = false;
    nicknameValidation.available = null;
    return;
  }

  // 格式驗證通過，開始 API 檢查
  nicknameValidation.checking = true;
  nicknameValidation.message = VALIDATION_MESSAGES.CHECKING;
  nicknameValidation.type = 'info';

  try {
    // 呼叫 API 檢查暱稱
    const result = await nicknameValidator.validate(trimmedNickname);

    // 如果返回 null，表示這是舊的請求，被新請求取代了
    if (result === null) {
      return;
    }

    // 更新驗證結果
    nicknameValidation.message = result.message;
    nicknameValidation.type = result.type;
    nicknameValidation.available = result.available;
    nicknameValidation.checking = false;
  } catch (error) {
    console.error('暱稱驗證錯誤:', error);
    nicknameValidation.message = VALIDATION_MESSAGES.ERROR;
    nicknameValidation.type = 'warning';
    nicknameValidation.available = null;
    nicknameValidation.checking = false;
  }
}, 500); // 500ms debounce

// 處理暱稱輸入
const handleNicknameInput = () => {
  // 如果正在組字中，不觸發驗證
  if (isComposing.value) {
    return;
  }

  const nickname = registerForm.username.trim();

  // 如果長度不足最小要求，顯示提示但不呼叫 API
  if (nickname.length === 0) {
    nicknameValidation.message = '';
    nicknameValidation.type = '';
    nicknameValidation.checking = false;
    nicknameValidation.available = null;
    return;
  }

  // 觸發 debounced 驗證
  validateNicknameDebounced(registerForm.username);
};

// 處理中文輸入法開始組字
const handleCompositionStart = () => {
  isComposing.value = true;
};

// 處理中文輸入法結束組字
const handleCompositionEnd = () => {
  isComposing.value = false;
  // 組字完成後，觸發驗證
  handleNicknameInput();
};

// 清理函式
onUnmounted(() => {
  // 取消所有待處理的驗證
  if (validateNicknameDebounced.cancel) {
    validateNicknameDebounced.cancel();
  }
  if (nicknameValidator.cancel) {
    nicknameValidator.cancel();
  }
});

// 處理登入
const handleLogin = async () => {
  console.log('=== 開始登入流程 ===');
  console.log('Email:', loginForm.email);
  console.log('Password:', loginForm.password ? '***已填寫***' : '未填寫');
  console.log('Turnstile Token:', loginTurnstileToken.value);
  console.log('Token 長度:', loginTurnstileToken.value ? loginTurnstileToken.value.length : 0);
  console.log('Token 類型:', typeof loginTurnstileToken.value);

  if (!loginForm.email || !loginForm.password) {
    ElMessage.error('請填寫所有欄位');
    return;
  }

  // 驗證 Turnstile
  if (!loginTurnstileToken.value) {
    console.error('❌ Turnstile token 是空的！');
    ElMessage.error('請完成人機驗證');
    return;
  }

  // 防止重複點擊
  if (isLoggingIn.value) {
    return;
  }

  // 開始載入
  isLoggingIn.value = true;

  const loginData = {
    email: loginForm.email,
    password: loginForm.password,
    turnstileToken: loginTurnstileToken.value
  };

  console.log('準備送出的登入資料:', {
    email: loginData.email,
    password: '***',
    turnstileToken: loginData.turnstileToken ? `${loginData.turnstileToken.substring(0, 20)}...` : 'null'
  });

  try {
    // 呼叫登入 API（後端會自動設定 Cookie）
    const response = await login(loginData);
    console.log('✅ 登入 API 回應成功');

    // 後端回傳格式: { user: { id, email, nickname, role, avatarUrl }, roles: [...] }
    const { user, roles } = response;

    // 儲存使用者資訊到 userStore（不需要 token，Cookie 已由後端設定）
    userStore.login({
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatarUrl || '',
      roles: roles || [user.role], // 使用 roles 陣列，或將單一 role 轉換為陣列
      email: user.email,
      googleLinked: user.googleLinked || false
    });

    ElMessage.success('登入成功！');

    // 等待 Cookie 完全寫入（給瀏覽器時間處理 Set-Cookie header）
    await new Promise(resolve => setTimeout(resolve, 100));

    // 驗證 Cookie 是否已設定（透過呼叫 verify API）
    try {
      await userStore.init();
      console.log('Cookie 驗證成功，使用者已認證');
    } catch (verifyError) {
      console.warn('Cookie 驗證失敗，但繼續跳轉:', verifyError);
      // 即使驗證失敗也繼續，因為使用者資訊已存入 store
    }

    // 檢查是否有原始目標路徑
    const redirectPath = route.query.redirect || '/';

    // 跳轉頁面
    await router.push(redirectPath);
  } catch (error) {
    console.error('登入失敗:', error);

    // 處理被攔截器包裝過的錯誤
    if (error.handled) {
      // 401 錯誤已被攔截器處理，顯示通用錯誤訊息
      if (error.status === 401) {
        ElMessage.error('登入失敗，請檢查您的帳號密碼');
      }
      // 登入失敗時重置載入狀態
      isLoggingIn.value = false;
      return;
    }

    // 檢查是否為帳號未驗證或停用的錯誤
    const errorMessage = error.response?.data?.message || error.message || '';
    const status = error.response?.status;

    // 如果是 403 或錯誤訊息包含「未驗證」、「停用」等關鍵字
    if (status === 403 || errorMessage.includes('未驗證') || errorMessage.includes('停用') ||
        errorMessage.includes('not active') || errorMessage.includes('suspended')) {
      ElMessage.warning('您的帳號尚未啟用，請檢查您的電子郵件以完成驗證');
    } else if (status === 400 && errorMessage.includes('Turnstile')) {
      ElMessage.error('人機驗證失敗，請重試');
    } else {
      ElMessage.error(errorMessage || '登入失敗，請檢查您的帳號密碼');
    }

    // 登入失敗時重置載入狀態和 Turnstile
    isLoggingIn.value = false;
    resetLoginTurnstile();
  }
};

// 處理註冊
const handleRegister = async () => {
  // 防止重複點擊
  if (isRegistering.value) {
    return;
  }

  // 檢查是否正在驗證暱稱
  if (nicknameValidation.checking) {
    ElMessage.warning('請等待暱稱驗證完成');
    return;
  }

  // 驗證暱稱格式
  const formatValidation = validateNicknameFormat(registerForm.username);
  if (!formatValidation.valid) {
    ElMessage.error(formatValidation.message || '暱稱格式不正確');
    return;
  }

  // 檢查暱稱是否可用（必須通過 API 驗證）
  if (nicknameValidation.available !== true) {
    ElMessage.error('請使用可用的暱稱');
    return;
  }

  // 驗證其他欄位
  if (!registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
    ElMessage.error('請填寫所有欄位');
    return;
  }

  // 驗證 Turnstile
  if (!registerTurnstileToken.value) {
    ElMessage.error('請完成人機驗證');
    return;
  }

  // 驗證密碼長度
  if (registerForm.password.length < 8) {
    ElMessage.error('密碼長度至少需要 8 個字元');
    return;
  }

  // 檢查是否包含大寫字母
  if (!/[A-Z]/.test(registerForm.password)) {
    ElMessage.error('密碼必須包含至少一個大寫字母 (A-Z)');
    return;
  }

  // 檢查是否包含小寫字母
  if (!/[a-z]/.test(registerForm.password)) {
    ElMessage.error('密碼必須包含至少一個小寫字母 (a-z)');
    return;
  }

  // 檢查是否包含數字
  if (!/[0-9]/.test(registerForm.password)) {
    ElMessage.error('密碼必須包含至少一個數字 (0-9)');
    return;
  }

  // 檢查是否包含特殊符號
  if (!/[!@#$%^&*()_+\-={}[\]:;"'<>,.?/]/.test(registerForm.password)) {
    ElMessage.error('密碼必須包含至少一個特殊符號 (!@#$%^&*()_+-={}[]:;"\'<>,.?/)');
    return;
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    ElMessage.error('兩次密碼輸入不一致');
    return;
  }

  if (!registerForm.agreeTerms) {
    ElMessage.error('請同意服務條款');
    return;
  }

  // 開始載入
  isRegistering.value = true;

  try {
    // 註冊前再次確認暱稱可用性（防止併發問題）
    const finalCheck = await nicknameValidator.validate(registerForm.username.trim());
    if (finalCheck && finalCheck.available !== true) {
      ElMessage.error('此暱稱已被使用，請重新選擇');
      nicknameValidation.available = false;
      nicknameValidation.message = VALIDATION_MESSAGES.TAKEN;
      nicknameValidation.type = 'error';
      isRegistering.value = false;
      return;
    }

    // 呼叫註冊 API
    await register({
      email: registerForm.email,
      password: registerForm.password,
      nickname: registerForm.username.trim(),
      googleId: registerForm.googleId || undefined, // 如果有 Google ID 則一併送出
      turnstileToken: registerTurnstileToken.value
    });

    // 判斷是否為 Google OAuth 註冊
    if (registerForm.googleId) {
      // Google OAuth 註冊：直接嘗試登入
      ElMessage.success('註冊成功！正在為您登入...');

      try {
        const loginResponse = await login({
          email: registerForm.email,
          password: registerForm.password
        });

        const { user, roles } = loginResponse;

        // 儲存使用者資訊到 userStore
        userStore.login({
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatarUrl || '',
          roles: roles || [user.role],
          email: user.email,
          googleLinked: user.googleLinked || false
        });

        ElMessage.success('登入成功！');

        // 等待 Cookie 完全寫入（給瀏覽器時間處理 Set-Cookie header）
        await new Promise(resolve => setTimeout(resolve, 100));

        // 註冊後自動登入成功，使用登入模式載入完整資料（呼叫 /student/user）
        try {
          await userStore.init(true);
          console.log('✅ 使用者完整資料載入成功');
        } catch (verifyError) {
          console.warn('⚠️ 載入完整資料失敗，但繼續跳轉:', verifyError);
        }

        // 跳轉到學生中心
        const redirectPath = route.query.redirect || '/';
        await router.push(redirectPath);
      } catch (loginError) {
        console.error('自動登入失敗:', loginError);
        ElMessage.warning('註冊成功，請手動登入');
        activeTab.value = 'login';
      }
    } else {
      // 一般註冊：顯示驗證郵件頁面
      registeredEmail.value = registerForm.email;
      isRegisterSuccess.value = true;
      ElMessage.success('註冊成功！請檢查您的電子郵件');
    }
  } catch (error) {
    console.error('註冊失敗:', error);
    const errorMessage = error.response?.data?.message || error.message || '註冊失敗，請稍後再試';
    const status = error.response?.status;

    // 如果是 Turnstile 驗證失敗
    if (status === 400 && errorMessage.includes('Turnstile')) {
      ElMessage.error('人機驗證失敗，請重試');
      resetRegisterTurnstile();
    } else {
      ElMessage.error(errorMessage);
      // 其他錯誤也重置 Turnstile
      resetRegisterTurnstile();
    }
  } finally {
    // 無論成功或失敗，都重置載入狀態
    isRegistering.value = false;
  }
};

/**
 * 處理 Google 登入
 * 導向後端的 OAuth 授權端點
 */
const handleGoogleLogin = () => {
  console.log(userStore);
  initiateGoogleOAuth();
};

// 處理 tab 切換
const handleTabChange = (tab) => {
  activeTab.value = tab;
  // 渲染邏輯已移至 watch 監聽器，避免重複渲染
};

// 監聽 activeTab 變化，確保 Turnstile 在任何情況下都能被渲染
watch(activeTab, async (newTab) => {
  await nextTick();  // 等待 DOM 更新

  if (newTab === 'register' && registerWidgetId.value === null) {
    renderRegisterTurnstile();
  } else if (newTab === 'login' && loginWidgetId.value === null) {
    renderLoginTurnstile();
  }
});

/**
 * 處理 OAuth 回調的三種情境
 * 在元件掛載時檢查 URL 查詢參數
 */
onMounted(() => {
  // 隨機選擇 Hero Section
  const randomIndex = Math.floor(Math.random() * heroOptions.length);
  currentHero.value = heroOptions[randomIndex];

  const { email, googleId, oauthError } = route.query;

  // 情境 1: OAuth 錯誤或帳號停用
  if (oauthError) {
    ElMessage.error(`Google 登入失敗: ${oauthError}`);
    // 清除 URL 中的查詢參數
    router.replace({ path: '/login', query: {} });
    // ⚠️ 移除 return，讓程式繼續執行 initTurnstile
  }

  // 情境 2: 未綁定的 Google 帳號，需要完成註冊/綁定
  if (email && googleId) {
    ElMessage.info('檢測到 Google 帳號，請完成註冊以繼續');

    // 切換到註冊頁籤
    activeTab.value = 'register';

    // 預填 email 和 googleId（可以選擇是否顯示給使用者）
    registerForm.email = email;
    // 將 googleId 儲存起來，註冊時一併送出
    registerForm.googleId = googleId;

    // 清除 URL 中的查詢參數
    router.replace({ path: '/login', query: {} });
    // ⚠️ 移除 return，讓程式繼續執行 initTurnstile
  }

  // 等待 Turnstile script 載入後渲染 widgets
  const initTurnstile = () => {
    if (window.turnstile) {
      console.log('Turnstile 已載入，Site Key:', turnstileSiteKey);
      // 根據當前 tab 渲染對應的 widget
      setTimeout(() => {
        if (activeTab.value === 'login' && loginWidgetId.value === null) {
          renderLoginTurnstile();
        } else if (activeTab.value === 'register' && registerWidgetId.value === null) {
          renderRegisterTurnstile();
        }
      }, 100);
    } else {
      console.log('等待 Turnstile 載入...');
      setTimeout(initTurnstile, 100);
    }
  };

  initTurnstile();
});
</script>

<style scoped lang="scss">
:root {
  --capy-primary: #54CDF2;
  --capy-primary-dark: #0EA5E9;
  --capy-bg-base: #F5F7FA;
  --capy-text-primary: #303133;
  --capy-text-secondary: #606266;
  --capy-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* 外層容器 - 全螢幕並置中 */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--capy-bg-base);
  padding: 20px;
}

/* 內層容器 - 固定大小 */
.login-container > .left-section,
.login-container > .right-section {
  height: 780px;
}

.login-container > .left-section {
  width: 620px;
}

.login-container > .right-section {
  width: 520px;
}

/* 左側 Hero Section */
.left-section {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  border-radius: 20px 0 0 20px;
  box-shadow: -5px 0 20px rgba(0, 0, 0, 0.05);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
}

/* 藍色漸層覆蓋層 */
.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(224, 231, 255, 0.55), rgba(221, 214, 254, 0.75));
  z-index: 1;
}

/* Hero 內容 */
.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: var(--capy-text-primary);
}

.hero-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.3;
  color: var(--capy-text-primary);
}

.hero-subtitle {
  font-size: 18px;
  font-weight: 400;
  color: var(--capy-text-secondary);
  line-height: 1.6;
  margin-bottom: 32px;
}

/* 浮動徽章 */
.floating-badge {
  display: inline-block;
  padding: 12px 24px;
  background: white;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  color: var(--capy-primary);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 右側表單區域 */
.right-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px; /* 減少上下 padding，留更多空間給內容 */
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden; /* 防止圓角被內容切掉 */
  position: relative; /* 確保內容定位正確 */
}

.form-container {
  width: 100%;
  max-width: 370px;
  height: 100%; /* 填滿父容器 */
  overflow-y: auto; /* 啟用垂直捲動 */
  padding-right: 4px; /* 預留捲軸空間，避免內容貼邊 */
  
  /* 隱藏捲軸但保留功能 (Chrome, Safari, Opera) */
  &::-webkit-scrollbar {
    width: 0px; 
    background: transparent;
  }
  
  /* 隱藏捲軸 (Firefox) */
  scrollbar-width: none;
  
  /* 隱藏捲軸 (IE 10+) */
  -ms-overflow-style: none;
  
  /* 確保內容有足夠空間顯示 */
  display: flex;
  flex-direction: column;
  justify-content: center; /* 內容少時置中 */
}

/* 當內容超出時，改為頂部對齊，避免無法捲動到最上方 */
.form-container:has(.form-content) {
  justify-content: flex-start;
  padding-top: 20px; /* 預留頂部空間 */
}

.title {
  margin-top: 0; /* 確保固定起始點 */
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
}

/* 切換標籤 */
.tabs {
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 4px;
}

.tab {
  flex: 1;
  padding: 10px 20px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.tab.active {
  background: white;
  color: var(--capy-primary);
  box-shadow: var(--capy-shadow-md);
}

/* 表單內容 */
.form-content {
  animation: fadeIn 0.3s ease;
}
.info-message-placeholder {
  height: 40px; /* 固定高度 */
  visibility: hidden; /* 不顯示但佔空間 */
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

.form-group {
  margin-bottom: 16px;
}

.label-with-tooltip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0; /* 改為 0，由 label-with-tooltip 控制間距 */
}

/* 針對非 tooltip 包裹的 label 恢復間距 */
.form-group > .form-label {
  margin-bottom: 6px;
}

.help-icon {
  font-size: 14px;
  color: var(--capy-text-secondary);
  cursor: help;
  transition: color 0.3s ease;
}

.help-icon:hover {
  color: var(--capy-primary);
}

.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e5e5e5;
  border-radius: 10px;
  font-size: 14px;
  color: var(--capy-text-primary);
  transition: all 0.3s ease;
  background: var(--capy-bg-base);
}

.form-input:focus {
  outline: none;
  border-color: var(--capy-primary);
  background: white;
}

.form-input::placeholder {
  color: #999;
}

.form-input.readonly-input {
  background: #f0f0f0;
  color: #666;
  cursor: not-allowed;
  border-color: #d0d0d0;
}

.form-input.readonly-input:focus {
  border-color: #d0d0d0;
  background: #f0f0f0;
}

.info-message {
  margin-top: 8px;
  font-size: 13px;
  color: var(--capy-primary);
  background: var(--el-color-primary-light-9);
  padding: 8px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 密碼輸入框 */
.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: var(--capy-primary);
}

/* 驗證訊息 */
.validation-message {
  margin-top: 8px;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  min-height: 37px; /* 固定最小高度，確保即使沒有內容也佔據空間 */
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

.validation-message.success {
  color: var(--capy-success);
  background: var(--el-color-success-light-9);
}

.validation-message.error {
  color: var(--capy-danger);
  background: var(--el-color-danger-light-9);
}

.validation-message.warning {
  color: var(--el-color-warning);
  background: var(--el-color-warning-light-9);
}

.validation-message.info {
  color: var(--capy-primary);
  background: var(--el-color-primary-light-9);
}

/* 暱稱格式提示 */
.nickname-hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--capy-text-secondary);
  padding: 6px 12px;
  background: var(--capy-bg-base);
  border-radius: 6px;
  line-height: 1.4;
}

/* 輸入框帶 icon */
.input-with-icon {
  position: relative;
}

.input-with-icon .form-input {
  padding-right: 40px;
}

.input-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--capy-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.input-icon .is-loading {
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

/* 忘記密碼 */
.forgot-password {
  text-align: right;
  margin-bottom: 16px;
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

/* 提交按鈕 */
.submit-button {
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
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-button:hover:not(:disabled) {
  background: var(--capy-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(84, 205, 242, 0.3);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.submit-button.is-loading {
  pointer-events: none;
}

.submit-button .is-loading {
  animation: rotating 1.5s linear infinite;
}

/* API 測試連結 */
.api-test {
  text-align: center;
}

/* Checkbox */
.checkbox-group {
  margin-bottom: 16px;
}

.checkbox-group :deep(.el-checkbox) {
  align-items: flex-start;
}

.checkbox-group :deep(.el-checkbox__label) {
  line-height: 1.6;
  white-space: normal;
}

.checkbox-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.legal-link {
  color: var(--capy-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.legal-link:hover {
  color: var(--capy-primary-dark);
  text-decoration: underline;
}

/* 密碼強度提示 */
.password-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  min-height: 45px;
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

.password-hint .el-icon {
  font-size: 16px;
  flex-shrink: 0;
}

/* Turnstile 容器 */
.turnstile-container {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  min-height: 65px;
}

.turnstile-container .cf-turnstile {
  display: flex;
  justify-content: center;
}

/* Google 按鈕 */
.google-button {
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e5e5;
  border-radius: 10px;
  background: white;
  color: #1a1a1a;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.google-button:hover {
  border-color: var(--capy-primary);
  background: var(--capy-bg-base);
}

.google-icon {
  flex-shrink: 0;
}

/* 註冊成功狀態 */
.success-state {
  text-align: center;
  padding: 20px 0;
  animation: fadeIn 0.5s ease;
}

.success-icon {
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

.success-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.success-description {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 32px;
}

.success-description strong {
  color: var(--capy-primary);
  font-weight: 600;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .left-section {
    display: none;
  }

  .login-container > .right-section {
    width: 100%;
    max-width: 520px;
    border-radius: 20px;
  }

  .right-section {
    padding: 40px 20px;
  }
}

@media (min-width: 769px) and (max-width: 968px) {
  .login-container {
    flex-direction: column;
  }

  .login-container > .left-section,
  .login-container > .right-section {
    width: 100%;
    max-width: 620px;
  }

  .left-section {
    height: 300px;
    border-radius: 20px 20px 0 0;
  }

  .right-section {
    border-radius: 0 0 20px 20px;
    padding: 40px 20px;
  }
}

/* 法律條款對話框樣式 */
:deep(.legal-dialog) {
  .el-dialog__body {
    max-height: 60vh;
    overflow-y: auto;
    padding: 20px 30px;
  }

  .el-dialog__header {
    border-bottom: 1px solid var(--capy-border-lighter);
    padding: 20px 30px;
  }

  .el-dialog__title {
    font-size: 20px;
    font-weight: 600;
    color: var(--capy-text-primary);
  }
}
</style>
