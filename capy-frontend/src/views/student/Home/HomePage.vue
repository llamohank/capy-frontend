<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import Carousel from '@/components/student/Home/Carousel.vue'
import TrustBar from '@/components/student/Home/TrustBar.vue'
import GoldenTeachers from '@/components/student/Home/GoldenTeachers.vue'
import LatestCourses from '@/components/student/Home/LatestCourses.vue'
import Tags from '@/components/student/Home/tags.vue'
import TopCourses from '@/components/student/Home/TopCourses.vue'
import ContinueLearning from '@/components/student/Home/ContinueLearning.vue'
// import ScrollytellingBackground from '@/components/student/Home/ScrollytellingBackground.vue'

// 使用 user store 來判斷登入狀態
const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isAuthenticated)
</script>

<template>
  <div class="home-page">
    <!-- Hero Section with Carousel -->
    <section class="hero-section-wrapper">
      <Carousel />
    </section>

    <!-- Trust Bar -->
    <section class="trust-bar-section">
      <TrustBar />
    </section>

    <!-- Continue Learning (登入後才顯示) -->
    <section v-if="isLoggedIn" class="section-wrapper section-white">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">繼續學習</h2>
          <div class="title-underline"></div>
        </div>
        <ContinueLearning />
      </div>
    </section>

    <!-- Top Courses Section -->
    <section class="section-wrapper section-white">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">熱門課程</h2>
          <div class="title-underline"></div>
        </div>
        <TopCourses />
      </div>
    </section>

    <!-- Tags Section -->
    <section class="section-wrapper section-gray">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">熱門標籤</h2>
          <div class="title-underline"></div>
        </div>
        <Tags />
      </div>
    </section>

    <!-- Latest Courses Section with Decorative Blobs -->
    <section class="section-wrapper section-white latest-courses-section">
      <!-- Decorative Background Blobs -->
      <div class="decorative-blob blob-1"></div>
      <div class="decorative-blob blob-2"></div>

      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">最新課程</h2>
          <div class="title-underline"></div>
        </div>
        <LatestCourses />
      </div>
    </section>

    <!-- Golden Teachers Section -->
    <section class="section-wrapper section-gray">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">金牌講師</h2>
          <div class="title-underline"></div>
        </div>
        <GoldenTeachers />
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

/* Remove gap between last section and footer */
.home-page > section:last-child {
  margin-bottom: 0 !important;
  padding-bottom: 80px;
}

/* Hero Section */
.hero-section-wrapper {
  width: 100%;
  margin-bottom: 0;
  position: relative;
  z-index: 2;
}

/* Trust Bar Section */
.trust-bar-section {
  margin-bottom: var(--capy-spacing-xxl);
  position: relative;
  z-index: 2;
}

/* Section Wrapper - Alternating Backgrounds */
.section-wrapper {
  width: 100%;
  padding: var(--capy-spacing-xxl) 0;
  position: relative;
  z-index: 2;
}

.section-white {
  background-color: #FCF9F4;
}

.section-gray {
  background-color: #F5F1EB;
}

/* Section Container */
.section-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--capy-spacing-lg);
}

/* Section Header with Underline */
.section-header {
  text-align: center;
  margin-bottom: var(--capy-spacing-xxl);
}

.section-title {
  font-size: 32px;
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-md) 0;
  letter-spacing: -0.5px;
}

.title-underline {
  width: 60px;
  height: 4px;
  background: linear-gradient(
    90deg,
    var(--capy-primary) 0%,
    var(--capy-brand) 100%
  );
  margin: 0 auto;
  border-radius: 2px;
}

/* Latest Courses Section with Decorative Blobs */
.latest-courses-section {
  overflow: hidden;
}

.decorative-blob {
  position: absolute;
  border-radius: 50%;
  background: var(--capy-primary);
  opacity: 0.05;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}

.blob-1 {
  width: 600px;
  height: 600px;
  top: -200px;
  left: -100px;
}

.blob-2 {
  width: 500px;
  height: 500px;
  bottom: -150px;
  right: -80px;
  background: var(--capy-brand);
}

.latest-courses-section .section-container {
  position: relative;
  z-index: 1;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .section-wrapper {
    padding: 60px 0;
  }

  .section-header {
    margin-bottom: 40px;
  }

  .section-title {
    font-size: 28px;
  }

  .title-underline {
    width: 50px;
    height: 3px;
  }
}

@media (max-width: 768px) {
  .trust-bar-section {
    margin-bottom: 40px;
  }

  .section-wrapper {
    padding: 40px 0;
  }

  .section-container {
    padding: 0 var(--capy-spacing-md);
  }

  .section-header {
    margin-bottom: 30px;
  }

  .section-title {
    font-size: 24px;
  }

  .title-underline {
    width: 40px;
  }

  .blob-1 {
    width: 400px;
    height: 400px;
    top: -100px;
    left: -50px;
  }

  .blob-2 {
    width: 350px;
    height: 350px;
    bottom: -100px;
    right: -50px;
  }
}

@media (max-width: 480px) {
  .section-wrapper {
    padding: 30px 0;
  }

  .section-title {
    font-size: 20px;
  }

  .blob-1,
  .blob-2 {
    display: none;
  }
}
</style>
