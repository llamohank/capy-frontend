<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation } from 'swiper/modules'
import { TrophyBase, ShoppingCart } from '@element-plus/icons-vue'
import { useWishlistStore } from '@/stores/wishlist'
import { ElMessage } from 'element-plus'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const router = useRouter()
const modules = [Autoplay, Navigation]
const wishlistStore = useWishlistStore()

// 接收從父組件傳來的課程資料
const props = defineProps({
  courses: {
    type: Array,
    default: () => []
  }
})

// 後端返回的格式已經是熱門課程，直接使用
const displayCourses = computed(() => props.courses)

const goToCourse = (id) => {
  router.push(`/courses/${id}`)
}

/**
 * 點擊標籤跳轉到 Explore 頁面進行搜尋
 */
const handleTagClick = (event, tagName) => {
  event.stopPropagation() // 防止觸發卡片點擊事件
  router.push({
    path: '/explore',
    query: { keyword: tagName }
  })
}

const formatPrice = (price) => {
  return price.toLocaleString('zh-TW')
}

const formatCount = (count) => {
  if (count == null) {
    return '0'
  }

  const num = Number(count)
  if (Number.isNaN(num)) {
    return String(count)
  }

  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

/**
 * 切換願望清單狀態
 */
const toggleWishlist = async (event, courseId) => {
  event.stopPropagation() // 防止觸發卡片點擊事件

  try {
    const course = props.courses.find(c => c.id === courseId)
    if (!course) {
      console.error('找不到課程:', courseId)
      return
    }

    // 檢查是否已在願望清單中
    const isInWishlist = wishlistStore.hasItem(courseId)

    if (isInWishlist) {
      // 從願望清單移除（store 內部會顯示訊息）
      await wishlistStore.removeItem(courseId)
    } else {
      // 加入願望清單（store 內部會顯示訊息）
      await wishlistStore.addItem({
        id: course.id,
        title: course.title,
        instructor: course.instructorName,
        price: course.price,
        cover_image_url: course.coverImageUrl
      })
    }
  } catch (error) {
    console.error('切換願望清單失敗:', error)
    // 只在發生錯誤時顯示訊息
    ElMessage.error('操作失敗，請稍後再試')
  }
}

/**
 * 檢查課程是否在願望清單中
 */
const isInWishlist = (courseId) => {
  return wishlistStore.hasItem(courseId)
}
</script>

<template>
  <swiper
    :loop="displayCourses.length > 1"
    :slides-per-view="3"
    :centered-slides="false"
    :space-between="30"
    :navigation="true"
    :modules="modules"
    :autoplay="{
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    }"
    :breakpoints="{
      1280: { slidesPerView: 3, spaceBetween: 30 },
      1024: { slidesPerView: 2, spaceBetween: 24 },
      768: { slidesPerView: 2, spaceBetween: 20 },
      480: { slidesPerView: 1, spaceBetween: 10 }
    }"
    class="course-swiper"
  ><!-- Navigation Buttons -->
    <swiper-slide v-for="course in displayCourses" :key="course.id">
      <div class="course-card" @click="goToCourse(course.id)">
        <!-- Image Area -->
        <div class="image-area">
          <img :src="course.coverImageUrl" :alt="course.title" class="course-img" />

          <!-- Bestseller Badge -->
          <div class="bestseller-badge">
            <el-icon><TrophyBase /></el-icon>
            <span>熱銷</span>
          </div>

          <!-- Wishlist Button -->
          <div
            class="wishlist-btn"
            @click="toggleWishlist($event, course.id)"
            :class="{ 'is-wishlisted': isInWishlist(course.id) }"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              :fill="isInWishlist(course.id) ? '#ff4757' : 'none'"
              :stroke="isInWishlist(course.id) ? '#ff4757' : '#fff'"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
        </div>

        <!-- Course Info -->
        <div class="course-content">
          <h3 class="course-title">{{ course.title }}</h3>

          <!-- Tags below title -->
          <div class="tags-container" v-if="course.tags && course.tags.length > 0">
            <span
              v-for="(tag, index) in course.tags"
              :key="index"
              class="tag-item"
              @click="handleTagClick($event, tag)"
            >
              {{ tag }}
            </span>
          </div>

          <p class="course-instructor">{{ course.instructorName }} 老師</p>

          <div class="course-meta">
            <div class="rating">
              <el-rate
                :model-value="parseFloat(course.averageRating) || 0"
                disabled
                allow-half
                :max="5"
                :colors="['#E6A23C', '#E6A23C', '#E6A23C']"
                void-color="#d0d0d0"
                disabled-void-color="#d0d0d0"
              />
              <span class="rating-score">{{ course.averageRating ? Number(course.averageRating).toFixed(1) : '0.0' }}</span>
              <span class="rating-count">({{ formatCount(course.reviewCount) }})則評論</span>
            </div>

            <div class="price-section">
              <span class="price">NT$ {{ formatPrice(course.price) }}</span>
            </div>
          </div>

          <div class="purchase-info">
            <el-icon class="purchase-icon"><ShoppingCart /></el-icon>
            <span class="purchase-count">{{ course.enrollmentCount }} 人購買</span>
          </div>
        </div>
      </div>
    </swiper-slide>
  </swiper>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>


</template>

<style scoped>
.course-swiper {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px var(--capy-spacing-lg);
}

/* --- 1. 基礎樣式：玻璃擬態圓角方形按鈕 --- */
.course-swiper :deep(.swiper-button-next),
.course-swiper :deep(.swiper-button-prev) {
  /* 尺寸與形狀 - 圓角方形與卡片和諧 */
  width: 40px !important;
  height: 40px !important;
  border-radius: 12px !important; /* 圓角方形 */

  /* 玻璃擬態效果 - 避免生硬遮擋 */
  background-color: rgba(255, 255, 255, 0.85) !important; /* 半透明白底 */
  backdrop-filter: blur(4px) !important; /* 玻璃模糊效果 */
  -webkit-backdrop-filter: blur(4px) !important;
  color: var(--capy-text-primary) !important; /* 深灰箭頭 */

  /* 裝飾 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important; /* 柔和陰影 */
  border: 1px solid rgba(255, 255, 255, 0.5) !important; /* 半透明邊框 */

  /* 定位 */
  z-index: 10 !important;

  /* 互動 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  cursor: pointer !important;
}

/* --- 2. 調整箭頭圖示大小 - 更多呼吸空間 --- */
.course-swiper :deep(.swiper-button-next):after,
.course-swiper :deep(.swiper-button-prev):after {
  font-size: 16px !important; /* 縮小圖示，避免擁擠 */
  font-weight: 700 !important;
}

/* --- 3. Hover 效果：實心白底 + 品牌色箭頭 --- */
.course-swiper :deep(.swiper-button-next):hover,
.course-swiper :deep(.swiper-button-prev):hover {
  background-color: rgba(255, 255, 255, 1) !important; /* 實心白底 */
  color: var(--capy-primary) !important; /* 品牌色箭頭 */
  transform: scale(1.05) !important; /* 微微放大 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important; /* 加深陰影 */
  border-color: rgba(255, 255, 255, 0.8) !important;
}

/* --- 4. 點擊效果 (Active) --- */
.course-swiper :deep(.swiper-button-next):active,
.course-swiper :deep(.swiper-button-prev):active {
  transform: scale(0.95) !important; /* 微縮回饋 */
}

/* --- 5. 定位調整 --- */
.course-swiper :deep(.swiper-button-prev) {
  left: 0 !important;
}

.course-swiper :deep(.swiper-button-next) {
  right: 0 !important;
}

.course-card {
  background: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  box-shadow: var(--capy-shadow-sm);
  border: 1px solid var(--capy-border-lighter);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-color: var(--capy-primary);
}

.image-area {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  overflow: hidden;
  background: var(--capy-bg-base);
}

.course-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--capy-transition-base);
}

.course-card:hover .course-img {
  transform: scale(1.05);
}

/* Bestseller Badge */
.bestseller-badge {
  position: absolute;
  top: var(--capy-spacing-sm);
  right: var(--capy-spacing-sm);
  background: rgba(230, 162, 60, 0.95);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: white;
  padding: 6px 12px;
  border-radius: var(--capy-radius-base);
  font-size: var(--capy-font-size-xs);
  font-weight: var(--capy-font-weight-bold);
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 2;
}

/* Wishlist Button */
.wishlist-btn {
  position: absolute;
  top: var(--capy-spacing-sm);
  left: var(--capy-spacing-sm);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 3;
  opacity: 0;
}

.course-card:hover .wishlist-btn {
  opacity: 1;
}

.wishlist-btn:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.wishlist-btn.is-wishlisted {
  opacity: 1;
  background: rgba(255, 255, 255, 0.95);
}

.course-content {
  padding: var(--capy-spacing-md);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.course-title {
  font-size: var(--capy-font-size-md);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-sm) 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 40px;
}

/* Tags Container */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: var(--capy-spacing-sm);
}

.tag-item {
  display: inline-block;
  padding: 3px 10px;
  background: rgba(0, 191, 165, 0.1);
  color: var(--capy-primary);
  font-size: var(--capy-font-size-xs);
  font-weight: var(--capy-font-weight-semibold);
  border-radius: 12px;
  border: 1px solid rgba(0, 191, 165, 0.2);
  transition: all var(--capy-transition-fast);
  cursor: pointer;
}

.tag-item:hover {
  background: rgba(0, 191, 165, 0.15);
  border-color: var(--capy-primary);
  transform: translateY(-1px);
}

.course-instructor {
  font-size: 13px;
  color: var(--capy-text-primary);
  font-weight: 500;
  margin: 0 0 12px 0;
}

.course-meta {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-sm);
  margin-bottom: var(--capy-spacing-sm);
}

.rating :deep(.el-rate) {
  height: auto;
}

.rating :deep(.el-rate__icon) {
  font-size: 14px;
}

/* 只對已填滿的星星設定橘色 */
.rating :deep(.el-rate__icon.is-active) {
  color: var(--capy-warning);
}

/* 空星星使用灰色 */
.rating :deep(.el-rate__icon:not(.is-active)) {
  color: #d0d0d0;
}

.rating-score {
  font-size: var(--capy-font-size-sm);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-warning);
  margin-left: 4px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-count {
  font-size: 13px;
  color: #909399;
}

.price-section {
  display: flex;
  align-items: center;
  margin-top: auto;
  padding-top: 8px;
}

.price {
  font-size: var(--capy-font-size-xl);
  font-weight: 700;
  color: var(--capy-danger);
  letter-spacing: 0.5px;
}

.purchase-info {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: var(--capy-spacing-sm);
  margin-top: auto;
  border-top: 1px solid var(--capy-border-lighter);
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
}

.purchase-icon {
  color: var(--capy-primary);
  font-size: 16px;
}

.purchase-count {
  font-weight: var(--capy-font-weight-medium);
}

/* Tablet Breakpoint */
@media (max-width: 1024px) {
  .course-swiper {
    padding: 0 32px var(--capy-spacing-lg);
  }

  .course-card {
    max-width: 100%;
  }

  .course-title {
    font-size: var(--capy-font-size-base);
    min-height: 42px;
  }
}

/* Mobile Breakpoint */
@media (max-width: 768px) {
  .course-swiper {
    padding: 0 20px var(--capy-spacing-md);
  }

  .course-title {
    font-size: var(--capy-font-size-sm);
  }

  .course-content {
    padding: var(--capy-spacing-sm);
  }
}
</style>
