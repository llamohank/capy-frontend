<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import {
  getPopularCourses,
  getLatestCourses,
  getTopTags,
  getGoldenTeachers,
  getContinueLearningData
} from '@/api/student/home.js'
import { ElMessage } from 'element-plus'
import Carousel from '@/components/student/Home/Carousel.vue'
import TrustBar from '@/components/student/Home/TrustBar.vue'
import GoldenTeachers from '@/components/student/Home/GoldenTeachers.vue'
import LatestCourses from '@/components/student/Home/LatestCourses.vue'
import Tags from '@/components/student/Home/tags.vue'
import TopCourses from '@/components/student/Home/TopCourses.vue'
import ContinueLearning from '@/components/student/Home/ContinueLearning.vue'

// 使用 user store 來判斷登入狀態
const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isAuthenticated)

// 響應式螢幕寬度
const windowWidth = ref(window.innerWidth)

// 根據螢幕寬度決定顯示的講師數量
const displayedTeachers = computed(() => {
  const teachers = homeData.value.goldenTeachers
  if (windowWidth.value >= 1025) {
    // 桌面版：顯示全部（最多 4 個）
    return teachers
  } else if (windowWidth.value >= 768) {
    // 平板版 (768-1024)：只顯示前 3 個
    return teachers.slice(0, 3)
  } else {
    // 手機版：顯示全部（由 CSS 控制為 2 欄）
    return teachers.slice(0, 2)
  }
})

// 根據螢幕寬度決定顯示的繼續學習課程數量
const displayedContinueLearning = computed(() => {
  const courses = homeData.value.continueLearning
  if (windowWidth.value >= 1025) {
    // 桌面版：顯示 3 個
    return courses.slice(0, 3)
  } else if (windowWidth.value >= 768) {
    // 平板版 (768-1024)：只顯示 2 個
    return courses.slice(0, 2)
  } else {
    // 手機版：顯示全部（由 CSS 控制為橫向滾動）
    return courses
  }
})

// 監聽視窗大小變化
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 首頁資料狀態
const loading = ref(true)
const homeData = ref({
  topCourses: [],
  latestCourses: [],
  goldenTeachers: [],
  popularTags: [],
  carousel: [],
  stats: null,
  continueLearning: []
})

// 獲取首頁資料 - 並行呼叫 4 個 API
const fetchHomeData = async () => {
  try {
    loading.value = true

    // 並行呼叫所有 API
    const [popularResponse, latestResponse, tagsResponse, teachersResponse] = await Promise.all([
      getPopularCourses(),
      getLatestCourses(),
      getTopTags(),
      getGoldenTeachers()
    ])

    console.log('熱門課程 API 回應:', popularResponse)
    console.log('最新課程 API 回應:', latestResponse)
    console.log('熱門標籤 API 回應:', tagsResponse)
    console.log('金牌講師 API 回應:', teachersResponse)

    // 設定資料（http.js 已經提取了 response.data.data）
    homeData.value = {
      topCourses: Array.isArray(popularResponse) ? popularResponse : [],
      latestCourses: Array.isArray(latestResponse) ? latestResponse : [],
      popularTags: Array.isArray(tagsResponse) ? tagsResponse : [],
      goldenTeachers: Array.isArray(teachersResponse) ? teachersResponse : [],
      carousel: [],  // 暫時為空，等待後端提供
      stats: null,   // 暫時為空，等待後端提供
      continueLearning: []  // 初始化為空陣列，稍後單獨獲取
    }

    console.log('設定後的 homeData:', homeData.value)
    console.log('熱門課程數量:', homeData.value.topCourses.length)
    console.log('最新課程數量:', homeData.value.latestCourses.length)
    console.log('熱門標籤數量:', homeData.value.popularTags.length)
    console.log('金牌講師數量:', homeData.value.goldenTeachers.length)
  } catch (error) {
    console.error('獲取首頁資料失敗:', error)
    console.error('錯誤詳情:', error.response || error.message)
    ElMessage.error('載入首頁資料失敗，請稍後再試')
  } finally {
    loading.value = false
  }
}

const fetchContinueLearningData = async () => {
  // 只有在已登入時才呼叫 API
  if (!userStore.isAuthenticated) {
    console.log('未登入，跳過獲取繼續學習資料')
    homeData.value.continueLearning = []
    return
  }

  try {
    const response = await getContinueLearningData()

    console.log('繼續學習 API 回應:', response)

    if (Array.isArray(response)) {
      // 有課程資料
      homeData.value.continueLearning = response
      console.log('繼續學習課程數量:', response.length)
      console.log('繼續學習課程資料:', response)
    } else if (response === null) {
      // 沒有課程（正常情況）
      homeData.value.continueLearning = []
      console.log('使用者尚未購買任何課程')
    } else {
      // 異常情況
      console.warn('繼續學習 API 回應格式不符合預期:', response)
      homeData.value.continueLearning = []
    }
  } catch (error) {
    console.log('獲取繼續學習資料失敗:', error)
    // 設為空陣列，避免頁面崩潰
    homeData.value.continueLearning = []
  }
}

// 組件掛載時獲取資料
onMounted(async () => {
  await fetchHomeData()
  // 只有在已登入時才獲取繼續學習資料
  if (userStore.isAuthenticated) {
    await fetchContinueLearningData()
  }
})

// 監聽登入狀態變化，當用戶登入後重新獲取繼續學習資料
watch(isLoggedIn, async (newValue, oldValue) => {
  // 當從未登入變為已登入時，重新獲取繼續學習資料
  if (newValue && !oldValue) {
    console.log('檢測到用戶登入，重新獲取繼續學習資料')
    await fetchContinueLearningData()
  }
  // 當從已登入變為未登入時，清空繼續學習資料
  if (!newValue && oldValue) {
    console.log('檢測到用戶登出，清空繼續學習資料')
    homeData.value.continueLearning = []
  }
})
</script>

<template>
  <div class="home-page">
    <!-- Loading 狀態 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 主要內容 -->
    <div v-else>
      <!-- Hero Section with Carousel -->
      <section class="hero-section-wrapper">
        <Carousel :carousel-data="homeData.carousel" />
      </section>

      <!-- Trust Bar -->
      <section class="trust-bar-section">
        <TrustBar :stats="homeData.stats" />
      </section>

      <!-- Continue Learning (登入後且有課程才顯示) -->
      <section v-if="isLoggedIn && homeData.continueLearning.length > 0" class="section-wrapper section-white">
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title-student">繼續學習</h2>
            <div class="title-underline"></div>
          </div>
          <ContinueLearning :enrollments="displayedContinueLearning" />
        </div>
      </section>

      <!-- Top Courses Section -->
      <section class="section-wrapper section-white">
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title-student">熱門課程</h2>
            <div class="title-underline"></div>
          </div>
          <TopCourses :courses="homeData.topCourses" />
        </div>
      </section>

      <!-- Tags Section -->
      <section class="section-wrapper section-gray">
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title-student">熱門標籤</h2>
            <div class="title-underline"></div>
          </div>
          <Tags :tags="homeData.popularTags" />
        </div>
      </section>

      <!-- Latest Courses Section with Decorative Blobs -->
      <section class="section-wrapper section-white latest-courses-section">
        <!-- Decorative Background Blobs -->
        <div class="decorative-blob blob-1"></div>
        <div class="decorative-blob blob-2"></div>

        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title-student">最新課程</h2>
            <div class="title-underline"></div>
          </div>
          <LatestCourses :courses="homeData.latestCourses" />
        </div>
      </section>

      <!-- Golden Teachers Section -->
      <section class="section-wrapper section-gray">
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title-student">金牌講師</h2>
            <div class="title-underline"></div>
          </div>
          <GoldenTeachers :teachers="displayedTeachers" />
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/breakpoints';
@import '@/styles/project-mixins';

.home-page {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

/* Loading Container */
.loading-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--capy-spacing-xxl) var(--capy-spacing-lg);
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;

  @include below($bp-md) {
    padding: var(--capy-spacing-xl) var(--capy-spacing-md);
    min-height: 50vh;
  }

  @include below($bp-sm) {
    padding: var(--capy-spacing-lg) var(--capy-spacing-sm);
  }
}

/* Remove gap between last section and footer */
.home-page > section:last-child {
  margin-bottom: 0;
  padding-bottom: 80px;

  @include below($bp-md) {
    padding-bottom: var(--capy-spacing-xl);
  }

  @include below($bp-sm) {
    padding-bottom: var(--capy-spacing-lg);
  }
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

  @include below($bp-md) {
    margin-bottom: var(--capy-spacing-lg);
  }

  @include below($bp-sm) {
    margin-bottom: var(--capy-spacing-md);
  }
}

/* Section Wrapper - Alternating Backgrounds */
.section-wrapper {
  width: 100%;
  padding: var(--capy-spacing-xxl) 0;
  position: relative;
  z-index: 2;

  @include below($bp-lg) {
    padding: var(--capy-spacing-xl) 0;
  }

  @include below($bp-md) {
    padding: var(--capy-spacing-lg) 0;
  }

  @include below($bp-sm) {
    padding: var(--capy-spacing-md) 0;
  }
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

  @include below($bp-lg) {
    padding: 0 var(--capy-spacing-md);
  }

  @include below($bp-md) {
    padding: 0 var(--capy-spacing-md);
  }

  @include below($bp-sm) {
    padding: 0 var(--capy-spacing-sm);
  }
}

/* Section Header with Underline */
.section-header {
  text-align: center;
  margin-bottom: var(--capy-spacing-xl);

  @include below($bp-lg) {
    margin-bottom: var(--capy-spacing-lg);
  }

  @include below($bp-md) {
    margin-bottom: var(--capy-spacing-md);
  }

  @include below($bp-sm) {
    margin-bottom: var(--capy-spacing-sm);
  }
}

.section-title-student {
  @include section-title;
  text-align: center;
  margin: 0 0 var(--capy-spacing-md) 0;

  @include below($bp-md) {
    margin-bottom: var(--capy-spacing-sm);
  }

  @include below($bp-sm) {
    margin-bottom: 8px;
  }
}

.title-underline {
  @include section-title-underline;
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

  @include below($bp-lg) {
    width: 500px;
    height: 500px;
  }

  @include below($bp-md) {
    width: 400px;
    height: 400px;
    top: -100px;
    left: -50px;
  }

  @include below($bp-sm) {
    display: none;
  }
}

.blob-2 {
  width: 500px;
  height: 500px;
  bottom: -150px;
  right: -80px;
  background: var(--capy-brand);

  @include below($bp-lg) {
    width: 400px;
    height: 400px;
  }

  @include below($bp-md) {
    width: 350px;
    height: 350px;
    bottom: -100px;
    right: -50px;
  }

  @include below($bp-sm) {
    display: none;
  }
}

.latest-courses-section .section-container {
  position: relative;
  z-index: 1;
}
</style>
