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

// 限制顯示的標籤數量
const maxTags = 3

// 取得可見的標籤
const getVisibleTags = (tags) => {
  if (!tags || tags.length === 0) return []
  return tags.slice(0, maxTags)
}

// 計算剩餘標籤數量
const getRemainingTagsCount = (tags) => {
  if (!tags || tags.length <= maxTags) return 0
  return tags.length - maxTags
}

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

/**
 * 點擊老師名稱跳轉到老師詳情頁面
 */
const handleTeacherClick = (event, instructorId) => {
  event.stopPropagation() // 防止觸發卡片點擊事件
  if (instructorId) {
    router.push(`/teacherdetail/${instructorId}`)
  }
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
      320: { slidesPerView: 1.2, spaceBetween: 16 },
      480: { slidesPerView: 1.2, spaceBetween: 16 },
      768: { slidesPerView: 2, spaceBetween: 20 },
      1024: { slidesPerView: 2, spaceBetween: 24 },
      1280: { slidesPerView: 3, spaceBetween: 30 }
    }"
    class="course-swiper"
  >
    <swiper-slide v-for="course in displayCourses" :key="course.id">
      <div class="course-card" @click="goToCourse(course.id)">
        <!-- Image Area -->
        <div class="image-area">
          <img
            :src="course.coverImageUrl"
            :alt="course.title"
            class="course-img"
            loading="lazy"
          />

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

          <!-- Enrolled Badge (右下角) -->
          <div v-if="course.isEnrolled" class="enrolled-badge-corner">
            已購買
          </div>

          <!-- Tags below title -->
          <div class="tags-container" v-if="course.tags && course.tags.length > 0">
            <span
              v-for="(tag, index) in getVisibleTags(course.tags)"
              :key="index"
              class="tag-item"
              @click="handleTagClick($event, tag)"
            >
              {{ tag }}
            </span>
            <span v-if="getRemainingTagsCount(course.tags) > 0" class="tag-more">
              +{{ getRemainingTagsCount(course.tags) }}
            </span>
          </div>

          <p class="course-instructor">
            <span
              class="teacher-link"
              @click="handleTeacherClick($event, course.instructorId)"
            >
              {{ course.instructorName }} 老師
            </span>
          </p>

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
</template>

<style lang="scss" scoped>
/* 由於 vite.config.js 已配置自動引入，這裡可以直接使用 mixins 和 variables */

.course-swiper {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px var(--capy-spacing-lg);

  @include tablet {
    padding: 0 32px var(--capy-spacing-lg);
  }

  @include mobile {
    padding: 0 var(--capy-spacing-md) var(--capy-spacing-md) !important;
  }
}

/* --- Swiper Navigation Buttons --- */
.course-swiper :deep(.swiper-button-next),
.course-swiper :deep(.swiper-button-prev) {
  width: 40px !important;
  height: 40px !important;
  border-radius: 12px !important;
  background-color: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(4px) !important;
  -webkit-backdrop-filter: blur(4px) !important;
  color: var(--capy-text-primary) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  z-index: 10 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  cursor: pointer !important;

  &:after {
    font-size: 16px !important;
    font-weight: 700 !important;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 1) !important;
    color: var(--capy-primary) !important;
    transform: scale(1.05) !important;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
    border-color: rgba(255, 255, 255, 0.8) !important;
  }

  &:active {
    transform: scale(0.95) !important;
  }

  /* 手機版隱藏導航按鈕 */
  @include mobile {
    display: none !important;
    visibility: hidden !important;
  }
}

.course-swiper :deep(.swiper-button-prev) {
  left: 0 !important;
}

.course-swiper :deep(.swiper-button-next) {
  right: 0 !important;
}

/* --- Course Card --- */
.course-card {
  background: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease, border-color 0.3s ease;
  box-shadow: var(--capy-shadow-sm);
  border: 1px solid var(--capy-border-lighter);
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    border-color: var(--capy-primary);

    .course-img {
      transform: scale(1.05);
    }

    .wishlist-btn {
      opacity: 1;
    }
  }

  @include tablet {
    max-width: 100%;
  }

  @include mobile {
    max-width: 100%;
  }
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

/* Bestseller Badge */
.bestseller-badge {
  position: absolute;
  top: var(--capy-spacing-sm);
  right: var(--capy-spacing-sm);
  background: rgba(230, 162, 60, 0.95);
  backdrop-filter: blur(4px);
  color: white;
  padding: 6px 12px;
  border-radius: var(--capy-radius-base);
  font-size: $font-xs;
  font-weight: $font-weight-bold;
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
  z-index: 3;
  opacity: 0;
  will-change: transform;
  transform-origin: center center;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
  }

  &.is-wishlisted {
    opacity: 1;
    background: rgba(255, 255, 255, 0.95);
  }
}

.course-content {
  padding: var(--capy-spacing-md);
  flex: 1;
  display: flex;
  flex-direction: column;

  @include mobile {
    padding: var(--capy-spacing-sm);
  }
}

.course-title {
  font-size: $font-md;
  font-weight: $font-weight-semibold;
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-sm) 0;
  line-height: 1.4;
  @include text-line-clamp(2);
  min-height: 40px;

  @include tablet {
    font-size: $font-base;
    min-height: 42px;
  }

  @include mobile {
    font-size: $font-sm;
    min-height: 38px;
  }
}

/* Tags Container */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: var(--capy-spacing-sm);

  /* 手機版隱藏標籤 */
  @include mobile {
    display: none !important;
    visibility: hidden !important;
  }
}

.tag-item {
  display: inline-block;
  padding: 3px 10px;
  background: rgba(0, 191, 165, 0.1);
  color: var(--capy-primary);
  font-size: $font-xs;
  font-weight: $font-weight-semibold;
  border-radius: 12px;
  border: 1px solid rgba(0, 191, 165, 0.2);
  transition: all var(--capy-transition-fast);
  cursor: pointer;

  &:hover {
    background: rgba(0, 191, 165, 0.15);
    border-color: var(--capy-primary);
    transform: translateY(-1px);
  }
}

.tag-more {
  display: inline-block;
  padding: 3px 10px;
  background: rgba(144, 147, 153, 0.1);
  color: var(--capy-text-secondary);
  font-size: $font-xs;
  font-weight: $font-weight-semibold;
  border-radius: 12px;
  border: 1px solid rgba(144, 147, 153, 0.2);
  cursor: default;
}

.course-instructor {
  font-size: 13px; /* 這裡維持 13px 作為特規，或者使用 $font-sm (14px) */
  color: var(--capy-text-primary);
  font-weight: 500;
  margin: 0 0 12px 0;
}

.teacher-link {
  cursor: pointer;
  transition: color var(--capy-transition-fast);

  &:hover {
    color: var(--capy-primary);
    text-decoration: underline;
  }
}

.course-meta {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-sm);
  margin-bottom: var(--capy-spacing-sm);
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;

  :deep(.el-rate) {
    height: auto;
  }

  :deep(.el-rate__icon) {
    font-size: 14px;

    &.is-active {
      color: var(--capy-warning);
    }

    &:not(.is-active) {
      color: #d0d0d0;
    }
  }
}

.rating-score {
  font-size: $font-sm;
  font-weight: $font-weight-semibold;
  color: var(--capy-warning);
  margin-left: 4px;
}

.rating-count {
  font-size: 13px;
  color: #909399;
}

.price-section {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: auto;
  padding-top: 8px;

  @include mobile {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.price {
  font-size: $font-xl;
  font-weight: 700;
  color: var(--capy-danger);
  letter-spacing: 0.5px;

  @include mobile {
    font-size: $font-lg;
    font-weight: 600;
    color: var(--capy-text-primary); /* 手機版改回深色 */
  }
}

.purchase-info {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: var(--capy-spacing-sm);
  margin-top: auto;
  border-top: 1px solid var(--capy-border-lighter);
  font-size: $font-sm;
  color: var(--capy-text-secondary);
}

.purchase-icon {
  color: var(--capy-primary);
  font-size: 16px;
}

.purchase-count {
  font-weight: $font-weight-medium;
}

/* Enrolled Badge */
.enrolled-badge-corner {
  position: absolute;
  bottom: 16px;
  right: 16px;
  padding: 6px 14px;
  background: linear-gradient(135deg, #54CDF2 0%, #0EA5E9 100%);
  color: #fff;
  font-size: $font-xs;
  font-weight: 600;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(84, 205, 242, 0.3);
  letter-spacing: 0.5px;
  z-index: 5;
}
</style>
