<template>
  <div class="orders-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">訂單記錄</h1>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <el-dropdown @command="handleSortChange" trigger="click">
        <el-button class="filter-btn">
          排序：{{ sortLabels[currentSort] }}
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="newest" :class="{ active: currentSort === 'newest' }">
              由新到舊
            </el-dropdown-item>
            <el-dropdown-item command="oldest" :class="{ active: currentSort === 'oldest' }">
              由舊到新
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown @command="handleStatusFilter" trigger="click">
        <el-button class="filter-btn">
          狀態：{{ statusLabels[currentStatus] }}
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="all" :class="{ active: currentStatus === 'all' }">
              全部狀態
            </el-dropdown-item>
            <el-dropdown-item command="paid" :class="{ active: currentStatus === 'paid' }">
              已付款
            </el-dropdown-item>
            <el-dropdown-item command="pending" :class="{ active: currentStatus === 'pending' }">
              待付款
            </el-dropdown-item>
            <el-dropdown-item command="failed" :class="{ active: currentStatus === 'failed' }">
              付款失敗
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <el-icon class="loading-icon" :size="60">
        <Loading />
      </el-icon>
      <p>載入訂單中...</p>
    </div>

    <!-- Empty State -->
    <el-empty
      v-else-if="allOrders.length === 0"
      description="尚無訂單記錄"
      :image-size="150"
    >
      <el-button type="primary" @click="goToExplore">
        開始購物
      </el-button>
    </el-empty>

    <!-- Orders List -->
    <div v-else class="orders-list">
      <div
        v-for="order in paginatedOrders"
        :key="order.id"
        class="order-card"
      >
        <!-- Order Header -->
        <div class="order-header">
          <div class="order-info">
            <span class="order-id">訂單編號：#{{ order.id }}</span>
            <span class="order-date">{{ formatDate(order.orderDate) }}</span>
          </div>
          <el-tag
            :type="getStatusType(order.status)"
            class="order-status"
          >
            {{ order.status.toUpperCase() }}
          </el-tag>
        </div>

        <!-- Order Items -->
        <div class="order-items">
          <div
            v-for="item in order.items"
            :key="item.courseId"
            class="order-item"
            @click="goToCourse(item.courseId)"
          >
            <img
              :src="item.cover"
              :alt="item.title"
              class="course-cover"
            />
            <div class="course-details">
              <h3 class="course-title">{{ item.title }}</h3>
              <p class="course-instructor">講師：{{ item.instructor }}</p>
            </div>
            <div class="course-price">
              NT$ {{ item.price.toFixed(2) }}
            </div>
          </div>
        </div>

        <!-- Order Footer -->
        <div class="order-footer">
          <div class="order-total">
            <span class="total-label">總金額：</span>
            <span class="total-amount">NT$ {{ order.totalAmount.toFixed(2) }}</span>
          </div>
          <div class="order-actions">
            <el-button
              v-if="order.transactionId"
              size="small"
              @click="viewReceipt(order)"
            >
              查看收據
            </el-button>
            <el-button
              v-if="order.status === 'pending'"
              type="primary"
              size="small"
              @click="proceedPayment(order)"
            >
              完成付款
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalElements > 0" class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="totalElements"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowDown, Loading } from '@element-plus/icons-vue'
import { getOrdersList } from '@/api/student/orders'

const router = useRouter()

// State
const currentSort = ref('newest')
const currentStatus = ref('all')
const currentPage = ref(1)
const pageSize = ref(5)
const loading = ref(false)
const allOrders = ref([])
const totalElements = ref(0)
const totalPages = ref(0)

const sortLabels = {
  newest: '由新到舊',
  oldest: '由舊到新'
}

const statusLabels = {
  all: '全部狀態',
  paid: '已付款',
  pending: '待付款',
  failed: '付款失敗'
}

// Computed
const filteredOrders = computed(() => {
  return allOrders.value
})

const paginatedOrders = computed(() => {
  return allOrders.value
})

// Methods
/**
 * 載入訂單列表
 */
const loadOrders = async () => {
  try {
    loading.value = true

    // 呼叫 API 取得訂單列表
    // 注意：currentPage 是 1-based，但 API 需要 0-based
    // 當狀態為 'all' 時，不傳遞 status 參數，讓後端回傳全部訂單
    const status = currentStatus.value === 'all' ? undefined : currentStatus.value
    const response = await getOrdersList(
      status,
      currentPage.value - 1,
      pageSize.value
    )

    // 後端回傳的資料在 data 欄位中
    const pageData = response.data || response

    if (pageData && pageData.content) {
      // 轉換後端欄位名稱為前端使用的名稱
      allOrders.value = pageData.content.map(order => ({
        id: order.orderId,
        orderDate: order.createdAt,
        status: order.status,
        totalAmount: typeof order.totalAmount === 'string'
          ? parseFloat(order.totalAmount)
          : order.totalAmount,
        transactionId: order.transactionId || null,
        items: order.items.map(item => ({
          courseId: item.courseId,
          title: item.courseTitle,
          instructor: item.instructorName,
          cover: item.coverImageUrl,
          price: item.price
        }))
      }))

      totalElements.value = pageData.totalElements
      totalPages.value = pageData.totalPages
    } else {
      allOrders.value = []
      totalElements.value = 0
      totalPages.value = 0
    }

  } catch (error) {
    console.error('載入訂單失敗:', error)

    if (error.response) {
      ElMessage.error(error.response.data?.message || '載入訂單失敗，請稍後再試')
    } else {
      ElMessage.error('載入訂單失敗，請稍後再試')
    }

    allOrders.value = []
    totalElements.value = 0
    totalPages.value = 0
  } finally {
    loading.value = false
  }
}

const handleSortChange = (command) => {
  currentSort.value = command
  currentPage.value = 1
  loadOrders()
}

const handleStatusFilter = (command) => {
  currentStatus.value = command
  currentPage.value = 1
  loadOrders()
}

const handlePageChange = () => {
  loadOrders()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const getStatusType = (status) => {
  const types = {
    paid: 'success',
    pending: 'warning',
    failed: 'danger'
  }
  return types[status] || 'info'
}

const goToCourse = (courseId) => {
  router.push(`/courses/${courseId}`)
}

const goToExplore = () => {
  router.push('/explore')
}

const viewReceipt = (order) => {
  console.log('查看收據，訂單 ID:', order.id)
  // TODO: 實際應該打開收據頁面或下載 PDF
  ElMessage.info('收據功能開發中')
}

const proceedPayment = async (order) => {
  console.log('重新付款，訂單 ID:', order.id)
  try {
    ElMessage.info('正在準備付款頁面...')
    const { getOrderDetails, getEcpayCheckout } = await import('@/api/student/orders')

    // 取得 ECPay 付款資訊
    const ecpayResponse = await getEcpayCheckout(order.id)
    const ecpayData = ecpayResponse.data || ecpayResponse

    if (!ecpayData || !ecpayData.actionUrl || !ecpayData.formFields) {
      throw new Error('付款資訊取得失敗')
    }

    // 動態建立並提交表單到 ECPay
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = ecpayData.actionUrl
    form.style.display = 'none'

    Object.entries(ecpayData.formFields).forEach(([key, value]) => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      input.value = value
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()
  } catch (error) {
    console.error('重新付款失敗:', error)
    ElMessage.error('重新付款失敗，請稍後再試')
  }
}

// Lifecycle
onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.orders-page {
  padding: 0;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
}

.loading-icon {
  color: #4CAF50;
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

.loading-state p {
  margin-top: 16px;
  font-size: 16px;
  color: #666;
}

/* Header */
.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* Filters */
.filters-section {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.filter-btn {
  background: white;
  border: 1px solid #e0e0e0;
  color: #333;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.filter-btn:hover {
  border-color: #4CAF50;
  color: #4CAF50;
}

:deep(.el-dropdown-menu__item) {
  padding: 10px 20px;
  font-size: 14px;
}

:deep(.el-dropdown-menu__item.active) {
  color: #4CAF50;
  font-weight: 600;
}

:deep(.el-dropdown-menu__item:hover) {
  background: #f5f5f5;
}

/* Orders List */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

.order-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Order Header */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-id {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.order-date {
  font-size: 12px;
  color: #666;
}

.order-status {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
}

/* Order Items */
.order-items {
  padding: 16px 20px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.order-item:hover {
  background: #f8f9fa;
}

.order-item + .order-item {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.course-cover {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.course-details {
  flex: 1;
  min-width: 0;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-instructor {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.course-price {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  flex-shrink: 0;
}

/* Order Footer */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
}

.order-total {
  display: flex;
  align-items: center;
  gap: 12px;
}

.total-label {
  font-size: 14px;
  color: #666;
}

.total-amount {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.order-actions {
  display: flex;
  gap: 8px;
}

:deep(.el-button--small) {
  padding: 8px 16px;
  font-size: 13px;
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

:deep(.el-pagination) {
  gap: 8px;
}

:deep(.el-pagination button),
:deep(.el-pager li) {
  min-width: 36px;
  height: 36px;
  line-height: 36px;
  border-radius: 6px;
  font-weight: 500;
}

:deep(.el-pager li.is-active) {
  background: #1a1a1a;
  color: white;
}

:deep(.el-pager li:hover) {
  color: #4CAF50;
}

/* Empty State */
:deep(.el-empty) {
  padding: 60px 0;
}

:deep(.el-button--primary) {
  background: #4CAF50;
  border-color: #4CAF50;
}

:deep(.el-button--primary:hover) {
  background: #45a049;
  border-color: #45a049;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 22px;
  }

  .filters-section {
    flex-direction: column;
  }

  .order-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .course-cover {
    width: 100%;
    height: 160px;
  }

  .course-price {
    align-self: flex-end;
  }

  .order-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .order-total {
    justify-content: space-between;
  }

  .order-actions {
    width: 100%;
  }

  .order-actions .el-button {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 20px;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .course-title {
    font-size: 14px;
  }

  .course-instructor {
    font-size: 12px;
  }
}
</style>
