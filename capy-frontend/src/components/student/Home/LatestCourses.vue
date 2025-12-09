<script setup>
import { computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation } from 'swiper/modules'
import { useRouter } from 'vue-router'
import { useWishlistStore } from '@/stores/wishlist'
import { ElMessage } from 'element-plus'
import ExploreCourseCard from '@/components/student/Explore/ExploreCard/ExploreCourseCard.vue'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const modules = [Autoplay, Navigation]
const router = useRouter()
const wishlistStore = useWishlistStore()

// 接收從父組件傳來的課程資料
const props = defineProps({
  courses: {
    type: Array,
    default: () => []
  }
})

// 後端返回的格式已經是最新課程，直接使用
const displayCourses = computed(() => props.courses)

/**
 * 切換願望清單狀態
 */
const toggleWishlist = async (courseId) => {
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
 * 處理標籤點擊
 */
const handleTagClick = (tag) => {
  // 導航到探索頁面並篩選該標籤
  router.push({
    path: '/explore',
    query: { tag }
  })
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
  >
    <swiper-slide v-for="course in displayCourses" :key="course.id">
      <ExploreCourseCard
        :course="course"
        @toggle-wishlist="toggleWishlist"
        @tag-click="handleTagClick"
      />
    </swiper-slide>
  </swiper>

  <!-- Navigation Buttons -->
  <div class="swiper-button-prev"></div>
  <div class="swiper-button-next"></div>
</template>

<style scoped>
.course-swiper {
  width: 100%;
  max-width: 1280px;
  margin: 20px auto;
  padding: 0 40px;
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

/* Tablet Breakpoint */
@media (max-width: 1024px) {
  .course-swiper {
    padding: 0 32px;
  }
}

/* Mobile Breakpoint */
@media (max-width: 768px) {
  .course-swiper {
    padding: 0 20px;
  }
}
</style>
