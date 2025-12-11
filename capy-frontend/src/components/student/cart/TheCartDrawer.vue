<template>
  <el-drawer
    v-model="visible"
    title="購物車"
    direction="rtl"
    size="400px"
    :before-close="handleClose"
  >
    <!-- 購物車內容 -->
    <div class="cart-drawer-content">
      <!-- 空購物車狀態 -->
      <div v-if="cartStore.isEmpty" class="empty-cart">
        <div class="empty-image">
          <el-icon :size="80" color="#C0C4CC">
            <ShoppingCart />
          </el-icon>
        </div>
        <p class="empty-text">您的購物車是空的</p>
        <p class="empty-hint">快去探索課程吧！</p>
        <el-button type="primary" @click="goToExplore">
          探索課程
        </el-button>
      </div>

      <!-- 購物車項目列表 -->
      <div v-else class="cart-items">
        <div
          v-for="item in cartStore.items"
          :key="item.courseId"
          class="cart-item"
        >
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
            <h4 class="item-title">{{ item.title }}</h4>
            <p class="item-instructor">{{ item.instructor }}</p>
          </div>

          <!-- 價格和操作按鈕 -->
          <div class="item-actions">
            <div class="item-price">{{ cartStore.formatPrice(item.price) }}</div>
            <div class="action-buttons">
              <el-button
                type="danger"
                :icon="Delete"
                circle
                size="small"
                @click="handleRemoveItem(item.courseId)"
                title="移除"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 購物車底部 -->
    <template #footer>
      <div v-if="!cartStore.isEmpty" class="cart-footer">
        <!-- 小計 -->
        <div class="footer-subtotal">
          <span class="subtotal-label">小計：</span>
          <span class="subtotal-amount">{{ cartStore.formattedTotalPrice }}</span>
        </div>

        <!-- 結帳按鈕 -->
        <el-button
          type="primary"
          size="large"
          class="checkout-button"
          @click="handleCheckout"
        >
          前往結帳
        </el-button>
      </div>
    </template>
  </el-drawer>

  <!-- 移除確認對話框 -->
  <el-dialog
    v-model="dialogVisible"
    title="移除課程"
    width="400px"
    :before-close="handleCloseDialog"
    class="remove-course-dialog"
  >
    <div class="dialog-content">
      <p class="dialog-message">您想要如何處理這門課程？</p>

      <div class="dialog-actions">
        <!-- 移至願望清單按鈕 -->
        <el-button
          type="primary"
          class="action-button wishlist-button"
          @click="handleMoveToWishlist"
        >
          <el-icon class="button-icon">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z"/>
            </svg>
          </el-icon>
          <span>移至願望清單</span>
        </el-button>

        <!-- 直接刪除按鈕 -->
        <el-button
          type="danger"
          class="action-button delete-button"
          @click="handleDirectRemove"
        >
          <el-icon class="button-icon">
            <Delete />
          </el-icon>
          <span>直接刪除</span>
        </el-button>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleCloseDialog">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ShoppingCart, Delete, Picture } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'

// ==================== Props & Emits ====================

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

// ==================== Composables ====================

const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

// ==================== State ====================

const visible = ref(props.modelValue)
const dialogVisible = ref(false)
const currentRemovingCourseId = ref(null)

// ==================== Watchers ====================

// 同步 v-model
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
})

watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
})

// 監聽購物車變化並儲存
watch(() => cartStore.items, () => {
  cartStore.saveToStorage()
}, { deep: true })

// ==================== Methods ====================

/**
 * 處理關閉抽屜
 */
const handleClose = (done) => {
  done()
}

/**
 * 前往探索頁面
 */
const goToExplore = () => {
  visible.value = false
  router.push({ name: 'courseExplore' })
}

/**
 * 開啟移除確認對話框
 */
const handleRemoveItem = (courseId) => {
  currentRemovingCourseId.value = courseId
  dialogVisible.value = true
}

/**
 * 移至願望清單
 */
const handleMoveToWishlist = async () => {
  if (!currentRemovingCourseId.value) return

  try {
    // 找到購物車中的課程資訊
    const item = cartStore.items.find(item => item.courseId === currentRemovingCourseId.value)

    if (!item) {
      ElMessage.error('找不到課程資訊')
      return
    }

    // 加入願望清單
    const added = await wishlistStore.addItem({
      id: item.courseId,
      title: item.title,
      instructor: item.instructor,
      price: item.price,
      cover_image_url: item.coverImageUrl
    })

    if (added) {
      // 從購物車移除（不顯示訊息，因為 wishlist.addItem 已經顯示了）
      await cartStore.removeItem(currentRemovingCourseId.value)
    }

    // 關閉對話框
    dialogVisible.value = false
    currentRemovingCourseId.value = null
  } catch (error) {
    console.error('移至願望清單失敗:', error)
  }
}

/**
 * 直接刪除
 */
const handleDirectRemove = async () => {
  if (!currentRemovingCourseId.value) return

  try {
    const success = await cartStore.removeItem(currentRemovingCourseId.value)

    if (success) {
      ElMessage.success('已從購物車移除')
    }

    // 關閉對話框
    dialogVisible.value = false
    currentRemovingCourseId.value = null
  } catch (error) {
    console.error('移除失敗:', error)
  }
}

/**
 * 關閉對話框
 */
const handleCloseDialog = () => {
  dialogVisible.value = false
  currentRemovingCourseId.value = null
}

/**
 * 前往結帳
 */
const handleCheckout = () => {
  visible.value = false
  router.push({ name: 'checkout' })
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
/* ==================== 抽屜內容 ==================== */

.cart-drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* ==================== 空購物車狀態 ==================== */

.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--capy-spacing-xl);
  text-align: center;
}

.empty-image {
  margin-bottom: var(--capy-spacing-lg);
}

.empty-text {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-medium);
  color: var(--capy-text-primary);
  margin-bottom: var(--capy-spacing-sm);
}

.empty-hint {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  margin-bottom: var(--capy-spacing-lg);
}

/* ==================== 購物車項目列表 ==================== */

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: var(--capy-spacing-md) 0;
}

.cart-item {
  display: flex;
  gap: var(--capy-spacing-md);
  padding: var(--capy-spacing-md);
  border-bottom: 1px solid var(--capy-border-lighter);
  transition: background-color var(--capy-transition-fast);
}

.cart-item:hover {
  background-color: var(--capy-bg-elevated);
}

/* 課程縮圖 */
.item-thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 60px;
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

/* 課程資訊 */
.item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-title {
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-medium);
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 價格和操作 */
.item-actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--capy-spacing-sm);
}

.item-price {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-primary);
  white-space: nowrap;
}

/* ==================== 購物車底部 ==================== */

.cart-footer {
  padding: var(--capy-spacing-md) 0;
  border-top: 2px solid var(--capy-border-base);
}

.footer-subtotal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--capy-spacing-md);
  padding: 0 var(--capy-spacing-sm);
}

.subtotal-label {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-medium);
  color: var(--capy-text-primary);
}

.subtotal-amount {
  font-size: var(--capy-font-size-xl);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-primary);
}

.checkout-button {
  width: 100%;
  height: 48px;
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  background-color: var(--capy-primary);
  border-color: var(--capy-primary);
}

.checkout-button:hover {
  background-color: var(--el-color-primary-dark-1);
  border-color: var(--el-color-primary-dark-1);
}

.checkout-button:active {
  background-color: var(--el-color-primary-dark-2);
  border-color: var(--el-color-primary-dark-2);
}

/* ==================== 響應式設計 ==================== */

@media (max-width: 768px) {
  .item-thumbnail {
    width: 60px;
    height: 45px;
  }

  .item-title {
    font-size: var(--capy-font-size-sm);
  }

  .item-price {
    font-size: var(--capy-font-size-base);
  }
}

/* ==================== 移除確認對話框樣式 ==================== */

.dialog-content {
  padding: var(--capy-spacing-md) 0;
}

.dialog-message {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  text-align: center;
  margin: 0 0 var(--capy-spacing-lg) 0;
}

.dialog-actions {
  display: flex;
  gap: var(--capy-spacing-md);
}

.action-button {
  flex: 1;
  height: 48px;
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-medium);
  border-radius: var(--capy-radius-base);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.button-icon {
  font-size: 18px;
}

/* 願望清單按鈕 - 使用品牌主色 */
.wishlist-button {
  background-color: var(--capy-primary);
  border-color: var(--capy-primary);
  color: white;
}

.wishlist-button:hover {
  background-color: #3db8de;
  border-color: #3db8de;
}

.wishlist-button:active {
  background-color: #2da3c9;
  border-color: #2da3c9;
}

/* 刪除按鈕 - 使用危險色 */
.delete-button {
  background-color: var(--capy-danger);
  border-color: var(--capy-danger);
  color: white;
}

.delete-button:hover {
  background-color: #f45454;
  border-color: #f45454;
}

.delete-button:active {
  background-color: #e03c3c;
  border-color: #e03c3c;
}

/* 對話框全局樣式 */
:deep(.remove-course-dialog) {
  border-radius: var(--capy-radius-lg);
}

:deep(.remove-course-dialog .el-dialog__header) {
  padding: var(--capy-spacing-lg);
  border-bottom: 1px solid var(--capy-border-lighter);
}

:deep(.remove-course-dialog .el-dialog__title) {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
}

:deep(.remove-course-dialog .el-dialog__body) {
  padding: var(--capy-spacing-lg);
}

:deep(.remove-course-dialog .el-dialog__footer) {
  padding: var(--capy-spacing-md) var(--capy-spacing-lg);
  border-top: 1px solid var(--capy-border-lighter);
}

/* 響應式 */
@media (max-width: 768px) {
  .dialog-actions {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
  }
}
</style>
