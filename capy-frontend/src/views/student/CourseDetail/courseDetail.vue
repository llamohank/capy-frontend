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

        <!-- Course Video/Image -->
        <div class="course-media">
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
          <div class="course-preview">
            <img :src="course.cover" :alt="course.title" />
          </div>

          <div class="price-section">
            <div class="price">${{ course.price }}</div>
          </div>

          <el-button type="success" size="large" class="buy-btn">
            Buy Now
          </el-button>

          <el-button size="large" class="cart-btn">
            Add to Cart
          </el-button>

          <div class="course-includes">
            <h4 class="includes-title">Total Length</h4>
            <div class="include-item">
              <el-icon><Clock /></el-icon>
              <span>{{ course.totalLength }}</span>
            </div>

            <h4 class="includes-title">Sections</h4>
            <div class="include-item">
              <el-icon><List /></el-icon>
              <span>{{ course.sections }} sections</span>
            </div>

            <h4 class="includes-title">Resources</h4>
            <div class="include-item">
              <el-icon><Download /></el-icon>
              <span>{{ course.resources }} downloadable resources</span>
            </div>
          </div>
        </el-card>
      </el-aside>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { List, Download, Clock } from '@element-plus/icons-vue'
import { ElMessage, ElLoading } from 'element-plus'
import CourseContent from '@/components/student/CourseDetail/CourseContent.vue'
import CourseIntro from '@/components/student/CourseDetail/CourseIntro.vue'
import InstructorCard from '@/components/student/CourseDetail/InstructorCard.vue'
import RatingsReviews from '@/components/student/CourseDetail/RatingsReviews.vue'
import {
  fetchCourseDetail,
  calculateTotalDuration,
  formatRatingDistribution,
  extractLearningPoints
} from '@/api/student/courseDetail'

const route = useRoute()
const router = useRouter()

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
      reviews: []
    }
  }

  const { courseInfo } = courseData.value
  const { course: courseBasic, sections, rateTable, userReviews } = courseInfo

  // 計算總時長
  const totalDurationMinutes = calculateTotalDuration(sections || [])
  const totalHours = Math.floor(totalDurationMinutes / 60)
  const totalMinutes = totalDurationMinutes % 60

  return {
    id: courseBasic?.courseId,
    title: courseBasic?.title || '',
    description: courseBasic?.description || '',
    cover: courseBasic?.coverImageUrl || 'https://via.placeholder.com/800x400?text=Course+Image',
    price: courseBasic?.price || 0,
    duration: `${totalHours}h ${totalMinutes}m`,
    sections: courseBasic?.totalSections || 0,
    attachments: 0, // API 未提供此欄位
    totalLength: `${totalHours} hours ${totalMinutes} minutes on-demand video`,
    resources: 0, // API 未提供此欄位
    rating: rateTable?.averageRating || 0,
    totalReviews: rateTable?.reviewCount || 0,
    ratingDistribution: formatRatingDistribution(rateTable),
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
        duration: `${lesson.lessonDurationMinutes}m`,
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
    }))
  }
})

/**
 * 格式化評論日期
 */
const formatReviewDate = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 30) {
    return `${diffDays} days ago`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} month${months > 1 ? 's' : ''} ago`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years} year${years > 1 ? 's' : ''} ago`
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

const handlePreview = (previewInfo) => {
  // 處理試看影片播放
  console.log('Preview lesson:', previewInfo)
  // 這裡可以實作影片播放邏輯，例如：
  // - 開啟影片播放器 modal
  // - 跳轉到影片播放頁面
  // - 或直接在當前頁面播放
  alert(`試看影片：\n章節 ${previewInfo.sectionIndex + 1}\n課程 ${previewInfo.lessonIndex + 1}`)
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
</script>

<style scoped>
.course-detail-page {
  min-height: 100vh;
  background: #FCF9F4;
}

.main-container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 32px 24px;
  align-items: flex-start;
}

.main-content {
  padding: 0 24px 0 0;
}

.course-media {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.course-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar {
  position: sticky;
  top: 24px;
}

.purchase-card {
  border-radius: 12px;
  border: 1px solid #e8e8e8;
}

.purchase-card :deep(.el-card__body) {
  padding: 0;
}

.course-preview {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.course-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.buy-btn,
.cart-btn {
  width: calc(100% - 48px);
  margin: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
}

.buy-btn {
  background: #7ec8a3;
  border-color: #7ec8a3;
}

.buy-btn:hover {
  background: #6bb890;
  border-color: #6bb890;
}

.cart-btn {
  background: #fff;
  border: 2px solid #7ec8a3;
  color: #7ec8a3;
}

.cart-btn:hover {
  background: #f0f9f4;
}

.course-includes {
  padding: 24px;
}

.includes-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.includes-title:not(:first-child) {
  margin-top: 20px;
}

.include-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  font-size: 14px;
  color: #666;
}

.include-item .el-icon {
  color: #7ec8a3;
  font-size: 18px;
}

@media (max-width: 1200px) {
  .main-container {
    flex-direction: column;
  }

  .main-content {
    padding: 0;
    width: 100%;
  }

  .sidebar {
    width: 100%;
    position: static;
    margin-top: 24px;
  }
}

@media (max-width: 768px) {
  .main-container {
    padding: 24px 16px;
  }

  .course-media {
    height: 250px;
  }
}
</style>
