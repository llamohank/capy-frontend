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

        <!-- Related Courses -->
        <RelatedCourses :courses="relatedCourses" />
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { List, Download, Clock } from '@element-plus/icons-vue'
import CourseContent from '@/components/student/CourseDetail/CourseContent.vue'
import CourseIntro from '@/components/student/CourseDetail/CourseIntro.vue'
import InstructorCard from '@/components/student/CourseDetail/InstructorCard.vue'
import RatingsReviews from '@/components/student/CourseDetail/RatingsReviews.vue'
import RelatedCourses from '@/components/student/CourseDetail/RelatedCourses.vue'

const route = useRoute()

// Mock course data
const course = ref({
  id: 1,
  title: 'Mastering Python Programming: From Beginner to Advanced',
  description: 'Unlock the power of Python with this comprehensive course, covering everything from basic syntax to advanced concepts like data structures, algorithms, and web development. Learn by doing with hands-on projects and real-world examples.',
  cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
  price: 4000,
  duration: '22h',
  sections: 10,
  attachments: 20,
  totalLength: '22 hours on-demand video',
  resources: 20,
  rating: 4.7,
  totalReviews: 1234,
  ratingDistribution: {
    5: 40,
    4: 30,
    3: 15,
    2: 10,
    1: 5
  },
  instructor: {
    name: 'Dr. Alex Turner',
    title: 'Experienced Python Developer and Instructor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    bio: 'Dr. Turner has over 10 years of experience in software development and has taught thousands of students online. He is passionate about making complex topics accessible and enjoyable to learn.'
  },
  learningPoints: [
    '掌握 Python 基礎語法和核心概念',
    '理解物件導向程式設計 (OOP) 原則',
    '學習資料結構和演算法的實作',
    '建立 REST API 和 Web 應用程式',
    '使用 Python 進行資料處理和分析',
    '實作機器學習基礎專案',
    '掌握檔案處理和資料庫操作',
    '部署 Python 應用程式到生產環境'
  ],
  contentSections: [
    {
      name: 'Introduction to Python',
      lessons: [
        { title: 'Getting Started (1h 30m)', duration: '1h 30m', preview: true },
        { title: 'Basic Syntax (2h)', duration: '2h', preview: true },
        { title: 'Setting up the Environment (1h 15m)', duration: '1h 15m', preview: false }
      ]
    },
    {
      name: 'Data Types and Variables',
      lessons: [
        { title: 'Numbers and Strings', duration: '45m', preview: false },
        { title: 'Lists and Tuples', duration: '1h', preview: false },
        { title: 'Dictionaries and Sets', duration: '50m', preview: false }
      ]
    },
    {
      name: 'Control Flow Statements',
      lessons: [
        { title: 'If-Else Conditions', duration: '40m', preview: false },
        { title: 'Loops: For and While', duration: '55m', preview: false },
        { title: 'Break and Continue', duration: '30m', preview: false }
      ]
    },
    {
      name: 'Functions and Modules',
      lessons: [
        { title: 'Defining Functions', duration: '1h', preview: false },
        { title: 'Lambda Functions', duration: '35m', preview: false },
        { title: 'Importing Modules', duration: '45m', preview: false }
      ]
    },
    {
      name: 'Object-Oriented Programming',
      lessons: [
        { title: 'Classes and Objects', duration: '1h 20m', preview: false },
        { title: 'Inheritance', duration: '50m', preview: false },
        { title: 'Polymorphism', duration: '45m', preview: false }
      ]
    },
    {
      name: 'Data Structures and Algorithms',
      lessons: [
        { title: 'Arrays and Linked Lists', duration: '1h 10m', preview: false },
        { title: 'Stacks and Queues', duration: '55m', preview: false },
        { title: 'Trees and Graphs', duration: '1h 30m', preview: false }
      ]
    },
    {
      name: 'File Handling and I/O',
      lessons: [
        { title: 'Reading Files', duration: '40m', preview: false },
        { title: 'Writing Files', duration: '35m', preview: false },
        { title: 'Working with CSV and JSON', duration: '1h', preview: false }
      ]
    },
    {
      name: 'Working with Databases',
      lessons: [
        { title: 'SQL Basics', duration: '1h 15m', preview: false },
        { title: 'Connecting to Databases', duration: '50m', preview: false },
        { title: 'CRUD Operations', duration: '1h', preview: false }
      ]
    },
    {
      name: 'Web Development with Python',
      lessons: [
        { title: 'Introduction to Flask', duration: '1h 20m', preview: false },
        { title: 'Building REST APIs', duration: '1h 30m', preview: false },
        { title: 'Deploying Applications', duration: '1h', preview: false }
      ]
    },
    {
      name: 'Advanced Topics and Projects',
      lessons: [
        { title: 'Machine Learning Basics', duration: '1h 45m', preview: false },
        { title: 'Data Visualization', duration: '1h 10m', preview: false },
        { title: 'Final Project', duration: '2h', preview: false }
      ]
    }
  ],
  reviews: [
    {
      id: 1,
      name: 'Sophia Carter',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      date: '1 month ago',
      rating: 5,
      text: 'This course is fantastic! The instructor explains complex concepts clearly, and the hands-on projects are really helpful for applying what I\'ve learned. I\'ve gone from knowing nothing about Python to feeling confident in my ability to build applications.'
    },
    {
      id: 2,
      name: 'Ethan Bennett',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      date: '2 months ago',
      rating: 4,
      text: 'The course content is comprehensive and well-structured. While the pace might be a bit fast for complete beginners, the instructor provides plenty of resources and support to help you keep up. Overall, a great course for anyone looking to master Python.'
    },
    {
      id: 3,
      name: 'Olivia Hayes',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      date: '3 months ago',
      rating: 5,
      text: 'Absolutely loved this course! The instructor\'s passion for Python is contagious, and the course materials are top-notch. I especially appreciated the focus on practical applications and real-world scenarios. Highly recommended!'
    }
  ]
})

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

onMounted(() => {
  // In a real app, fetch course data based on route.params.id
  console.log('Course ID:', route.params.id)
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
