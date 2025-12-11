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

        <!-- Pending State (訂單處理中) -->
        <div v-else-if="orderStatus === 'pending'" class="pending-state">
          <el-icon class="pending-icon" :size="80" color="var(--capy-warning)">
            <Clock />
          </el-icon>
          <h2 class="pending-title">訂單處理中</h2>
          <p class="pending-message">
            您的付款正在處理中，請稍候...
          </p>
          <p class="pending-hint">
            訂單編號：#{{ currentOrderId }}
          </p>
          <p class="pending-polling" v-if="isPolling">
            <el-icon class="is-loading"><Loading /></el-icon>
            自動查詢中... ({{ pollingCount }}/{{ MAX_POLLING_ATTEMPTS }})
          </p>
          <div class="pending-actions">
            <el-button type="primary" @click="retryLoad" :loading="loading">
              重新查詢
            </el-button>
            <el-button @click="goToOrders">
              查看我的訂單
            </el-button>
          </div>
          <p class="pending-note">
            如果長時間未完成，請聯繫客服
          </p>
        </div>

        <!-- Failed State (付款失敗) -->
        <div v-else-if="orderStatus === 'failed'" class="failed-state">
          <el-icon class="failed-icon" :size="80" color="var(--capy-danger)">
            <CircleClose />
          </el-icon>
          <h2 class="failed-title">付款失敗</h2>
          <p class="failed-message">
            很抱歉，您的付款未能成功完成
          </p>
          <p class="failed-hint">
            訂單編號：#{{ currentOrderId }}
          </p>
          <div class="failed-actions">
            <el-button type="primary" @click="goToCheckout">
              重新付款
            </el-button>
            <el-button @click="goToOrders">
              查看訂單記錄
            </el-button>
          </div>
        </div>

        <!-- Error State (載入錯誤) -->
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

        <!-- Success State (付款成功) -->
        <div v-else-if="orderData && orderStatus === 'paid'" class="success-state">
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
              >
                <div class="course-image" @click="goToCourseDetail(item.courseId)">
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
                <div class="course-info" @click="goToCourseDetail(item.courseId)">
                  <h3 class="course-title">{{ item.courseTitle }}</h3>
                  <p class="course-instructor">講師：{{ item.instructorName }}</p>
                  <p class="course-price">NT$ {{ item.price.toLocaleString('zh-TW') }}</p>
                </div>
                <div class="course-action">
                  <el-button type="primary" size="small" @click="goToCourseLearning(item.courseId)">
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Reading,
  CircleCheck,
  CircleClose,
  Loading,
  Picture,
  Clock
} from '@element-plus/icons-vue'
import { getOrderSuccess, getOrderDetails } from '@/api/student/orders'

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

/**
 * 訂單狀態 (pending|paid|failed)
 */
const orderStatus = ref(null)

/**
 * 當前訂單 ID
 */
const currentOrderId = ref(null)

/**
 * 輪詢計時器
 */
const pollingInterval = ref(null)

/**
 * 輪詢次數
 */
const pollingCount = ref(0)

/**
 * 最大輪詢次數
 */
const MAX_POLLING_ATTEMPTS = 10

/**
 * 是否正在輪詢
 */
const isPolling = ref(false)

// ==================== Methods ====================

/**
 * 載入訂單資料（改進版：先檢查狀態）
 */
const loadOrderSuccess = async () => {
  try {
    loading.value = true
    error.value = false

    // 從 URL 參數取得 orderId
    const orderId = route.query.orderId || route.query.orderid ||
                    route.params.orderId || route.params.orderid

    if (!orderId) {
      throw new Error('訂單編號不存在')
    }

    currentOrderId.value = orderId
    console.log('載入訂單資料，訂單 ID:', orderId)

    // 步驟 1: 先呼叫 details API 檢查訂單狀態
    const detailsResponse = await getOrderDetails(orderId)
    const orderDetails = detailsResponse.data || detailsResponse

    if (!orderDetails) {
      throw new Error('訂單資料載入失敗')
    }

    orderStatus.value = orderDetails.status
    console.log('訂單狀態:', orderDetails.status)

    // 步驟 2: 根據訂單狀態決定顯示內容
    if (orderDetails.status === 'paid') {
      // 訂單已付款，呼叫 success API 取得完整資訊
      try {
        const successResponse = await getOrderSuccess(orderId)
        orderData.value = successResponse.data || successResponse
        console.log('訂單成功資料:', orderData.value)
      } catch (successErr) {
        // 如果 success API 失敗，使用 details 的資料
        console.warn('success API 失敗，使用 details 資料:', successErr)
        orderData.value = {
          orderId: orderDetails.orderId,
          paidAt: orderDetails.paidAt,
          totalAmount: orderDetails.totalAmount,
          items: orderDetails.orderItems
        }
      }
    } else if (orderDetails.status === 'pending') {
      // 訂單尚未完成付款，啟動輪詢
      console.log('訂單處理中，啟動輪詢機制')
      startPolling(orderId)
    } else if (orderDetails.status === 'failed') {
      // 付款失敗
      console.log('付款失敗')
    }

  } catch (err) {
    console.error('載入訂單失敗:', err)
    error.value = true

    if (err.response?.status === 500) {
      errorMessage.value = '訂單尚未完成付款處理，請稍後重新整理頁面或聯繫客服'
    } else if (err.response?.status === 404) {
      errorMessage.value = '找不到此訂單，請確認訂單編號是否正確'
    } else if (err.response) {
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
 * 啟動輪詢機制
 */
const startPolling = (orderId) => {
  // 清除現有的輪詢
  stopPolling()

  isPolling.value = true
  pollingCount.value = 0

  pollingInterval.value = setInterval(async () => {
    pollingCount.value++

    if (pollingCount.value >= MAX_POLLING_ATTEMPTS) {
      stopPolling()
      ElMessage.warning('訂單處理時間較長，請稍後到「我的訂單」查看或聯繫客服')
      return
    }

    try {
      console.log(`輪詢第 ${pollingCount.value} 次...`)
      const detailsResponse = await getOrderDetails(orderId)
      const orderDetails = detailsResponse.data || detailsResponse

      if (orderDetails.status === 'paid') {
        stopPolling()
        ElMessage.success('付款已完成！')
        // 重新載入成功資訊
        loadOrderSuccess()
      } else if (orderDetails.status === 'failed') {
        stopPolling()
        orderStatus.value = 'failed'
      }
    } catch (err) {
      console.error('輪詢失敗:', err)
    }
  }, 3000) // 每 3 秒查詢一次
}

/**
 * 停止輪詢
 */
const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
  isPolling.value = false
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
const goToCourseDetail = (courseId) => {
  router.push(`/courses/${courseId}`)
}

/**
 * 前往課程學習頁面
 * 剛購買的課程通常沒有進度，導向課程詳情頁讓用戶點擊「開始學習」
 * 這樣可以利用 CourseDetail 頁面的智能導航功能
 */
const goToCourseLearning = (courseId) => {
  // 導向課程詳情頁，讓用戶點擊「開始學習」按鈕
  // CourseDetail 頁面會自動處理導向第一個單元的邏輯
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

/**
 * 前往結帳頁
 */
const goToCheckout = () => {
  router.push({ name: 'checkout' })
}

// ==================== Lifecycle ====================

onMounted(() => {
  loadOrderSuccess()
})

onUnmounted(() => {
  stopPolling()
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

/* ==================== Pending State ==================== */

.pending-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--capy-spacing-xxl) 0;
  text-align: center;
}

.pending-icon {
  margin-bottom: var(--capy-spacing-lg);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pending-title {
  font-size: var(--capy-font-size-xxl);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-md) 0;
}

.pending-message {
  font-size: var(--capy-font-size-lg);
  color: var(--capy-text-secondary);
  margin: 0 0 var(--capy-spacing-sm) 0;
}

.pending-hint {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-tertiary);
  margin: 0 0 var(--capy-spacing-md) 0;
}

.pending-polling {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-xs);
  font-size: var(--capy-font-size-sm);
  color: var(--capy-primary);
  margin: 0 0 var(--capy-spacing-lg) 0;
}

.pending-actions {
  display: flex;
  gap: var(--capy-spacing-md);
  justify-content: center;
  margin-bottom: var(--capy-spacing-md);
}

.pending-note {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-tertiary);
  margin: 0;
}

/* ==================== Failed State ==================== */

.failed-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--capy-spacing-xxl) 0;
  text-align: center;
}

.failed-icon {
  margin-bottom: var(--capy-spacing-lg);
}

.failed-title {
  font-size: var(--capy-font-size-xxl);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-md) 0;
}

.failed-message {
  font-size: var(--capy-font-size-lg);
  color: var(--capy-text-secondary);
  margin: 0 0 var(--capy-spacing-sm) 0;
}

.failed-hint {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-tertiary);
  margin: 0 0 var(--capy-spacing-xl) 0;
}

.failed-actions {
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
