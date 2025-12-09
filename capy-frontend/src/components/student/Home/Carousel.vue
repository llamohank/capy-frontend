<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const carouselRef = ref(null)

const slides = ref([
  {
    id: 1,
    url: "/instruction/封面圖.png",
    badge: "精選課程",
    title: "Vue 3 完整開發指南",
    subtitle: "從零開始掌握現代前端框架",
    courseId: 1
  },
  {
    id: 2,
    url: "https://picsum.photos/id/1016/1200/600",
    badge: "熱門推薦",
    title: "Python 數據科學實戰",
    subtitle: "AI 時代必備技能",
    courseId: 2
  },
  {
    id: 3,
    url: "https://picsum.photos/id/1018/1200/600",
    badge: "新課上架",
    title: "全端開發訓練營",
    subtitle: "從零開始，打造你的第一個職涯代表作",
    courseId: 3
  }
])

const activeIndex = ref(0)

const goToCourse = (courseId) => {
  router.push(`/courses/${courseId}`)
}

const handleChange = (index) => {
  activeIndex.value = index
}

const setActiveSlide = (index) => {
  if (carouselRef.value) {
    carouselRef.value.setActiveItem(index)
  }
  activeIndex.value = index
}
</script>

<template>
  <div class="hero-carousel-wrapper">
    <el-carousel
      ref="carouselRef"
      :interval="5000"
      type="card"
      height="400px"
      :card-scale="0.85"
      @change="handleChange"
      class="hero-carousel"
    >
      <el-carousel-item
        v-for="(slide, index) in slides"
        :key="slide.id"
        :class="{ 'is-active-slide': index === activeIndex }"
      >
        <div class="slide-container">
          <!-- Dark Overlay for better text contrast -->
          <div class="image-overlay"></div>

          <!-- Image -->
          <img
            :src="slide.url"
            :alt="slide.title"
            class="slide-image"
          />

          <!-- Glassmorphism Content Overlay (Only on Active Slide) -->
          <div
            v-if="index === activeIndex"
            class="content-overlay"
          >
            <!-- Badge -->
            <div class="featured-badge">
              {{ slide.badge }}
            </div>

            <!-- Title & Subtitle -->
            <h2 class="slide-title">{{ slide.title }}</h2>
            <p class="slide-subtitle">{{ slide.subtitle }}</p>

            <!-- CTA Button -->
            <button
              class="view-details-btn"
              @click.stop="goToCourse(slide.courseId)"
            >
              查看詳情
            </button>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- Custom Indicator Dots -->
    <div class="custom-indicators">
      <div
        v-for="(slide, index) in slides"
        :key="`dot-${slide.id}`"
        :class="['indicator-dot', { 'is-active': index === activeIndex }]"
        @click="setActiveSlide(index)"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.hero-carousel-wrapper {
  position: relative;
  width: 100%;
  padding: var(--capy-spacing-xxl) 0;
  background: linear-gradient(180deg, var(--capy-bg-base) 0%, var(--capy-bg-surface) 100%);
}

.hero-carousel {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

/* Carousel Item Styling */
.hero-carousel :deep(.el-carousel__item) {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: var(--capy-radius-lg);
  overflow: hidden;
}

/* Inactive Slides - Dimmed & Blurred */
.hero-carousel :deep(.el-carousel__item:not(.is-active)) {
  opacity: 0.6;
  filter: blur(2px);
}

.hero-carousel :deep(.el-carousel__item:not(.is-active)) .slide-container {
  transform: scale(0.85);
}

/* Active Slide - Enhanced */
.hero-carousel :deep(.el-carousel__item.is-active) {
  opacity: 1;
  filter: none;
  z-index: 10;
}

.hero-carousel :deep(.el-carousel__item.is-active) .slide-container {
  transform: scale(1.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

/* Slide Container */
.slide-container {
  position: relative;
  width: 100%;
  height: 100%;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: var(--capy-radius-lg);
  overflow: hidden;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--capy-radius-lg);
  position: relative;
}

/* Dark overlay for better text readability */
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--capy-bg-overlay);
  z-index: 1;
  opacity: 0;
  transition: opacity 0.5s ease;
}

/* Show overlay on active slide */
.hero-carousel :deep(.el-carousel__item.is-active) .image-overlay {
  opacity: 1;
}

/* Glassmorphism Content Overlay */
.content-overlay {
  position: absolute;
  bottom: 24px;
  left: 24px;
  max-width: 450px;
  padding: var(--capy-spacing-lg);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--capy-radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.6s ease-out;
  z-index: 3;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Featured Badge */
.featured-badge {
  display: inline-block;
  padding: 6px 16px;
  background: var(--capy-warning);
  color: white;
  font-size: var(--capy-font-size-sm);
  font-weight: var(--capy-font-weight-bold);
  border-radius: 20px;
  margin-bottom: var(--capy-spacing-sm);
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.3);
}

/* Title */
.slide-title {
  font-size: 28px;
  font-weight: var(--capy-font-weight-bold);
  color: white;
  margin: 0 0 var(--capy-spacing-sm) 0;
  text-shadow: 0 3px 12px rgba(0, 0, 0, 0.6);
  line-height: 1.3;
  position: relative;
  z-index: 2;
}

/* Subtitle */
.slide-subtitle {
  font-size: var(--capy-font-size-base);
  color: rgba(255, 255, 255, 0.98);
  margin: 0 0 var(--capy-spacing-lg) 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  line-height: 1.6;
  position: relative;
  z-index: 2;
}

/* CTA Button */
.view-details-btn {
  padding: 10px 24px;
  background: var(--capy-primary);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-semibold);
  cursor: pointer;
  transition: all var(--capy-transition-base);
  box-shadow: 0 4px 12px rgba(0, 191, 165, 0.3);
}

.view-details-btn:hover {
  background: var(--el-color-primary-dark-1);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 191, 165, 0.4);
}

.view-details-btn:active {
  transform: translateY(0);
}

/* Custom Indicator Dots */
.custom-indicators {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: var(--capy-spacing-xl);
}

.indicator-dot {
  width: 12px;
  height: 12px;
  background: var(--capy-border-base);
  border-radius: 6px;
  cursor: pointer;
  transition: all var(--capy-transition-base);
}

.indicator-dot:hover {
  background: var(--capy-text-secondary);
}

.indicator-dot.is-active {
  width: 40px;
  background: var(--capy-primary);
  box-shadow: 0 2px 8px rgba(0, 191, 165, 0.3);
}

/* Hide default Element Plus indicators */
.hero-carousel :deep(.el-carousel__indicators) {
  display: none;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-carousel {
    height: 360px;
  }

  .slide-title {
    font-size: 24px;
  }

  .content-overlay {
    max-width: 380px;
    padding: var(--capy-spacing-md);
  }
}

@media (max-width: 768px) {
  .hero-carousel-wrapper {
    padding: var(--capy-spacing-lg) 0;
  }

  .hero-carousel {
    height: 320px;
  }

  /* On mobile, disable the 3D card effect */
  .hero-carousel :deep(.el-carousel__item) {
    opacity: 1 !important;
    filter: none !important;
  }

  .hero-carousel :deep(.el-carousel__item) .slide-container {
    transform: scale(1) !important;
    box-shadow: var(--capy-shadow-md) !important;
  }

  .content-overlay {
    bottom: 16px;
    left: 16px;
    right: 16px;
    max-width: none;
    padding: var(--capy-spacing-md);
  }

  .slide-title {
    font-size: 20px;
  }

  .slide-subtitle {
    font-size: var(--capy-font-size-sm);
  }

  .view-details-btn {
    padding: 8px 20px;
    font-size: var(--capy-font-size-sm);
  }
}

@media (max-width: 480px) {
  .hero-carousel {
    height: 280px;
  }

  .slide-title {
    font-size: 18px;
  }

  .featured-badge {
    font-size: var(--capy-font-size-xs);
    padding: 4px 12px;
  }
}
</style>
