<template>
  <div class="cart-page">
    <!-- 簡化版 Header -->
    <header class="cart-header">
      <div class="header-content">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <el-icon :size="24" color="var(--capy-primary)">
            <Reading />
          </el-icon>
          <span class="logo-text">CapyCourse</span>
        </router-link>

        <!-- 安全標示 -->
        <div class="secure-badge">
          <el-icon :size="16" color="var(--capy-text-secondary)">
            <Lock />
          </el-icon>
          <span>Secure Checkout</span>
        </div>
      </div>
    </header>

    <!-- 主要內容區 -->
    <div class="cart-content">
      <div class="content-wrapper">
        <!-- 左側：購物車項目 -->
        <div class="cart-items-section">
          <div class="section-header">
            <h2 class="section-title-student">購物車</h2>
            <span class="item-count">{{ cartStore.itemCount }} 個課程</span>
          </div>

          <!-- 空購物車狀態 -->
          <div v-if="cartStore.isEmpty" class="empty-cart">
            <el-icon :size="80" color="var(--capy-text-placeholder)">
              <ShoppingCart />
            </el-icon>
            <p class="empty-text">您的購物車是空的</p>
            <p class="empty-hint">快去探索精彩課程吧！</p>
            <el-button type="primary" size="large" @click="goToExplore">
              探索課程
            </el-button>
          </div>

          <!-- 購物車項目列表 -->
          <div v-else class="cart-items-list">
            <!-- 全選控制 -->
            <div class="select-all-row">
              <el-checkbox
                v-model="selectAll"
                :indeterminate="isIndeterminate"
                @change="handleSelectAll"
              >
                全選
              </el-checkbox>
            </div>

            <!-- 項目列表 -->
            <div
              v-for="item in cartStore.items"
              :key="item.courseId"
              class="cart-item"
            >
              <!-- 選擇框 -->
              <el-checkbox
                :model-value="isItemSelected(item.courseId)"
                @change="toggleItemSelection(item.courseId)"
                class="item-checkbox"
              />

              <!-- 課程縮圖 -->
              <div class="item-thumbnail">
                <el-image
                  :src="item.coverImageUrl"
                  fit="cover"
                  class="thumbnail-image"
                >
                  <template #error>
                    <div class="image-error">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
              </div>

              <!-- 課程資訊 -->
              <div class="item-info">
                <h3 class="item-title">{{ item.title }}</h3>
                <p class="item-instructor">講師：{{ item.instructor }}</p>
              </div>

              <!-- 價格 -->
              <div class="item-price">
                {{ cartStore.formatPrice(item.price) }}
              </div>

              <!-- 刪除按鈕 -->
              <el-button
                type="danger"
                :icon="Delete"
                circle
                class="delete-btn"
                @click="handleRemoveItem(item.courseId)"
              />
            </div>
          </div>
        </div>

        <!-- 右側：訂單摘要（Sticky） -->
        <div v-if="!cartStore.isEmpty" class="order-summary">
          <div class="summary-card">
            <h3 class="summary-title">訂單摘要</h3>

            <!-- 已選擇的項目列表 -->
            <div class="selected-items">
              <div
                v-for="item in selectedItems"
                :key="item.courseId"
                class="summary-item"
              >
                <div class="summary-item-thumbnail">
                  <el-image
                    :src="item.coverImageUrl"
                    fit="cover"
                    class="summary-thumbnail-image"
                  >
                    <template #error>
                      <div class="image-error-small">
                        <el-icon :size="12"><Picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                </div>
                <div class="summary-item-info">
                  <p class="summary-item-title">{{ item.title }}</p>
                  <p class="summary-item-price">{{ cartStore.formatPrice(item.price) }}</p>
                </div>
              </div>

              <!-- 無選擇提示 -->
              <div v-if="selectedItems.length === 0" class="no-selection">
                <el-icon :size="40" color="var(--capy-text-placeholder)">
                  <InfoFilled />
                </el-icon>
                <p>請選擇要結帳的課程</p>
              </div>
            </div>

            <!-- 分隔線 -->
            <el-divider />

            <!-- 總計 -->
            <div class="summary-total">
              <span class="total-label">總計</span>
              <span class="total-amount">{{ formattedSelectedTotal }}</span>
            </div>

            <!-- 結帳按鈕 -->
            <el-button
              type="primary"
              size="large"
              class="checkout-btn"
              :disabled="selectedItems.length === 0"
              :loading="isCheckingOut"
              @click="handleCheckout"
            >
              前往結帳
            </el-button>

            <!-- 信任標章 -->
            <div class="trust-badge">
              <el-icon :size="14" color="var(--capy-text-secondary)">
                <Lock />
              </el-icon>
              <span>Secured by ECPay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Reading,
  Lock,
  ShoppingCart,
  Delete,
  Picture,
  InfoFilled
} from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'

// ==================== Composables ====================

const router = useRouter()
const cartStore = useCartStore()

// ==================== State ====================

/**
 * 已選擇的課程 ID 列表
 */
const selectedItemIds = ref([])

/**
 * 是否正在結帳
 */
const isCheckingOut = ref(false)

// ==================== Computed ====================

/**
 * 全選狀態
 */
const selectAll = computed({
  get() {
    return selectedItemIds.value.length === cartStore.itemCount && cartStore.itemCount > 0
  },
  set(value) {
    if (value) {
      selectedItemIds.value = cartStore.items.map(item => item.courseId)
    } else {
      selectedItemIds.value = []
    }
  }
})

/**
 * 半選狀態（部分選中）
 */
const isIndeterminate = computed(() => {
  const selectedCount = selectedItemIds.value.length
  return selectedCount > 0 && selectedCount < cartStore.itemCount
})

/**
 * 已選擇的項目
 */
const selectedItems = computed(() => {
  return cartStore.items.filter(item =>
    selectedItemIds.value.includes(item.courseId)
  )
})

/**
 * 已選擇項目的總價
 */
const selectedTotal = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.price, 0)
})

/**
 * 格式化的總價
 */
const formattedSelectedTotal = computed(() => {
  return `NT$ ${selectedTotal.value.toLocaleString('zh-TW')}`
})

// ==================== Methods ====================

/**
 * 檢查項目是否被選中
 */
const isItemSelected = (courseId) => {
  return selectedItemIds.value.includes(courseId)
}

/**
 * 切換項目選擇狀態
 */
const toggleItemSelection = (courseId) => {
  const index = selectedItemIds.value.indexOf(courseId)
  if (index > -1) {
    selectedItemIds.value.splice(index, 1)
  } else {
    selectedItemIds.value.push(courseId)
  }
}

/**
 * 處理全選/取消全選
 */
const handleSelectAll = (value) => {
  if (value) {
    selectedItemIds.value = cartStore.items.map(item => item.courseId)
  } else {
    selectedItemIds.value = []
  }
}

/**
 * 移除購物車項目
 */
const handleRemoveItem = async (courseId) => {
  try {
    await ElMessageBox.confirm(
      '確定要從購物車中移除此課程嗎？',
      '確認移除',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // removeItem 現在是 async 函數，會呼叫後端 API
    const success = await cartStore.removeItem(courseId)

    if (success) {
      // 同時從選擇列表中移除
      const index = selectedItemIds.value.indexOf(courseId)
      if (index > -1) {
        selectedItemIds.value.splice(index, 1)
      }

      ElMessage.success('已從購物車移除')
    }
  } catch {
    // 使用者取消操作或 API 錯誤（API 錯誤已在 store 中處理）
  }
}

/**
 * 前往探索頁面
 */
const goToExplore = () => {
  router.push({ name: 'Explore' })
}

/**
 * 處理結帳
 */
const handleCheckout = async () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('請選擇要結帳的課程')
    return
  }

  try {
    isCheckingOut.value = true

    // 準備訂單資料
    const orderData = {
      courseIds: selectedItemIds.value,
      totalAmount: selectedTotal.value
    }

    // TODO: 呼叫 API POST /api/orders
    // const response = await fetch('/api/orders', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(orderData)
    // })

    // 模擬 API 呼叫
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('訂單資料:', orderData)

    ElMessage.success('訂單建立成功！')

    // 從購物車移除已結帳的項目
    for (const courseId of selectedItemIds.value) {
      await cartStore.removeItem(courseId)
    }

    // 清空選擇列表
    selectedItemIds.value = []

    // 導向訂單頁面
    router.push({ name: 'Orders' })
  } catch (error) {
    console.error('結帳失敗:', error)
    ElMessage.error('結帳失敗，請稍後再試')
  } finally {
    isCheckingOut.value = false
  }
}

// ==================== Lifecycle ====================

// 載入購物車資料 - 優先從後端載入，失敗則從 localStorage 載入
const loadCart = async () => {
  const success = await cartStore.fetchCartList()
  if (!success) {
    // 如果後端載入失敗，從 localStorage 載入
    cartStore.loadFromStorage()
  }
}

loadCart()
</script>

<style scoped>
/* ==================== 頁面容器 ==================== */

.cart-page {
  min-height: 100vh;
  background-color: var(--capy-bg-base);
  display: flex;
  flex-direction: column;
}

/* ==================== 簡化版 Header ==================== */

.cart-header {
  background-color: var(--capy-bg-surface);
  border-bottom: 1px solid var(--capy-border-lighter);
  padding: var(--capy-spacing-md) 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--capy-shadow-sm);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--capy-spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.secure-badge {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-xs);
  color: var(--capy-text-secondary);
  font-size: var(--capy-font-size-sm);
}

/* ==================== 主要內容區 ==================== */

.cart-content {
  flex: 1;
  padding: var(--capy-spacing-xl) 0;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--capy-spacing-lg);
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: var(--capy-spacing-xl);
  align-items: start;
}

/* ==================== 左側：購物車項目 ==================== */

.cart-items-section {
  background-color: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  padding: var(--capy-spacing-lg);
  box-shadow: var(--capy-shadow-sm);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--capy-spacing-lg);
  padding-bottom: var(--capy-spacing-md);
  border-bottom: 2px solid var(--capy-border-lighter);
}

.section-title-student{
  font-size: var(--capy-font-size-xxl);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
  margin: 0;
}

.item-count {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
}

/* 空購物車狀態 */
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--capy-spacing-xxl) var(--capy-spacing-xl);
  text-align: center;
}

.empty-text {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-medium);
  color: var(--capy-text-primary);
  margin: var(--capy-spacing-md) 0 var(--capy-spacing-xs) 0;
}

.empty-hint {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  margin: 0 0 var(--capy-spacing-lg) 0;
}

/* 全選控制 */
.select-all-row {
  padding: var(--capy-spacing-md);
  background-color: var(--capy-bg-elevated);
  border-radius: var(--capy-radius-sm);
  margin-bottom: var(--capy-spacing-md);
}

/* 購物車項目 */
.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-md);
}

.cart-item {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-md);
  padding: var(--capy-spacing-md);
  border: 1px solid var(--capy-border-lighter);
  border-radius: var(--capy-radius-md);
  transition: all var(--capy-transition-fast);
}

.cart-item:hover {
  border-color: var(--capy-primary);
  box-shadow: var(--capy-shadow-sm);
}

.item-checkbox {
  flex-shrink: 0;
}

.item-thumbnail {
  flex-shrink: 0;
  width: 120px;
  height: 80px;
  border-radius: var(--capy-radius-sm);
  overflow: hidden;
  background-color: var(--capy-bg-base);
}

.thumbnail-image {
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

.item-info {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-xs) 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.item-instructor {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
  margin: 0;
}

.item-price {
  flex-shrink: 0;
  font-size: var(--capy-font-size-xl);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-primary);
  margin-right: var(--capy-spacing-md);
}

.delete-btn {
  flex-shrink: 0;
}

/* ==================== 右側：訂單摘要 ==================== */

.order-summary {
  position: sticky;
  top: 100px;
}

.summary-card {
  background-color: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  padding: var(--capy-spacing-lg);
  box-shadow: var(--capy-shadow-md);
  border: 1px solid var(--capy-border-lighter);
}

.summary-title {
  font-size: var(--capy-font-size-xl);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-md) 0;
}

/* 已選擇的項目列表 */
.selected-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: var(--capy-spacing-md);
}

.summary-item {
  display: flex;
  gap: var(--capy-spacing-sm);
  padding: var(--capy-spacing-sm);
  border-radius: var(--capy-radius-sm);
  transition: background-color var(--capy-transition-fast);
}

.summary-item:hover {
  background-color: var(--capy-bg-elevated);
}

.summary-item-thumbnail {
  flex-shrink: 0;
  width: 60px;
  height: 40px;
  border-radius: var(--capy-radius-xs);
  overflow: hidden;
  background-color: var(--capy-bg-base);
}

.summary-thumbnail-image {
  width: 100%;
  height: 100%;
}

.image-error-small {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--capy-bg-base);
  color: var(--capy-text-placeholder);
}

.summary-item-info {
  flex: 1;
  min-width: 0;
}

.summary-item-title {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-xs) 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-item-price {
  font-size: var(--capy-font-size-sm);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-primary);
  margin: 0;
}

/* 無選擇提示 */
.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--capy-spacing-xl) var(--capy-spacing-md);
  text-align: center;
  color: var(--capy-text-secondary);
}

.no-selection p {
  margin: var(--capy-spacing-sm) 0 0 0;
  font-size: var(--capy-font-size-sm);
}

/* 總計 */
.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--capy-spacing-lg);
}

.total-label {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
}

.total-amount {
  font-size: var(--capy-font-size-xxl);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-primary);
}

/* 結帳按鈕 */
.checkout-btn {
  width: 100%;
  height: 50px;
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  background-color: var(--capy-primary);
  border-color: var(--capy-primary);
  margin-bottom: var(--capy-spacing-md);
}

.checkout-btn:hover:not(:disabled) {
  background-color: var(--el-color-primary-dark-1);
  border-color: var(--el-color-primary-dark-1);
}

.checkout-btn:active:not(:disabled) {
  background-color: var(--el-color-primary-dark-2);
  border-color: var(--el-color-primary-dark-2);
}

/* 信任標章 */
.trust-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--capy-spacing-xs);
  color: var(--capy-text-secondary);
  font-size: var(--capy-font-size-xs);
}

/* ==================== 響應式設計 ==================== */

@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-header {
    padding: var(--capy-spacing-sm) 0;
  }

  .header-content {
    padding: 0 var(--capy-spacing-md);
  }

  .logo-text {
    font-size: var(--capy-font-size-lg);
  }

  .cart-content {
    padding: var(--capy-spacing-lg) 0;
  }

  .content-wrapper {
    padding: 0 var(--capy-spacing-md);
  }

  .cart-items-section {
    padding: var(--capy-spacing-md);
  }

  .section-title-student {
    font-size: var(--capy-font-size-xl);
  }

  .cart-item {
    flex-wrap: wrap;
  }

  .item-thumbnail {
    width: 100px;
    height: 67px;
  }

  .item-info {
    flex-basis: 100%;
    order: 3;
    margin-top: var(--capy-spacing-sm);
  }

  .item-price {
    margin-right: var(--capy-spacing-sm);
  }

  .summary-card {
    padding: var(--capy-spacing-md);
  }
}
</style>
