<template>
  <div class="instructor-landing">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">將您的知識轉化為收入</h1>
        <p class="hero-subtitle">
          加入 CapyCourse，保留 <strong>70%</strong> 的收益。<br />
          安全的影片託管、每月準時付款，以及不斷成長的學生群體。
        </p>
        <router-link :to="{ name: 'becomeInstructor' }">
        <el-button
          type="primary"
          size="large"
          class="hero-cta"
          @click="handleStartTeaching"
        >
          立即開始教學
          <el-icon class="ml-2"><ArrowRight /></el-icon>
        </el-button>
        </router-link>
      </div>
    </section>

    <!-- Revenue Calculator Section -->
    <section class="calculator-section">
      <div class="container">
        <h2 class="section-title-student">計算您的潛在收入</h2>
        <p class="section-subtitle">看看您每個月可以賺多少</p>

        <el-card class="calculator-card" shadow="always">
          <div class="calculator-content">
            <div class="calculator-inputs">
              <div class="input-group">
                <label class="input-label">
                  <el-icon><Money /></el-icon>
                  課程價格 (NT$)
                </label>
                <el-slider
                  v-model="coursePrice"
                  :min="0"
                  :max="5000"
                  :step="100"
                  :show-tooltip="true"
                  :format-tooltip="formatPrice"
                  class="price-slider"
                />
                <div class="input-value">NT$ {{ coursePrice.toLocaleString() }}</div>
              </div>

              <div class="input-group">
                <label class="input-label">
                  <el-icon><User /></el-icon>
                  每月學生數
                </label>
                <el-slider
                  v-model="monthlyStudents"
                  :min="0"
                  :max="100"
                  :step="1"
                  :show-tooltip="true"
                  class="students-slider"
                />
                <div class="input-value">{{ monthlyStudents }} 位學生</div>
              </div>
            </div>

            <div class="calculator-result">
              <div class="result-label">您的潛在月收入</div>
              <div class="result-amount">
                <span class="currency">NT$</span>
                <span class="amount">{{ animatedIncome.toLocaleString() }}</span>
              </div>
              <div class="result-note">
                <el-icon><InfoFilled /></el-icon>
                基於 70% 收益分成計算
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </section>

    <!-- Key Benefits Section -->
    <section class="benefits-section">
      <div class="container">
        <h2 class="section-title-student">為什麼選擇 CapyCourse？</h2>
        <p class="section-subtitle">我們提供業界最佳的講師支援</p>

        <el-row :gutter="32" class="benefits-grid">
          <el-col :xs="24" :sm="24" :md="8">
            <div class="benefit-card">
              <div class="benefit-icon revenue">
                <el-icon><Wallet /></el-icon>
              </div>
              <h3 class="benefit-title">70% 收益分成</h3>
              <p class="benefit-description">
                我們尊重內容創作者。您保留大部分利潤，我們只收取 30% 的平台費用。
              </p>
              <div class="benefit-highlight">
                業界最高分成比例
              </div>
            </div>
          </el-col>

          <el-col :xs="24" :sm="24" :md="8">
            <div class="benefit-card">
              <div class="benefit-icon protection">
                <el-icon><Lock /></el-icon>
              </div>
              <h3 class="benefit-title">內容保護</h3>
              <p class="benefit-description">
                進階 HLS 加密技術保護您的智慧財產權，防止未經授權的下載和分享。
              </p>
              <div class="benefit-highlight">
                企業級安全防護
              </div>
            </div>
          </el-col>

          <el-col :xs="24" :sm="24" :md="8">
            <div class="benefit-card">
              <div class="benefit-icon payout">
                <el-icon><Calendar /></el-icon>
              </div>
              <h3 class="benefit-title">準時付款</h3>
              <p class="benefit-description">
                每月 1 號自動處理付款，直接匯入您的銀行帳戶。無需等待，無需催促。
              </p>
              <div class="benefit-highlight">
                自動化付款流程
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </section>

    <!-- How to Start Section -->
    <section class="steps-section">
      <div class="container">
        <h2 class="section-title-student">如何開始？</h2>
        <p class="section-subtitle">三個簡單步驟，開啟您的教學之旅</p>

        <div class="steps-container">
          <el-steps :active="3" align-center finish-status="success" class="custom-steps">
            <el-step>
              <template #icon>
                <div class="step-number">1</div>
              </template>
              <template #title>
                <div class="step-title">申請與驗證</div>
              </template>
              <template #description>
                <div class="step-description">
                  填寫申請表單，上傳相關證書。我們會在 3-5 個工作天內完成審核。
                </div>
              </template>
            </el-step>

            <el-step>
              <template #icon>
                <div class="step-number">2</div>
              </template>
              <template #title>
                <div class="step-title">上傳課程</div>
              </template>
              <template #description>
                <div class="step-description">
                  使用我們的課程管理系統，輕鬆上傳影片、設定價格、編寫課程大綱。
                </div>
              </template>
            </el-step>

            <el-step>
              <template #icon>
                <div class="step-number">3</div>
              </template>
              <template #title>
                <div class="step-title">開始賺錢</div>
              </template>
              <template #description>
                <div class="step-description">
                  課程上架後，學生購買即可開始賺取收入。每月自動結算付款。
                </div>
              </template>
            </el-step>
          </el-steps>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <el-row :gutter="32" class="stats-grid">
          <el-col :xs="12" :sm="12" :md="6">
            <div class="stat-item">
              <div class="stat-number">1,000+</div>
              <div class="stat-label">活躍講師</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="6">
            <div class="stat-item">
              <div class="stat-number">50,000+</div>
              <div class="stat-label">註冊學生</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="6">
            <div class="stat-item">
              <div class="stat-number">5,000+</div>
              <div class="stat-label">線上課程</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="6">
            <div class="stat-item">
              <div class="stat-number">70%</div>
              <div class="stat-label">收益分成</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="final-cta-section">
      <div class="cta-content">
        <h2 class="cta-title">準備好啟發他人了嗎？</h2>
        <p class="cta-subtitle">
          加入我們的講師社群，開始分享您的專業知識
        </p>
        <el-button
          type="primary"
          size="large"
          class="cta-button"
          @click="handleStartTeaching"
        >
          成為講師
          <el-icon class="ml-2"><ArrowRight /></el-icon>
        </el-button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  ArrowRight,
  Money,
  User,
  InfoFilled,
  Wallet,
  Lock,
  Calendar
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// Calculator State
const coursePrice = ref(1500)
const monthlyStudents = ref(20)

// Computed Income
const potentialIncome = computed(() => {
  return Math.round(coursePrice.value * monthlyStudents.value * 0.7)
})

// Animated Income (for smooth number transition)
const animatedIncome = ref(0)
let animationInterval = null

// Watch for income changes and animate
watch(potentialIncome, (newValue) => {
  // Clear any existing animation
  if (animationInterval) {
    clearInterval(animationInterval)
    animationInterval = null
  }

  const duration = 500 // ms
  const steps = 30
  const stepValue = (newValue - animatedIncome.value) / steps
  const stepDuration = duration / steps

  let currentStep = 0
  animationInterval = setInterval(() => {
    if (currentStep >= steps) {
      animatedIncome.value = newValue
      clearInterval(animationInterval)
      animationInterval = null
    } else {
      animatedIncome.value = Math.round(animatedIncome.value + stepValue)
      currentStep++
    }
  }, stepDuration)
}, { immediate: true })

// Format price tooltip
const formatPrice = (value) => {
  return `NT$ ${value.toLocaleString()}`
}

// Handle Start Teaching CTA
const handleStartTeaching = () => {
  if (userStore.isAuthenticated) {
    // User is logged in, go to application form
    router.push('/become-instructor')
  } else {
    // User not logged in, go to login page
    router.push({
      name: 'Login',
      query: { redirect: '/become-instructor' }
    })
  }
}
</script>

<style scoped>
.instructor-landing {
  width: 100%;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  padding: var(--capy-spacing-xxl) var(--capy-spacing-lg);
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(0, 191, 165, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(0, 191, 165, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-size: 48px;
  font-weight: var(--capy-font-weight-bold);
  margin: 0 0 var(--capy-spacing-lg) 0;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: var(--capy-font-size-xl);
  line-height: 1.6;
  margin: 0 0 var(--capy-spacing-xxl) 0;
  opacity: 0.95;
}

.hero-subtitle strong {
  color: var(--capy-primary);
  font-weight: var(--capy-font-weight-bold);
  font-size: 24px;
}

.hero-cta {
  padding: var(--capy-spacing-lg) var(--capy-spacing-xxl);
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  height: auto;
  border-radius: var(--capy-radius-lg);
  background-color: var(--capy-primary);
  border-color: var(--capy-primary);
  box-shadow: 0 8px 24px rgba(0, 191, 165, 0.3);
  transition: all var(--capy-transition-base);
}

.hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 191, 165, 0.4);
}

.ml-2 {
  margin-left: var(--capy-spacing-sm);
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--capy-spacing-lg);
}

/* Section Common Styles */
section {
  padding: var(--capy-spacing-xxl) 0;
}

.section-title-student {
  font-size: 36px;
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
  text-align: center;
  margin: 0 0 var(--capy-spacing-md) 0;
}

.section-subtitle {
  font-size: var(--capy-font-size-lg);
  color: var(--capy-text-secondary);
  text-align: center;
  margin: 0 0 var(--capy-spacing-xxl) 0;
}

/* Calculator Section */
.calculator-section {
  background-color: var(--capy-bg-base);
}

.calculator-card {
  max-width: 900px;
  margin: 0 auto;
  border-radius: var(--capy-radius-xl);
  border: 2px solid var(--capy-primary);
}

.calculator-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--capy-spacing-xxl);
  padding: var(--capy-spacing-lg);
}

.calculator-inputs {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-xxl);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-md);
}

.input-label {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-sm);
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
}

.input-label .el-icon {
  font-size: 24px;
  color: var(--capy-primary);
}

.input-value {
  font-size: var(--capy-font-size-xl);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-primary);
  text-align: center;
  padding: var(--capy-spacing-sm);
  background-color: var(--el-color-primary-light-9);
  border-radius: var(--capy-radius-md);
}

.calculator-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, var(--capy-primary) 0%, var(--el-color-primary-light-3) 100%);
  border-radius: var(--capy-radius-lg);
  padding: var(--capy-spacing-xxl);
  color: white;
}

.result-label {
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-medium);
  margin-bottom: var(--capy-spacing-md);
  opacity: 0.9;
}

.result-amount {
  display: flex;
  align-items: baseline;
  gap: var(--capy-spacing-sm);
  margin-bottom: var(--capy-spacing-lg);
}

.currency {
  font-size: 24px;
  font-weight: var(--capy-font-weight-semibold);
}

.amount {
  font-size: 56px;
  font-weight: var(--capy-font-weight-bold);
  line-height: 1;
}

.result-note {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-xs);
  font-size: var(--capy-font-size-sm);
  opacity: 0.9;
}

/* Benefits Section */
.benefits-section {
  background-color: var(--capy-bg-surface);
}

.benefits-grid {
  margin-top: var(--capy-spacing-xl);
}

.benefit-card {
  text-align: center;
  padding: var(--capy-spacing-xxl) var(--capy-spacing-lg);
  background-color: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  border: 2px solid var(--capy-border-light);
  transition: all var(--capy-transition-base);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-md);
}

.benefit-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--capy-shadow-lg);
  border-color: var(--capy-primary);
}

.benefit-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--capy-spacing-md);
  border-radius: var(--capy-radius-circle);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
}

.benefit-icon.revenue {
  background: linear-gradient(135deg, #00BFA5 0%, #00D9B5 100%);
}

.benefit-icon.protection {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.benefit-icon.payout {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.benefit-title {
  font-size: var(--capy-font-size-xl);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  margin: 0;
}

.benefit-description {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-regular);
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.benefit-highlight {
  display: inline-block;
  padding: var(--capy-spacing-xs) var(--capy-spacing-md);
  background-color: var(--el-color-primary-light-9);
  color: var(--capy-primary);
  border-radius: var(--capy-radius-lg);
  font-size: var(--capy-font-size-sm);
  font-weight: var(--capy-font-weight-medium);
  margin-top: var(--capy-spacing-md);
}

/* Steps Section */
.steps-section {
  background-color: var(--capy-bg-base);
}

.steps-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--capy-spacing-xxl);
  background-color: var(--capy-bg-surface);
  border-radius: var(--capy-radius-xl);
  box-shadow: var(--capy-shadow-base);
}

.custom-steps {
  margin-top: var(--capy-spacing-xl);
}

.custom-steps :deep(.el-step__head) {
  padding-bottom: var(--capy-spacing-lg);
}

.step-number {
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  border-radius: 50%;
  background-color: var(--capy-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: var(--capy-font-weight-bold);
  flex-shrink: 0;
}

.step-title {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  margin-top: var(--capy-spacing-md);
}

.step-description {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  line-height: 1.6;
  margin-top: var(--capy-spacing-sm);
  max-width: 300px;
}

/* Stats Section */
.stats-section {
  background: linear-gradient(135deg, var(--capy-primary) 0%, var(--el-color-primary-light-3) 100%);
  color: white;
}

.stats-grid {
  text-align: center;
}

.stat-item {
  padding: var(--capy-spacing-lg);
}

.stat-number {
  font-size: 48px;
  font-weight: var(--capy-font-weight-bold);
  margin-bottom: var(--capy-spacing-sm);
}

.stat-label {
  font-size: var(--capy-font-size-lg);
  opacity: 0.9;
}

/* Final CTA Section */
.final-cta-section {
  background-color: var(--capy-bg-surface);
  padding: var(--capy-spacing-xxl) var(--capy-spacing-lg);
}

.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta-title {
  font-size: 36px;
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-md) 0;
}

.cta-subtitle {
  font-size: var(--capy-font-size-lg);
  color: var(--capy-text-secondary);
  margin: 0 0 var(--capy-spacing-xxl) 0;
}

.cta-button {
  padding: var(--capy-spacing-lg) var(--capy-spacing-xxl);
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  height: auto;
  border-radius: var(--capy-radius-lg);
  background-color: var(--capy-primary);
  border-color: var(--capy-primary);
  box-shadow: 0 8px 24px rgba(0, 191, 165, 0.3);
  transition: all var(--capy-transition-base);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 191, 165, 0.4);
}

/* Responsive */
@media (max-width: 992px) {
  .hero-title {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: var(--capy-font-size-lg);
  }

  .section-title-student {
    font-size: 28px;
  }

  .calculator-content {
    grid-template-columns: 1fr;
  }

  .amount {
    font-size: 48px;
  }

  .benefit-card {
    margin-bottom: var(--capy-spacing-lg);
  }

  .step-description {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 500px;
    padding: var(--capy-spacing-xl) var(--capy-spacing-md);
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: var(--capy-font-size-base);
  }

  .hero-cta {
    width: 100%;
  }

  .section-title-student {
    font-size: 24px;
  }

  .calculator-card {
    margin: 0 var(--capy-spacing-md);
  }

  .calculator-content {
    padding: var(--capy-spacing-md);
    gap: var(--capy-spacing-lg);
  }

  .result-amount {
    flex-direction: column;
    gap: 0;
  }

  .amount {
    font-size: 40px;
  }

  .steps-container {
    padding: var(--capy-spacing-lg);
  }

  .custom-steps :deep(.el-step__description) {
    padding-right: 0;
  }

  .stat-number {
    font-size: 36px;
  }

  .cta-title {
    font-size: 24px;
  }

  .cta-button {
    width: 100%;
  }
}
</style>
