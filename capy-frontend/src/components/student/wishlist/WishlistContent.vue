<template>
  <div class="wishlist-content-container">
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
          :class="['wishlist-item', { 'is-disabled': !getItemState(item).canBuy }]"
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
            <!-- 根據狀態顯示不同內容 -->
            <div v-if="getItemState(item).type === 'ENROLLED'" class="item-status enrolled">
              已購買
            </div>
            <div v-else-if="getItemState(item).type === 'UNAVAILABLE'" class="item-status unavailable">
              已下架
            </div>
            <div v-else class="item-price">{{ wishlistStore.formatPrice(item.price) }}</div>
          </div>

          <!-- 加入購物車按鈕 (只在正常狀態顯示) -->
          <div v-if="getItemState(item).type === 'NORMAL'" class="item-action">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star, ShoppingCart, Picture, Loading } from '@element-plus/icons-vue'
import { useWishlistStore } from '@/stores/wishlist'
import { useUserStore } from '@/stores/user'
import { getItemState } from '@/composable/useCourseState.js'

const router = useRouter()
const wishlistStore = useWishlistStore()
const userStore = useUserStore()

const loading = ref(false)
const emit = defineEmits(['close'])

/**
 * 將項目加入購物車
 */
const handleAddToCart = async (courseId) => {
  const success = await wishlistStore.moveToCart(courseId)
  if (success && userStore.isAuthenticated) {
    await loadRecentWishlist()
  }
}

/**
 * 前往完整願望清單頁面
 */
const handleViewAll = () => {
  emit('close')
  router.push({ name: 'Wishlist' })
}

/**
 * 載入最近的願望清單項目
 */
const loadRecentWishlist = async () => {
  if (!userStore.isAuthenticated) {
    return
  }

  try {
    loading.value = true
    await wishlistStore.loadWishlistItems()
  } catch (error) {
    console.error('載入願望清單失敗:', error)
    ElMessage.error('載入願望清單失敗')
  } finally {
    loading.value = false
  }
}

// 元件掛載時載入資料
onMounted(() => {
  loadRecentWishlist()
})
</script>

<style scoped>
.wishlist-content-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.loading-state, .empty-wishlist {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--capy-spacing-xl) var(--capy-spacing-md);
  text-align: center;
}

.loading-text, .empty-text {
  margin-top: var(--capy-spacing-md);
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
}

.empty-icon {
  margin-bottom: var(--capy-spacing-md);
}

.wishlist-content {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-sm);
}

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

.wishlist-item.is-disabled {
  opacity: 0.6;
}

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

.item-status {
  font-size: var(--capy-font-size-xs);
  font-weight: var(--capy-font-weight-medium);
}

.item-status.enrolled {
  color: var(--el-color-success);
}

.item-status.unavailable {
  color: var(--el-color-danger);
}

.item-action {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.wishlist-footer {
  padding-top: var(--capy-spacing-sm);
  border-top: 1px solid var(--capy-border-lighter);
}

.view-all-button {
  width: 100%;
  font-size: var(--capy-font-size-sm);
  font-weight: var(--capy-font-weight-medium);
}

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
