<template>
  <el-popover
    v-model:visible="visible"
    placement="bottom"
    :width="300"
    trigger="click"
    popper-class="wishlist-popover"
  >
    <template #reference>
      <slot name="trigger">
        <el-button circle>
          <el-icon><Star /></el-icon>
        </el-button>
      </slot>
    </template>

    <!-- Popover 內容 -->
    <div class="wishlist-popover-content">
      <!-- Loading 狀態 -->
      <div v-if="loading" class="loading-state">
        <el-icon class="is-loading" :size="32" color="#409EFF">
          <Loading />
        </el-icon>
        <p class="loading-text">載入中...</p>
      </div>

      <!-- 空願望清單狀態 -->
      <div v-else-if="wishlistStore.items.length === 0" class="empty-wishlist">
        <div class="empty-icon">
          <el-icon :size="48" color="#C0C4CC">
            <Star />
          </el-icon>
        </div>
        <p class="empty-text">您的願望清單是空的</p>
      </div>

      <!-- 願望清單項目列表 -->
      <div v-else class="wishlist-content">
        <!-- 標題 -->
        <div class="wishlist-header">
          <h4>最近加入</h4>
        </div>

        <!-- 項目列表 -->
        <div class="wishlist-items">
          <div
            v-for="item in wishlistStore.recentItems"
            :key="item.courseId"
            class="wishlist-item"
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
              <h5 class="item-title">{{ item.title }}</h5>
              <div class="item-price">{{ wishlistStore.formatPrice(item.price) }}</div>
            </div>

            <!-- 加入購物車按鈕 -->
            <div class="item-action">
              <el-button
                type="primary"
                :icon="ShoppingCart"
                circle
                size="small"
                @click="handleAddToCart(item.courseId)"
              />
            </div>
          </div>
        </div>

        <!-- 底部按鈕 -->
        <div class="wishlist-footer">
          <el-button
            type="primary"
            class="view-all-button"
            @click="handleViewAll"
          >
            前往我的願望清單
          </el-button>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star, ShoppingCart, Picture, Loading } from '@element-plus/icons-vue'
import { useWishlistStore } from '@/stores/wishlist'
import { useUserStore } from '@/stores/user'

// ==================== Composables ====================

const router = useRouter()
const wishlistStore = useWishlistStore()
const userStore = useUserStore()

// ==================== State ====================

const visible = ref(false)
const loading = ref(false)

// ==================== Methods ====================

/**
 * 將項目加入購物車
 */
const handleAddToCart = async (courseId) => {
  // 等待 moveToCart 完成（它會處理所有訊息顯示）
  const success = await wishlistStore.moveToCart(courseId)

  // moveToCart 內部的 cartStore.addItem 已經會顯示適當的訊息
  // 所以這裡不需要再顯示訊息，只需要在成功時重新載入願望清單
  if (success && userStore.isAuthenticated) {
    await loadRecentWishlist()
  }
}

/**
 * 前往完整願望清單頁面
 */
const handleViewAll = () => {
  visible.value = false
  router.push({ name: 'Wishlist' })
}

/**
 * 關閉 Popover
 */
const closePopover = () => {
  visible.value = false
}

/**
 * 載入最近的願望清單項目（用於 popover 顯示）
 * 使用簡版 API，避免覆蓋 WishlistPage 的完整資料
 */
const loadRecentWishlist = async () => {
  if (!userStore.isAuthenticated) {
    return
  }

  try {
    loading.value = true
    console.log('開始載入願望清單...')

    // 使用簡版 API，不會覆蓋其他頁面的完整資料
    await wishlistStore.loadWishlistItems()

    console.log('願望清單載入完成，項目數量:', wishlistStore.items.length)
    console.log('願望清單項目:', wishlistStore.items)
  } catch (error) {
    console.error('載入願望清單失敗:', error)
    ElMessage.error('載入願望清單失敗')
  } finally {
    loading.value = false
  }
}

// ==================== Lifecycle ====================

// 載入願望清單資料
onMounted(() => {
  // 只從 localStorage 載入（快速顯示，不呼叫 API）
  wishlistStore.loadFromStorage()
})

// 監聽 popover 開啟，載入最新資料
watch(visible, async (newVal) => {
  // 只在 popover 開啟時載入
  if (newVal && userStore.isAuthenticated) {
    await loadRecentWishlist()
  }
})
</script>

<style scoped>
/* ==================== Popover 內容 ==================== */

.wishlist-popover-content {
  max-height: 500px;
  display: flex;
  flex-direction: column;
}

/* ==================== Loading 狀態 ==================== */

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--capy-spacing-xl) var(--capy-spacing-md);
  text-align: center;
}

.loading-text {
  margin-top: var(--capy-spacing-md);
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
}

/* ==================== 空願望清單狀態 ==================== */

.empty-wishlist {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--capy-spacing-xl) var(--capy-spacing-md);
  text-align: center;
}

.empty-icon {
  margin-bottom: var(--capy-spacing-md);
}

.empty-text {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  margin: 0;
}

/* ==================== 願望清單內容 ==================== */

.wishlist-content {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-sm);
}

/* 標題 */
.wishlist-header {
  padding: var(--capy-spacing-sm) 0;
  border-bottom: 1px solid var(--capy-border-lighter);
}

.wishlist-header h4 {
  margin: 0;
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
}

/* 項目列表 */
.wishlist-items {
  max-height: 350px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-xs);
}

.wishlist-item {
  display: flex;
  gap: var(--capy-spacing-sm);
  padding: var(--capy-spacing-sm);
  border-radius: var(--capy-radius-sm);
  transition: background-color var(--capy-transition-fast);
  cursor: pointer;
}

.wishlist-item:hover {
  background-color: var(--capy-bg-elevated);
}

/* 課程縮圖 */
.item-thumbnail {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
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
  gap: 2px;
}

.item-title {
  font-size: var(--capy-font-size-sm);
  font-weight: var(--capy-font-weight-medium);
  color: var(--capy-text-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price {
  font-size: var(--capy-font-size-xs);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-primary);
}

/* 操作按鈕 */
.item-action {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

/* 底部 */
.wishlist-footer {
  padding-top: var(--capy-spacing-sm);
  border-top: 1px solid var(--capy-border-lighter);
}

.view-all-button {
  width: 100%;
  font-size: var(--capy-font-size-sm);
  font-weight: var(--capy-font-weight-medium);
}

/* ==================== 滾動條樣式 ==================== */

.wishlist-items::-webkit-scrollbar {
  width: 6px;
}

.wishlist-items::-webkit-scrollbar-track {
  background: var(--capy-bg-base);
  border-radius: 3px;
}

.wishlist-items::-webkit-scrollbar-thumb {
  background: var(--capy-border-base);
  border-radius: 3px;
}

.wishlist-items::-webkit-scrollbar-thumb:hover {
  background: var(--capy-text-placeholder);
}
</style>

<style>
/* ==================== Popover 全局樣式 ==================== */

.wishlist-popover.el-popper {
  padding: var(--capy-spacing-md) !important;
}
</style>
