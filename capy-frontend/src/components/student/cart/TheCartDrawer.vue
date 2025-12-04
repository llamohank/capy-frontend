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

          <!-- 價格和刪除按鈕 -->
          <div class="item-actions">
            <div class="item-price">{{ cartStore.formatPrice(item.price) }}</div>
            <el-button
              type="danger"
              :icon="Delete"
              circle
              size="small"
              @click="handleRemoveItem(item.courseId)"
            />
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
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ShoppingCart, Delete, Picture } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'

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

// ==================== State ====================

const visible = ref(props.modelValue)

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
  router.push({ name: 'Explore' })
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

    const success = cartStore.removeItem(courseId)

    if (success) {
      ElMessage.success('已從購物車移除')
    } else {
      ElMessage.error('移除失敗')
    }
  } catch {
    // 使用者取消操作
  }
}

/**
 * 前往結帳
 */
const handleCheckout = () => {
  visible.value = false
  router.push({ name: 'checkout' })
}

// ==================== Lifecycle ====================

// 載入購物車資料
cartStore.loadFromStorage()
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
</style>
