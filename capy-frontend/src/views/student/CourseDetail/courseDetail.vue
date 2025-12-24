<template>
  <div class="course-detail-page">
    <!-- Main Content -->
    <el-container class="main-container">
      <!-- Left Content -->
      <el-main class="main-content">
        <!-- Course Header (麵包屑和標題) -->
        <CourseContent
          :title="course.title"
          :sections="course.contentSections"
          :show-content="false"
        />

        <!-- Course Video/Image (隱藏於桌面版，顯示於手機版) -->
        <div class="course-media mobile-only">
          <img :src="course.cover" :alt="course.title" />
        </div>

        <!-- Course Introduction (課程介紹和統計) -->
        <CourseIntro
          :description="course.description"
          :duration="course.duration"
          :sections="course.sections"
          :attachments="course.attachments"
          :learning-points="course.learningPoints"
          :content-sections="course.contentSections"
          @preview="handlePreview"
        />

        <!-- Course Content (課程內容章節) -->
        <CourseContent
          :sections="course.contentSections"
          :show-header="false"
          :is-enrolled="course.isEnrolled"
          @preview="handlePreview"
          @lesson-click="handleLessonClick"
        />

        <!-- Instructor -->
        <InstructorCard :instructor="course.instructor" />

        <!-- Ratings & Reviews -->
        <RatingsReviews
          :average-rating="course.rating"
          :total-reviews="course.totalReviews"
          :rating-distribution="course.ratingDistribution"
          :reviews="course.reviews"
        />
      </el-main>

      <!-- Right Sidebar -->
      <el-aside width="350px" class="sidebar">
        <el-card class="purchase-card" shadow="never">
          <!-- 封面圖片：已購買用戶點擊直接進入學習頁面 -->
          <div
            class="course-preview"
            @click="course.isEnrolled ? navigateToLearning() : handleSidebarPreview()"
          >
            <img :src="course.cover" :alt="course.title" />
            <!-- 訪客用戶：顯示預覽覆蓋層 -->
            <div v-if="!course.isEnrolled" class="play-overlay">
              <el-icon class="play-icon"><VideoPlay /></el-icon>
              <span class="preview-text">預覽課程</span>
            </div>
          </div>

          <!-- 價格區域：已購買用戶不顯示價格 -->
          <div v-if="!course.isEnrolled" class="price-section">
            <div class="price">NT${{ course.price }}</div>
          </div>

          <!-- 學習進度：已購買用戶顯示進度條 -->
          <div v-if="course.isEnrolled && course.progress > 0" class="progress-section">
            <div class="progress-label">
              學習進度 {{ Math.round(course.progress) }}%
            </div>
            <el-progress
              :percentage="Math.round(course.progress)"
              :stroke-width="8"
              :color="'#7ec8a3'"
            />
            <!-- 顯示最後觀看資訊 -->
            <div v-if="course.lastWatchedLessonTitle" class="last-watched-info">
              <el-icon><VideoPlay /></el-icon>
              <span>上次觀看：{{ course.lastWatchedLessonTitle }}</span>
            </div>
          </div>

          <!-- 主要按鈕：根據購買狀態切換 -->
          <el-button
            v-if="course.isEnrolled"
            type="primary"
            size="large"
            class="learning-btn"
            @click="navigateToLearning"
          >
            {{ course.progress > 0 ? '繼續學習' : '開始學習' }}
          </el-button>

          <el-button
            v-else
            type="warning"
            size="large"
            class="buy-btn"
            @click="handleBuyNow"
          >
            立即購買
          </el-button>

          <!-- 加入購物車按鈕：僅訪客用戶顯示 -->
          <el-button
            v-if="!course.isEnrolled"
            size="large"
            class="cart-btn"
            @click="handleAddToCart"
          >
            加入購物車
          </el-button>

          <!-- 願望清單按鈕：僅訪客用戶顯示，根據狀態切換 -->
          <el-button
            v-if="!course.isEnrolled"
            size="large"
            :class="isInWishlist ? 'wishlist-btn-active' : 'wishlist-btn'"
            @click="handleToggleWishlist"
          >
            <el-icon><Star :filled="isInWishlist" /></el-icon>
            {{ isInWishlist ? '移除願望清單' : '加入願望清單' }}
          </el-button>

          <div class="course-includes">
            <h4 class="includes-title">課程總長</h4>
            <div class="include-item">
              <el-icon><Clock /></el-icon>
              <span>{{ course.totalLength }}</span>
            </div>

            <h4 class="includes-title">章節數量</h4>
            <div class="include-item">
              <el-icon><List /></el-icon>
              <span>{{ course.sections }} 個章節</span>
            </div>

            <h4 class="includes-title">課程資源</h4>
            <div class="include-item">
              <el-icon><Download /></el-icon>
              <span>{{ course.resources }} 個可下載資源</span>
            </div>
          </div>
        </el-card>
      </el-aside>
    </el-container>

    <!-- Mobile Sticky Action Bar (手機版底部懸浮購買列) -->
    <div class="mobile-action-bar mobile-only">
      <div v-if="!course.isEnrolled" class="action-price">
        NT${{ course.price }}
      </div>
      <div class="action-buttons">
        <el-button
          v-if="course.isEnrolled"
          type="primary"
          size="large"
          class="action-btn"
          @click="navigateToLearning"
        >
          {{ course.progress > 0 ? '繼續學習' : '開始學習' }}
        </el-button>
        <template v-else>
          <el-button
            type="warning"
            size="large"
            class="action-btn"
            @click="handleBuyNow"
          >
            立即購買
          </el-button>
          <el-button
            :icon="Star"
            circle
            size="large"
            :type="isInWishlist ? 'warning' : 'default'"
            @click="handleToggleWishlist"
          />
        </template>
      </div>
    </div>

    <!-- Preview Modal -->
    <el-dialog
      v-model="isPreviewVisible"
      title="課程預覽"
      width="800px"
      center
      :close-on-click-modal="false"
      @close="handleClosePreview"
    >
      <div class="preview-player-container">
        <div ref="videoContainer" class="video-wrapper">
          <video
            ref="videoElement"
            class="video-element"
            playsinline
          ></video>
          <!-- 購買課程覆蓋層 -->
          <div v-if="showBuyOverlay" class="buy-overlay">
              <div class="buy-overlay-content">
                <el-icon class="buy-icon"><Lock /></el-icon>
                <h3 class="buy-title">試看結束</h3>
                <p class="buy-text">購買課程以繼續學習完整內容</p>
                <el-button
                  type="warning"
                  size="large"
                  class="buy-now-btn"
                  @click="handleBuyNow"
                >
                  立即購買課程
                </el-button>
              </div>
            </div>
          </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { List, Download, Clock, VideoPlay, Lock, Star } from '@element-plus/icons-vue'
import { ElMessage, ElLoading } from 'element-plus'
import CourseContent from '@/components/student/CourseDetail/CourseContent.vue'
import CourseIntro from '@/components/student/CourseDetail/CourseIntro.vue'
import InstructorCard from '@/components/student/CourseDetail/InstructorCard.vue'
import RatingsReviews from '@/components/student/CourseDetail/RatingsReviews.vue'
import VideoPlayer from '@llamohank/custom-shaka-player'
import {
  fetchCourseDetail,
  calculateTotalDuration,
  formatRatingDistribution,
  extractLearningPoints,
  getPreviewVideoUrl
} from '@/api/student/courseDetail'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { useWishlistStore } from '@/stores/wishlist'
import { createOrder } from '@/api/student/orders'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()
const wishlistStore = useWishlistStore()

// 載入狀態
const loading = ref(false)
const error = ref(null)

// API 回應的原始資料
const courseData = ref(null)

// 計算屬性：將 API 資料轉換為元件需要的格式
const course = computed(() => {
  if (!courseData.value || !courseData.value.courseInfo) {
    return {
      id: null,
      title: '',
      description: '',
      cover: '',
      price: 0,
      duration: '0h',
      sections: 0,
      attachments: 0,
      totalLength: '0 hours on-demand video',
      resources: 0,
      rating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      instructor: {
        name: '',
        title: '',
        avatar: '',
        bio: ''
      },
      learningPoints: [],
      contentSections: [],
      reviews: [],
      isEnrolled: false,
      progress: 0,
      lastWatchedProgressId: null,
      lastWatchedLessonTitle: null,
      lastWatchedSectionTitle: null
    }
  }

  const { courseInfo } = courseData.value
  const { course: courseBasic, sections, rateTable, userReviews, isEnrolled } = courseInfo

  // 使用後端提供的總時長（已轉換為小時並向上取整）
  const totalHours = courseBasic?.totalHours || 0

  return {
    id: courseBasic?.courseId,
    title: courseBasic?.title || '',
    description: courseBasic?.description || '',
    cover: courseBasic?.coverImageUrl || 'https://via.placeholder.com/800x400?text=Course+Image',
    price: courseBasic?.price || 0,
    duration: `${totalHours}h`,
    sections: courseBasic?.totalSections || 0,
    attachments: courseBasic?.attachmentCount || 0,
    totalLength: `${totalHours} 小時的影片`,
    resources: courseBasic?.attachmentCount || 0,
    rating: rateTable?.averageRating || 0,
    totalReviews: rateTable?.reviewCount || 0,
    ratingDistribution: (() => {
      const distribution = formatRatingDistribution(rateTable)
      console.log('📊 評分分佈:', distribution)
      return distribution
    })(),
    instructor: {
      id: courseBasic?.instructor?.instructorId,
      name: courseBasic?.instructor?.instructorName || '',
      title: `${courseBasic?.instructor?.totalCourses || 0} 門課程 • ${courseBasic?.instructor?.totalStudents || 0} 位學生`,
      avatar: courseBasic?.instructor?.avatarUrl || 'https://via.placeholder.com/200?text=Instructor',
      bio: courseBasic?.instructor?.bio || ''
    },
    // 使用課程描述作為學習重點
    learningPoints: extractLearningPoints(sections),
    contentSections: (sections || []).map(section => ({
      name: section.title,
      sectionId: section.sectionId,
      displayOrder: section.displayOrder,
      lessons: (section.lessons || []).map(lesson => ({
        id: lesson.lessonId,
        title: lesson.lessonTitle,
        duration: lesson.lessonDurationText || '0分0秒',
        preview: lesson.freePreview,
        description: lesson.description,
        displayOrder: lesson.displayOrder
      }))
    })),
    // 使用後端提供的評論資料
    reviews: (userReviews || []).map(review => ({
      id: review.rateId,
      name: review.userName,
      avatar: review.userAvatarUrl || 'https://via.placeholder.com/100?text=User',
      date: formatReviewDate(review.createdAt),
      rating: review.rating,
      text: review.comment
    })),
    // 從後端 API 取得購買狀態（在 courseInfo 層級）
    isEnrolled: isEnrolled || false,
    // 從 CourseProgressVo 取得進度資訊
    progress: courseBasic?.completionPercentage || 0,
    lastWatchedProgressId: courseBasic?.lastWatchedLessonId || null,
    lastWatchedLessonTitle: courseBasic?.lastWatchedLessonTitle || null,
    lastWatchedSectionTitle: courseBasic?.lastWatchedSectionTitle || null
  }
})

/**
 * 檢查課程是否在願望清單中
 */
const isInWishlist = computed(() => {
  return course.value.id ? wishlistStore.hasItem(course.value.id) : false
})

/**
 * 格式化評論日期
 */
const formatReviewDate = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)

  const diffMinutes = Math.floor(diffTime / (1000 * 60))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) {
    return '剛剛'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} 分鐘前`
  } else if (diffHours < 24) {
    return `${diffHours} 小時前`
  } else if (diffDays < 30) {
    return `${diffDays} 天前`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} 個月前`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years} 年前`
  }
}

// Mock related courses
const relatedCourses = ref([
  {
    id: 2,
    title: 'Complete Web Development Bootcamp',
    cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    teacher: 'Sarah Johnson',
    rating: 4.8
  },
  {
    id: 3,
    title: 'Data Science and Machine Learning with Python',
    cover: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
    teacher: 'Michael Chen',
    rating: 4.9
  },
  {
    id: 4,
    title: 'Advanced Machine Learning Techniques',
    cover: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    teacher: 'Emily Rodriguez',
    rating: 4.7
  }
])

// 預覽 Modal 狀態
const isPreviewVisible = ref(false)
const currentPreviewUrl = ref('')
const currentPreviewLessonId = ref(null)
const showBuyOverlay = ref(false)

// Video Player Refs
const videoElement = ref(null)
const videoContainer = ref(null)
let player = null

// 建立完整的課程列表（扁平化）
const flatLessonList = computed(() => {
  const lessons = []
  if (course.value.contentSections && course.value.contentSections.length > 0) {
    course.value.contentSections.forEach(section => {
      if (section.lessons && section.lessons.length > 0) {
        section.lessons.forEach(lesson => {
          lessons.push({
            ...lesson,
            sectionName: section.name
          })
        })
      }
    })
  }
  return lessons
})

/**
 * 統一的預覽處理函數 - 支援兩種入口
 */
const handlePreview = (previewInfo) => {
  console.log('Preview triggered:', previewInfo)

  // Entry Point A: 從 Header 按鈕點擊（播放第一個免費課程）
  if (previewInfo.fromHeader) {
    const firstFreeLesson = findFirstFreeLesson()
    if (firstFreeLesson) {
      openPreview(firstFreeLesson.id)
    } else {
      ElMessage.warning('此課程暫無可預覽內容')
    }
  }
  // Entry Point B: 從課程列表按鈕點擊（播放指定課程）
  else if (previewInfo.lessonId) {
    openPreview(previewInfo.lessonId)
  }
}

/**
 * 處理課程列表項目點擊
 */
const handleLessonClick = (lessonInfo) => {
  console.log('Lesson clicked:', lessonInfo)

  // 如果用戶已購買課程，直接導航到學習頁面
  if (course.value.isEnrolled) {
    router.push({
      name: 'courseLearning',
      params: { id: course.value.id },
      query: { lessonId: lessonInfo.lessonId }
    })
  } else {
    // 訪客用戶：檢查是否為免費試看課程
    if (lessonInfo.isFreePreview) {
      // 免費課程：開啟預覽 Modal
      openPreview(lessonInfo.lessonId)
    } else {
      // 付費課程：顯示警告訊息
      ElMessage.warning('請購買課程以觀看此單元')
    }
  }
}

/**
 * 導航到學習頁面
 * 優先導向上次學習的單元，否則導向第一個單元
 */
const navigateToLearning = () => {
  if (!course.value.id) {
    ElMessage.error('課程資訊錯誤')
    return
  }

  // 優先使用後端提供的上次觀看單元 ID (lastWatchedLessonId)
  let targetLessonId = course.value.lastWatchedProgressId

  // 如果沒有學習記錄，使用第一個單元
  if (!targetLessonId) {
    const firstLesson = course.value.contentSections?.[0]?.lessons?.[0]
    if (!firstLesson) {
      ElMessage.error('課程尚無單元')
      return
    }
    targetLessonId = firstLesson.id
  }

  router.push({
    name: 'courseLearning',
    params: {
      courseId: course.value.id,
      lessonId: targetLessonId
    }
  })
}

/**
 * 處理立即購買
 */
const handleBuyNow = async () => {
  // 檢查登入狀態
  if (!userStore.isAuthenticated) {
    ElMessage.warning('請先登入以購買課程')
    // 導向登入頁，並帶上當前頁面作為回跳參數
    router.push({
      name: 'login',
      query: { redirect: route.fullPath }
    })
    return
  }

  if (!course.value.id) {
    ElMessage.error('課程資訊錯誤')
    return
  }

  // 已擁有課程就直接帶去學習頁，避免觸發 400
  if (course.value.isEnrolled) {
    ElMessage.info('您已擁有此課程，帶您回到學習頁')
    navigateToLearning()
    return
  }

  // 檢查課程是否已在購物車中
  const alreadyInCart = cartStore.hasItem(course.value.id)

  if (alreadyInCart) {
    // 課程已在購物車，直接跳轉到結帳頁面
    router.push({
      name: 'checkout',
      query: { autoSelect: course.value.id }
    })
    return
  }

  const loadingInstance = ElLoading.service({
    lock: true,
    text: '正在加入購物車...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    // 步驟 1: 先加入購物車
    const added = await cartStore.addItem({
      id: course.value.id,
      title: course.value.title,
      instructor: course.value.instructor.name,
      price: course.value.price,
      cover_image_url: course.value.cover
    })

    if (!added) {
      // 如果加入購物車失敗（可能已擁有課程等其他原因）
      // addItem 已經顯示了錯誤訊息，直接返回
      loadingInstance.close()
      return
    }

    // 步驟 2: 導向結帳頁面，並帶上課程 ID 以自動選中
    router.push({
      name: 'checkout',
      query: { autoSelect: course.value.id }
    })
  } catch (error) {
    console.error('立即購買失敗:', error)
    ElMessage.error('操作失敗，請稍後再試')
  } finally {
    loadingInstance.close()
  }
}

/**
 * 處理加入購物車
 */
const handleAddToCart = async () => {
  // 檢查登入狀態
  if (!userStore.isAuthenticated) {
    ElMessage.warning('請先登入以加入購物車')
    // 導向登入頁，並帶上當前頁面作為回跳參數
    router.push({
      name: 'login',
      query: { redirect: route.fullPath }
    })
    return
  }

  if (!course.value.id) {
    ElMessage.error('課程資訊錯誤')
    return
  }

  // 使用 cartStore 的 addItem 方法
  await cartStore.addItem({
    id: course.value.id,
    title: course.value.title,
    instructor: course.value.instructor.name,
    price: course.value.price,
    cover_image_url: course.value.cover
  })
}

/**
 * 處理願望清單切換（加入/移除）
 */
const handleToggleWishlist = async () => {
  // 檢查登入狀態
  if (!userStore.isAuthenticated) {
    ElMessage.warning('請先登入以使用願望清單功能')
    router.push({
      name: 'login',
      query: { redirect: route.fullPath }
    })
    return
  }

  if (!course.value.id) {
    ElMessage.error('課程資訊錯誤')
    return
  }

  // 檢查課程是否已在願望清單中
  if (isInWishlist.value) {
    // 從願望清單移除
    await wishlistStore.removeItem(course.value.id)
  } else {
    // 加入願望清單
    await wishlistStore.addItem({
      id: course.value.id,
      title: course.value.title,
      instructor: course.value.instructor.name,
      price: course.value.price,
      cover_image_url: course.value.cover
    })
  }
}

/**
 * 處理側邊欄封面圖片點擊 - 播放第一個可預覽的課程
 */
const handleSidebarPreview = () => {
  const firstFreeLesson = findFirstFreeLesson()
  if (firstFreeLesson) {
    openPreview(firstFreeLesson.id)
  } else {
    ElMessage.warning('此課程暫無可預覽內容')
  }
}

/**
 * 統一的開啟預覽函數
 */
const openPreview = async (lessonId) => {
  currentPreviewLessonId.value = lessonId
  currentPreviewUrl.value = getPreviewVideoUrl(lessonId)
  isPreviewVisible.value = true
  showBuyOverlay.value = false
  console.log('🎬 開啟預覽 Modal，Lesson ID:', lessonId, 'URL:', currentPreviewUrl.value)

  // 等待 DOM 更新後初始化播放器
  await nextTick()
  await initPreviewPlayer()
}

/**
 * 初始化預覽播放器
 */
const initPreviewPlayer = async () => {
  try {
    if (!videoElement.value || !videoContainer.value) {
      console.error('Video elements not found')
      return
    }

    // 建立播放器實例
    player = new VideoPlayer(
      videoElement.value,
      videoContainer.value,
      { seekJumpSeconds: 10 }
    )

    // 初始化播放器
    const initialized = await player.initialize()
    if (!initialized) {
      throw new Error('您的瀏覽器不支援影片播放功能')
    }

    // 載入並播放影片
    await player.play(currentPreviewUrl.value)

    // 監聽影片結束事件
    videoElement.value.addEventListener('ended', handleVideoEnded)

    // 自動播放
    await videoElement.value.play()

    console.log('✅ 預覽播放器初始化成功')
  } catch (err) {
    console.error('❌ 預覽播放器初始化失敗:', err)
    ElMessage.error('影片載入失敗，請稍後再試')
  }
}

/**
 * 處理影片結束事件 - 自動播放下一個免費課程
 */
const handleVideoEnded = async () => {
  console.log('🎬 影片播放結束，尋找下一個免費課程...')

  // 找到當前課程在列表中的索引
  const currentIndex = flatLessonList.value.findIndex(
    lesson => lesson.id === currentPreviewLessonId.value
  )

  if (currentIndex === -1) {
    console.error('❌ 找不到當前課程')
    return
  }

  // 從當前課程的下一個開始搜尋
  let nextFreeLesson = null
  for (let i = currentIndex + 1; i < flatLessonList.value.length; i++) {
    const lesson = flatLessonList.value[i]
    // 只播放標記為免費試看的課程（is_free_preview === 1 或 preview === true）
    if (lesson.preview) {
      nextFreeLesson = lesson
      break
    }
  }

  if (nextFreeLesson) {
    console.log('✅ 找到下一個免費課程:', nextFreeLesson.title)
    // 清理當前播放器
    if (player) {
      videoElement.value.removeEventListener('ended', handleVideoEnded)
      await player.destroy()
      player = null
    }
    // 播放下一個課程
    await openPreview(nextFreeLesson.id)
  } else {
    console.log('⚠️ 沒有更多免費課程，顯示購買提示')
    // 顯示購買課程覆蓋層
    showBuyOverlay.value = true
  }
}

/**
 * 關閉預覽 Modal
 */
const handleClosePreview = async () => {
  // 移除事件監聽器
  if (videoElement.value) {
    videoElement.value.removeEventListener('ended', handleVideoEnded)
  }

  // 清理播放器
  if (player) {
    await player.destroy()
    player = null
  }

  isPreviewVisible.value = false
  currentPreviewUrl.value = ''
  currentPreviewLessonId.value = null
  showBuyOverlay.value = false
}

/**
 * 找到第一個免費試看課程
 */
const findFirstFreeLesson = () => {
  return flatLessonList.value.find(lesson => lesson.preview) || null
}

/**
 * 載入課程詳情資料
 */
const loadCourseDetail = async () => {
  const courseId = route.params.id

  if (!courseId) {
    ElMessage.error('課程 ID 不存在')
    router.push('/explore')
    return
  }

  loading.value = true
  error.value = null

  const loadingInstance = ElLoading.service({
    lock: true,
    text: '載入課程資料中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    console.log('🔄 開始載入課程詳情，ID:', courseId)
    const data = await fetchCourseDetail(courseId)
    console.log('✅ 課程詳情載入成功:', data)
    console.log('📊 isEnrolled 狀態:', data?.courseInfo?.isEnrolled)
    console.log('⭐ 平均評分:', data?.courseInfo?.rateTable?.averageRating)
    console.log('💬 總評論數:', data?.courseInfo?.rateTable?.reviewCount)

    courseData.value = data

  } catch (err) {
    console.error('❌ 載入課程詳情失敗:', err)
    error.value = err.message || '載入課程資料失敗'

    // 根據錯誤類型顯示不同訊息
    if (err.message === '課程未上架或不存在') {
      ElMessage.error('此課程未上架或不存在')
      // 延遲後導向探索頁
      setTimeout(() => {
        router.push('/explore')
      }, 2000)
    } else {
      ElMessage.error('載入課程資料失敗，請稍後再試')
    }
  } finally {
    loading.value = false
    loadingInstance.close()
  }
}

onMounted(() => {
  loadCourseDetail()
})

onBeforeUnmount(async () => {
  // 清理播放器
  if (player) {
    await player.destroy()
    player = null
  }
})
</script>

<style lang="scss" scoped>
.course-detail-page {
  min-height: 100vh;
  background: #FCF9F4;
  /* 為手機版底部懸浮列預留空間 */
  @include mobile {
    padding-bottom: 80px;
  }
}

.main-container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 32px 24px;
  align-items: flex-start;

  @include below($bp-xl) {
    flex-direction: column;
  }

  @include mobile {
    padding: 24px 16px;
  }
}

.main-content {
  padding: 0 24px 0 0;

  @include below($bp-xl) {
    padding: 0;
    width: 100%;
  }
}

/* 桌面版隱藏主要封面圖片 */
.course-media {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: none; /* 預設隱藏 */

  &.mobile-only {
    /* 平板和桌面版隱藏 (>= 768px) */
    @include not-mobile {
      display: none !important;
    }

    /* 手機版顯示 (< 768px) */
    @include mobile {
      display: block;
      height: 250px;
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

/* Sticky Sidebar */
.sidebar {
  position: sticky;
  top: 20px;
  z-index: 10;

  @include below($bp-xl) {
    width: 100%;
    position: static;
    margin-top: 24px;
  }
}

.purchase-card {
  border-radius: 12px;
  border: 1px solid #e8e8e8;

  :deep(.el-card__body) {
    padding: 0;
  }
}

/* 課程預覽區域 - 添加播放覆蓋層 */
.course-preview {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);

    .play-overlay {
      opacity: 1;
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

/* 播放覆蓋層 */
.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.play-icon {
  font-size: 48px;
  color: white;
}

.preview-text {
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.price-section {
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.price {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
}

/* 學習進度區域 */
.progress-section {
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.progress-label {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 12px;
}

.last-watched-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 13px;
  color: #909399;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 6px;

  .el-icon {
    color: #7ec8a3;
    font-size: 16px;
  }
}

.buy-btn,
.cart-btn,
.learning-btn {
  width: calc(100% - 48px);
  margin: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
}

/* Buy Now 按鈕改為橘色 (Warning) */
.buy-btn {
  background: var(--capy-warning, #FB8C00);
  border-color: var(--capy-warning, #FB8C00);
  color: white;

  &:hover {
    background: var(--el-color-warning-dark-2, #c97000);
    border-color: var(--el-color-warning-dark-2, #c97000);
  }
}

/* 學習按鈕 (Primary - 綠色/藍色) */
.learning-btn {
  background: var(--capy-primary, #7ec8a3);
  border-color: var(--capy-primary, #7ec8a3);
  color: white;

  &:hover {
    background: var(--el-color-primary-dark-2, #5fa885);
    border-color: var(--el-color-primary-dark-2, #5fa885);
  }
}

/* Add to Cart 保持為 Outlined 樣式 */
.cart-btn {
  background: #fff;
  border: 2px solid #7ec8a3;
  color: #7ec8a3;

  &:hover {
    background: #f0f9f4;
  }
}

/* 願望清單按鈕樣式 - 未加入狀態 */
.wishlist-btn {
  width: calc(100% - 48px);
  margin: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  background: #fff;
  border: 2px solid #FB8C00;
  color: #FB8C00;
  transition: all 0.3s ease;

  &:hover {
    background: #FFF3E0;
  }

  .el-icon {
    margin-right: 4px;
  }
}

/* 願望清單按鈕樣式 - 已加入狀態 */
.wishlist-btn-active {
  width: calc(100% - 48px);
  margin: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  background: #FB8C00;
  border: 2px solid #FB8C00;
  color: #fff;
  transition: all 0.3s ease;

  &:hover {
    background: #E67E00;
    border-color: #E67E00;
  }

  .el-icon {
    margin-right: 4px;
  }
}

.course-includes {
  padding: 24px;
}

.includes-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;

  &:not(:first-child) {
    margin-top: 20px;
  }
}

.include-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  font-size: 14px;
  color: #666;

  .el-icon {
    color: #7ec8a3;
    font-size: 18px;
  }
}

/* 預覽播放器容器 */
.preview-player-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;

  /* 手機版取消圓角，最大化顯示區域 */
  @include mobile {
    border-radius: 4px;
  }
}

.video-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
}

.video-element {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 購買課程覆蓋層 */
.buy-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85); /* 手機版加深背景，提升對比 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Mobile Action Bar - 手機版底部懸浮購買列 */
.mobile-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 12px 16px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
  gap: 12px;

  /* 桌面版隱藏 */
  @include not-mobile {
    display: none !important;
  }

  /* 手機版顯示 */
  @include mobile {
    display: flex;
  }

  .action-price {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    flex: 1;
    justify-content: flex-end;

    .action-btn {
      flex: 1;
      max-width: 200px;
    }
  }
}

.buy-overlay-content {
  text-align: center;
  padding: 40px;
  max-width: 400px;
  width: 100%;

  /* 手機版優化 */
  @include mobile {
    padding: 20px;
    max-width: 90%;
  }
}

.buy-icon {
  font-size: 64px;
  color: var(--capy-warning);
  margin-bottom: 24px;

  @include mobile {
    font-size: 40px;
    margin-bottom: 12px;
  }
}

.buy-title {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0 0 16px 0;

  @include mobile {
    font-size: 20px;
    margin: 0 0 8px 0;
  }
}

.buy-text {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 32px 0;
  line-height: 1.6;

  @include mobile {
    font-size: 14px;
    margin: 0 0 20px 0;
  }
}

.buy-now-btn {
  font-size: 16px;
  font-weight: 600;
  padding: 14px 32px;
  height: auto;

  @include mobile {
    font-size: 14px;
    padding: 10px 24px;
    width: 100%; /* 手機版按鈕全寬 */
  }
}

/* 調整 Element Plus Dialog 在手機版的樣式 */
:deep(.el-dialog) {
  @include mobile {
    width: 95% !important; /* 寬度佔滿 */
    margin-top: 10vh !important; /* 調整垂直位置 */

    .el-dialog__body {
      padding: 10px; /* 減少內距 */
    }
  }
}

/* Shaka Player 控制列樣式 */
:deep(.shaka-controls-container) {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

:deep(.shaka-play-button),
:deep(.shaka-volume-bar-container),
:deep(.shaka-current-time),
:deep(.shaka-time-separator),
:deep(.shaka-duration) {
  color: var(--capy-primary, #54CDF2);
}

:deep(.shaka-seek-bar-container) {
  .shaka-seek-bar {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .shaka-buffered-range {
    background-color: rgba(255, 255, 255, 0.5);
  }

  .shaka-played-range {
    background-color: var(--capy-primary, #54CDF2);
  }
}
</style>
