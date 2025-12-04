<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { getHomePageData, getContinueLearningData } from '@/api/student/home.js'
import { ElMessage } from 'element-plus'
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

// 獲取首頁資料
const fetchHomeData = async () => {
  try {
    loading.value = true
    const response = await getHomePageData()

    console.log('API 回應 (已被 http.js 處理):', response)

    // 注意：http.js 的 response 攔截器已經提取了 response.data.data
    // 所以這裡的 response 直接就是後端的 data 陣列
    // 後端格式: data: [{ popularCourses, latestCourses, topTags, goldenTr }]
    if (response && Array.isArray(response) && response.length > 0) {
      const apiData = response[0]
      console.log('解析的 API 資料:', apiData)

      homeData.value = {
        topCourses: apiData.popularCourses || [],
        latestCourses: apiData.latestCourses || [],
        goldenTeachers: apiData.goldenTr || [],
        popularTags: apiData.topTags || [],
        carousel: [],  // 暫時為空，等待後端提供
        stats: null,   // 暫時為空，等待後端提供
        continueLearning: []  // 初始化為空陣列，稍後單獨獲取
      }

      console.log('設定後的 homeData:', homeData.value)
      console.log('熱門課程數量:', homeData.value.topCourses.length)
      console.log('最新課程數量:', homeData.value.latestCourses.length)
      console.log('標籤數量:', homeData.value.popularTags.length)
    } else {
      console.warn('API 回應格式不符合預期:', response)
    }
  } catch (error) {
    console.error('獲取首頁資料失敗:', error)
    console.error('錯誤詳情:', error.response || error.message)
    ElMessage.error('載入首頁資料失敗，請稍後再試')
  } finally {
    loading.value = false
  }
}

const fetchContinueLearningData = async () => {
  try {
    const response = await getContinueLearningData()

    console.log('繼續學習 API 回應:', response)

    if (response && Array.isArray(response)) {
      homeData.value.continueLearning = response
      console.log('繼續學習課程數量:', response.length)
      console.log('繼續學習課程資料:', response)
    } else {
      console.warn('繼續學習 API 回應格式不符合預期:', response)
      homeData.value.continueLearning = []
    }
  } catch (error) {
    console.log('獲取繼續學習資料失敗（可能未登入或無課程）:', error)
    // 設為空陣列，避免頁面崩潰
    homeData.value.continueLearning = []
    // 不顯示錯誤訊息，因為未登入或沒有課程是正常情況
  }
}
// 組件掛載時獲取資料
onMounted(async () => {
  await fetchHomeData()
  // 嘗試獲取繼續學習資料（如果未登入會靜默失敗）
  await fetchContinueLearningData()
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
          <ContinueLearning :enrollments="homeData.continueLearning" />
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
          <GoldenTeachers :teachers="homeData.goldenTeachers" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
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
  margin-bottom: var(--capy-spacing-xl);
}

.section-title-student {
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

/* Tablet Breakpoint (1024px) */
@media (max-width: 1024px) {
  .section-wrapper {
    padding: var(--capy-spacing-xl) 0;
  }

  .section-container {
    padding: 0 var(--capy-spacing-md);
  }

  .section-header {
    margin-bottom: var(--capy-spacing-xl);
  }

  .section-title-student {
    font-size: 28px;
  }

  .title-underline {
    width: 50px;
    height: 3px;
  }

  .blob-1 {
    width: 500px;
    height: 500px;
  }

  .blob-2 {
    width: 400px;
    height: 400px;
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
