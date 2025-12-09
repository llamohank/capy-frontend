<template>
  <div class="success-page">
    <!-- Main Content -->
    <div class="success-content">
      <div class="content-wrapper">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <el-icon class="loading-icon" :size="60">
            <Loading />
          </el-icon>
          <p class="loading-text">正在載入訂單資訊...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <el-icon class="error-icon" :size="80" color="var(--capy-danger)">
            <CircleClose />
          </el-icon>
          <h2 class="error-title">載入失敗</h2>
          <p class="error-message">{{ errorMessage }}</p>
          <div class="error-actions">
            <el-button type="primary" @click="retryLoad">
              重試
            </el-button>
            <el-button @click="goToOrders">
              查看我的訂單
            </el-button>
          </div>
        </div>

        <!-- Success State -->
        <div v-else-if="orderData" class="success-state">
          <!-- Success Icon -->
          <div class="success-icon-wrapper">
            <el-icon class="success-icon" :size="80" color="var(--capy-success)">
              <CircleCheck />
            </el-icon>
          </div>

          <!-- Success Message -->
          <h1 class="success-title">付款成功！</h1>
          <p class="success-subtitle">感謝您的購買，您已成功購買以下課程</p>

          <!-- Order Info Card -->
          <div class="order-info-card">
            <div class="order-info-row">
              <span class="info-label">訂單編號</span>
              <span class="info-value">#{{ orderData.orderId }}</span>
            </div>
            <div class="order-info-row">
              <span class="info-label">付款時間</span>
              <span class="info-value">{{ formatDateTime(orderData.paidAt) }}</span>
            </div>
            <div class="order-info-row">
              <span class="info-label">付款金額</span>
              <span class="info-value amount">{{ formatAmount(orderData.totalAmount) }}</span>
            </div>
          </div>

          <!-- Purchased Courses -->
          <div class="courses-section">
            <h2 class="section-title-student">已購買課程</h2>
            <div class="courses-list">
              <div
                v-for="item in orderData.items"
                :key="item.courseId"
                class="course-card"
                @click="goToCourse(item.courseId)"
              >
                <div class="course-image">
                  <el-image
                    :src="item.coverImageUrl"
                    fit="cover"
                    class="course-cover"
                  >
                    <template #error>
                      <div class="image-error">
                        <el-icon><Picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                </div>
                <div class="course-info">
                  <h3 class="course-title">{{ item.courseTitle }}</h3>
                  <p class="course-instructor">講師：{{ item.instructorName }}</p>
                  <p class="course-price">NT$ {{ item.price.toLocaleString('zh-TW') }}</p>
                </div>
                <div class="course-action">
                  <el-button type="primary" size="small">
                    開始學習
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <el-button class="golearn" size="large" @click="goToMyLearning">
              前往我的學習
            </el-button>
            <el-button size="large" @click="goToExplore">
              繼續探索課程
            </el-button>
            <el-button text size="large" @click="goToOrders">
              查看訂單記錄
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Reading,
  CircleCheck,
  CircleClose,
  Loading,
  Picture
} from '@element-plus/icons-vue'
import { getOrderSuccess } from '@/api/student/orders'

// ==================== Composables ====================

const router = useRouter()
const route = useRoute()

// ==================== State ====================

/**
 * 載入狀態
 */
const loading = ref(true)

/**
 * 錯誤狀態
 */
const error = ref(false)

/**
 * 錯誤訊息
 */
const errorMessage = ref('')

/**
 * 訂單資料
 */
const orderData = ref(null)

// ==================== Methods ====================

/**
 * 載入訂單成功資料
 */
const loadOrderSuccess = async () => {
  try {
    loading.value = true
    error.value = false

    // 從 URL 參數取得 orderId（同時支援駝峰式 orderId 和小寫 orderid）
    const orderId = route.query.orderId || route.query.orderid || route.params.orderId || route.params.orderid

    if (!orderId) {
      throw new Error('訂單編號不存在')
    }

    console.log('載入訂單成功資料，訂單 ID:', orderId)

    // 呼叫 API 取得訂單成功資料
    const response = await getOrderSuccess(orderId)

    // 後端回傳的資料在 data 欄位中
    orderData.value = response.data || response

    if (!orderData.value) {
      throw new Error('訂單資料載入失敗')
    }

    console.log('訂單成功資料:', orderData.value)

  } catch (err) {
    console.error('載入訂單失敗:', err)
    error.value = true

    if (err.response) {
      errorMessage.value = err.response.data?.message || '訂單資料載入失敗，請稍後再試'
    } else if (err.message) {
      errorMessage.value = err.message
    } else {
      errorMessage.value = '訂單資料載入失敗，請稍後再試'
    }
  } finally {
    loading.value = false
  }
}

/**
 * 重試載入
 */
const retryLoad = () => {
  loadOrderSuccess()
}

/**
 * 格式化日期時間
 */
const formatDateTime = (dateString) => {
  if (!dateString) return '-'

  const date = new Date(dateString)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

/**
 * 格式化金額
 */
const formatAmount = (amount) => {
  if (!amount) return 'NT$ 0'

  // 如果是字串（BigDecimal），轉換為數字
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return `NT$ ${numAmount.toLocaleString('zh-TW')}`
}

/**
 * 前往課程詳情頁
 */
const goToCourse = (courseId) => {
  router.push(`/courses/${courseId}`)
}

/**
 * 前往我的學習
 */
const goToMyLearning = () => {
  router.push({ name: 'MyLearning' })
}

/**
 * 前往訂單記錄
 */
const goToOrders = () => {
  router.push({ name: 'Orders' })
}

/**
 * 前往探索課程
 */
const goToExplore = () => {
  router.push({ name: 'courseExplore' })
}

// ==================== Lifecycle ====================

onMounted(() => {
  loadOrderSuccess()
})
</script>

<style scoped>
/* ==================== 頁面容器 ==================== */

.success-page {
  min-height: 100vh;
  background-color: var(--capy-bg-base);
  display: flex;
  flex-direction: column;
}

/* ==================== Header ==================== */

.success-header {
  background-color: var(--capy-bg-surface);
  border-bottom: 1px solid var(--capy-border-lighter);
  padding: var(--capy-spacing-md) 0;
  box-shadow: var(--capy-shadow-sm);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--capy-spacing-lg);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-sm);
  text-decoration: none;
  transition: opacity var(--capy-transition-fast);
}

.logo:hover {
  opacity: 0.8;
}

.logo-text {
  font-size: var(--capy-font-size-xl);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-primary);
}

/* ==================== Main Content ==================== */

.success-content {
  flex: 1;
  padding: var(--capy-spacing-xxl) 0;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 var(--capy-spacing-lg);
}

/* ==================== Loading State ==================== */

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--capy-spacing-xxl) 0;
  text-align: center;
}

.loading-icon {
  color: var(--capy-primary);
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

.loading-text {
  margin-top: var(--capy-spacing-lg);
  font-size: var(--capy-font-size-lg);
  color: var(--capy-text-secondary);
}

/* ==================== Error State ==================== */

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--capy-spacing-xxl) 0;
  text-align: center;
}

.error-icon {
  margin-bottom: var(--capy-spacing-lg);
}

.error-title {
  font-size: var(--capy-font-size-xxl);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-md) 0;
}

.error-message {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  margin: 0 0 var(--capy-spacing-xl) 0;
}

.error-actions {
  display: flex;
  gap: var(--capy-spacing-md);
  justify-content: center;
}

/* ==================== Success State ==================== */

.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-icon-wrapper {
  margin-bottom: var(--capy-spacing-lg);
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.success-title {
  font-size: 32px;
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-sm) 0;
  text-align: center;
}

.success-subtitle {
  font-size: var(--capy-font-size-lg);
  color: var(--capy-text-secondary);
  margin: 0 0 var(--capy-spacing-xl) 0;
  text-align: center;
}

/* ==================== Order Info Card ==================== */

.order-info-card {
  width: 100%;
  background-color: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  padding: var(--capy-spacing-lg);
  margin-bottom: var(--capy-spacing-xl);
  box-shadow: var(--capy-shadow-sm);
  border: 1px solid var(--capy-border-lighter);
}

.order-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--capy-spacing-md) 0;
  border-bottom: 1px solid var(--capy-border-lighter);
}

.order-info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
}

.info-value {
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
}

.info-value.amount {
  font-size: 20px;
  font-weight: 700;
  font-family: monospace, sans-serif;
  color: var(--capy-text-primary);
}

/* ==================== Courses Section ==================== */

.courses-section {
  width: 100%;
  margin-bottom: var(--capy-spacing-xl);
}

.section-title-student {
  font-size: var(--capy-font-size-xl);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-lg) 0;
}

.courses-list {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-md);
}

.course-card {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-md);
  padding: var(--capy-spacing-md);
  background-color: var(--capy-bg-surface);
  border-radius: var(--capy-radius-md);
  border: 1px solid var(--capy-border-lighter);
  cursor: pointer;
  transition: all var(--capy-transition-fast);
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--capy-shadow-md);
  border-color: var(--capy-primary);
  background-color: var(--el-color-primary-light-9);
}

.course-image {
  flex-shrink: 0;
  width: 160px;
  aspect-ratio: 16/9;
  border-radius: var(--capy-radius-sm);
  overflow: hidden;
  background-color: var(--capy-bg-base);
}

.course-cover {
  width: 100%;
  height: 100%;
}

.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--capy-bg-base);
  color: var(--capy-text-placeholder);
}

.course-info {
  flex: 1;
  min-width: 0;
}

.course-title {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-xs) 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.course-instructor {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
  margin: 0 0 var(--capy-spacing-xs) 0;
}

.course-price {
  font-size: var(--capy-font-size-base);
  font-weight: 700;
  font-family: monospace, sans-serif;
  color: var(--capy-text-primary);
  margin: 0;
}

.course-action {
  flex-shrink: 0;
}

/* ==================== Action Buttons ==================== */

.action-buttons {
  display: flex;
  gap: var(--capy-spacing-md);
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
}
.golearn {
  color: white;
  background-color: var(--capy-primary);

}

.action-buttons .el-button {

  min-width: 150px;
}

/* ==================== 響應式設計 ==================== */

@media (max-width: 768px) {
  .success-content {
    padding: var(--capy-spacing-lg) 0;
  }

  .content-wrapper {
    padding: 0 var(--capy-spacing-md);
  }

  .success-title {
    font-size: 24px;
  }

  .success-subtitle {
    font-size: var(--capy-font-size-base);
  }

  .course-card {
    flex-direction: column;
    align-items: stretch;
  }

  .course-image {
    width: 100%;
    aspect-ratio: 16/9;
  }

  .course-action {
    width: 100%;
  }

  .course-action .el-button {
    width: 100%;
  }

  .action-buttons {
    flex-direction: column;
    gap: var(--capy-spacing-md);
  }

  .action-buttons .el-button {
    width: 100%;
  }
}
</style>
