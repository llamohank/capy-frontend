<template>
  <div class="course-learning-page" v-loading="pageLoading">
    <!-- 主要內容區：Flexbox 容器 -->
    <el-container class="learning-container">
      <!-- 左側：影片播放器 + Info Bar + Tabs 內容區 -->
      <el-main class="main-content" :class="{ 'is-theater-mode': isSidebarCollapsed }">
        <!-- 影片舞台區域 -->
        <div class="video-stage">
          <div class="video-player-box">
            <VideoPlayerShaka
              v-if="currentLesson"
              :video-url="currentLesson.videoUrl"
              :poster="currentLesson.poster"
              :autoplay="false"
              :start-time="0"
              @timeupdate="handleTimeUpdate"
              @ended="handleVideoEnded"
              @error="handleVideoError"
            />
          </div>

          <!-- Hahow 風格邊緣展開按鈕（Theater Mode 時顯示） -->
          <div
            v-if="isSidebarCollapsed"
            class="expand-trigger"
            @click="toggleSidebar"
          >
            <el-icon :size="20">
              <DArrowLeft />
            </el-icon>
          </div>
        </div>

        <!-- Info Bar：課程資訊 + 評分 CTA -->
        <div class="info-bar">
          <div class="info-left">
            <h2 class="lesson-title">{{ currentLesson?.title || '載入中...' }}</h2>
            <p class="course-subtitle">{{ courseData.courseTitle }}</p>
          </div>
          <div class="info-right">
            <div class="rating-cta" @click.stop>
              <el-rate
                v-model="displayRating"
                :disabled="isRated"
                :colors="['#FFD700', '#FFD700', '#FFD700']"
                size="large"
                @change="handleRatingChange"
                class="rating-stars"
              />
              <span
                class="rating-text"
                :class="{ 'clickable': !isRated }"
                @click="handleRatingTextClick"
              >
                {{ isRated ? '您的評分' : '前往評價' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Tabs 內容區 -->
        <div class="content-section">
          <div class="tabs-container">
            <el-tabs v-model="activeTab" class="content-tabs">
              <!-- Tab 1: 課程詳情（混合內容） -->
              <el-tab-pane label="課程詳情" name="details">
                <div class="tab-content">
                  <!-- 單元介紹（如果有） -->
                  <div v-if="currentLesson?.description" class="lesson-intro-box">
                    <h3 class="intro-title">
                      <el-icon><Document /></el-icon>
                      本單元介紹
                    </h3>
                    <div class="intro-content" v-html="sanitizeHtml(currentLesson.description)"></div>
                  </div>

                  <!-- 課程介紹 -->
                  <div class="course-intro-section">
                    <h3 class="section-title">
                      <el-icon><Reading /></el-icon>
                      課程介紹
                    </h3>
                    <div class="course-description" v-html="sanitizeHtml(courseData.description || '暫無課程介紹')"></div>
                  </div>

                  <!-- 講師資訊 -->
                  <div class="instructor-section">
                    <h3 class="section-title">
                      <el-icon><User /></el-icon>
                      講師資訊
                    </h3>
                    <div class="instructor-card">
                      <el-avatar :size="64" :src="courseData.instructor?.avatar" class="instructor-avatar">
                        {{ courseData.instructor?.name?.charAt(0) }}
                      </el-avatar>
                      <div class="instructor-info">
                        <h4 class="instructor-name">{{ courseData.instructor?.name || '講師名稱' }}</h4>
                        <p class="instructor-bio">{{ courseData.instructor?.bio || '暫無講師簡介' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>

              <!-- Tab 2: Q&A（論壇風格） -->
              <el-tab-pane label="Q&A" name="qa">
                <div class="tab-content qa-content">
                  <!-- 操作列：篩選器 + 提問按鈕 -->
                  <div class="qa-action-bar">
                    <el-radio-group v-model="qaFilter" size="large">
                      <el-radio-button label="current">當前單元</el-radio-button>
                      <el-radio-button label="all">全部課程</el-radio-button>
                    </el-radio-group>

                    <el-button
                      type="primary"
                      :icon="Edit"
                      @click="openAskDialog"
                    >
                      我要提問
                    </el-button>
                  </div>

                  <!-- Q&A 列表 -->
                  <div v-if="filteredQA.length > 0" class="qa-list">
                    <div v-for="qa in filteredQA" :key="qa.id" class="qa-item">
                      <!-- 學生問題 -->
                      <div class="question-box">
                        <div class="qa-header">
                          <el-avatar :size="32" :src="qa.student.avatar">
                            {{ qa.student.name.charAt(0) }}
                          </el-avatar>
                          <div class="qa-meta">
                            <span class="qa-author">{{ qa.student.name }}</span>
                            <span class="qa-time">{{ qa.createdAt }}</span>
                          </div>
                        </div>
                        <div class="qa-content">{{ qa.question }}</div>
                      </div>

                      <!-- 講師回答（縮排） -->
                      <div v-if="qa.answer" class="answer-box">
                        <div class="qa-header">
                          <el-avatar :size="32" :src="qa.instructor.avatar">
                            {{ qa.instructor.name.charAt(0) }}
                          </el-avatar>
                          <div class="qa-meta">
                            <span class="qa-author instructor">{{ qa.instructor.name }}</span>
                            <el-tag type="warning" size="small">講師</el-tag>
                            <span class="qa-time">{{ qa.answeredAt }}</span>
                          </div>
                        </div>
                        <div class="qa-content">{{ qa.answer }}</div>
                      </div>
                    </div>
                  </div>
                  <el-empty v-else description="目前沒有問題" :image-size="100" />
                </div>
              </el-tab-pane>

              <!-- Tab 3: 我的提問 -->
              <el-tab-pane label="我的提問" name="my-questions">
                <div class="tab-content qa-content">
                  <div v-if="myQuestions.length > 0" class="qa-list">
                    <div v-for="qa in myQuestions" :key="qa.id" class="qa-item">
                      <!-- 我的問題 -->
                      <div class="question-box">
                        <div class="qa-header">
                          <el-avatar :size="32" :src="qa.student.avatar">
                            {{ qa.student.name.charAt(0) }}
                          </el-avatar>
                          <div class="qa-meta">
                            <span class="qa-author">{{ qa.student.name }}</span>
                            <span class="qa-time">{{ qa.createdAt }}</span>
                          </div>
                        </div>
                        <div class="qa-content">{{ qa.question }}</div>
                      </div>

                      <!-- 講師回答 -->
                      <div v-if="qa.answer" class="answer-box">
                        <div class="qa-header">
                          <el-avatar :size="32" :src="qa.instructor.avatar">
                            {{ qa.instructor.name.charAt(0) }}
                          </el-avatar>
                          <div class="qa-meta">
                            <span class="qa-author instructor">{{ qa.instructor.name }}</span>
                            <el-tag type="warning" size="small">講師</el-tag>
                            <span class="qa-time">{{ qa.answeredAt }}</span>
                          </div>
                        </div>
                        <div class="qa-content">{{ qa.answer }}</div>
                      </div>
                      <div v-else class="answer-box pending">
                        <el-icon><Clock /></el-icon>
                        <span>等待講師回覆...</span>
                      </div>
                    </div>
                  </div>
                  <el-empty v-else description="您還沒有提問" :image-size="100" />
                </div>
              </el-tab-pane>

              <!-- Tab 4: 附件下載 -->
              <el-tab-pane label="附件下載" name="attachments">
                <div class="tab-content">
                  <el-table
                    v-if="currentLesson?.attachments?.length > 0"
                    :data="currentLesson.attachments"
                    stripe
                    style="width: 100%"
                  >
                    <el-table-column prop="name" label="檔案名稱" min-width="200">
                      <template #default="{ row }">
                        <div class="file-name">
                          <el-icon><Document /></el-icon>
                          <span>{{ row.name }}</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" label="類型" width="100">
                      <template #default="{ row }">
                        <el-tag :type="getFileTagType(row.type)" size="small">
                          {{ row.type.toUpperCase() }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="size" label="大小" width="120" />
                    <el-table-column label="操作" width="120" align="center">
                      <template #default="{ row }">
                        <el-button
                          type="primary"
                          size="small"
                          :icon="Download"
                          @click="handleDownload(row)"
                        >
                          下載
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-empty v-else description="本單元無附件" :image-size="100" />
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-main>

      <!-- 右側：章節側邊欄 -->
      <el-aside
        class="sidebar-container"
        :class="{ 'is-collapsed': isSidebarCollapsed }"
        :width="isSidebarCollapsed ? '0px' : '400px'"
      >
        <div class="sidebar-content">
          <ChaptersSidebar
            :chapters="courseData.chapters"
            :current-lesson-id="currentLessonId"
            :is-collapsed="isSidebarCollapsed"
            @lesson-click="handleLessonClick"
            @toggle-sidebar="toggleSidebar"
          />
        </div>
      </el-aside>
    </el-container>

    <!-- 評分對話框 -->
    <CourseRatingDialog
      v-model="ratingDialogVisible"
      :course-info="courseInfoForRating"
      :initial-rating="userRating"
      :initial-comment="userComment"
      @review-submitted="handleReviewSubmitted"
    />

    <!-- 提問對話框 -->
    <el-dialog
      v-model="showAskDialog"
      :title="`提問：${currentLesson?.title || '載入中...'}`"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="askForm" label-position="top">
        <el-form-item label="問題內容">
          <el-input
            v-model="askForm.content"
            type="textarea"
            :rows="6"
            placeholder="請詳細描述您的問題..."
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAskDialog = false">取消</el-button>
        <el-button
          type="primary"
          @click="submitQuestion"
          :disabled="!askForm.content.trim()"
        >
          提交問題
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Document,
  Download,
  Reading,
  User,
  Clock,
  DArrowLeft,
  Edit
} from '@element-plus/icons-vue'
import DOMPurify from 'dompurify'

import VideoPlayerShaka from '@/components/student/CoursePlay/VideoPlayerShaka.vue'
import ChaptersSidebar from '@/components/student/CoursePlay/ChaptersSidebar.vue'
import CourseRatingDialog from '@/components/student/StudentCenter/MyLearning/CourseRatingDialog.vue'

// Pinia Store
import { useCourseStore } from '@/stores/courseStore'

// 導入假資料
import { getCourseData } from '@/mockData'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()

// 狀態管理
const pageLoading = ref(true)
const activeTab = ref('details')

// Theater Mode
const isSidebarCollapsed = computed(() => courseStore.isSidebarCollapsed)
const toggleSidebar = () => courseStore.toggleSidebar()

// 課程資料
const courseData = ref({
  courseId: '',
  courseTitle: '',
  description: '',
  instructor: {
    name: '',
    avatar: '',
    bio: ''
  },
  chapters: []
})

// Q&A 資料
const qaFilter = ref('current')
const allQA = ref([])
const currentUserId = ref('user-001') // Mock 當前用戶 ID

// 評分相關
const userRating = ref(0)
const userComment = ref('')
const ratingDialogVisible = ref(false)

// 提問相關
const showAskDialog = ref(false)
const askForm = ref({
  content: ''
})

// 當前單元 ID
const currentLessonId = computed(() => route.params.lessonId)

/**
 * 取得當前播放的單元
 */
const currentLesson = computed(() => {
  for (const chapter of courseData.value.chapters) {
    const lesson = chapter.lessons.find(l => l.id === currentLessonId.value)
    if (lesson) {
      return lesson
    }
  }
  return null
})

/**
 * 篩選後的 Q&A 列表
 */
const filteredQA = computed(() => {
  if (qaFilter.value === 'current') {
    return allQA.value.filter(qa => qa.lessonId === currentLessonId.value)
  }
  return allQA.value
})

/**
 * 我的提問列表
 */
const myQuestions = computed(() => {
  return allQA.value.filter(qa => qa.student.id === currentUserId.value)
})

/**
 * 課程資訊（用於評分對話框）
 */
const courseInfoForRating = computed(() => {
  if (!courseData.value.courseId) return null

  return {
    courseId: courseData.value.courseId,
    courseTitle: courseData.value.courseTitle,
    instructorName: courseData.value.instructor?.name || '講師',
    coverImageUrl: currentLesson.value?.poster || 'https://via.placeholder.com/400x225'
  }
})

/**
 * 是否已評分
 */
const isRated = computed(() => {
  return userRating.value !== null && userRating.value !== undefined && userRating.value > 0
})

/**
 * 顯示的評分值
 */
const displayRating = computed({
  get() {
    return userRating.value || 0
  },
  set(value) {
    // 由 handleRatingChange 處理
  }
})

/**
 * 載入課程資料
 */
const loadCourseData = async () => {
  try {
    pageLoading.value = true

    // 模擬 API 呼叫
    await new Promise(resolve => setTimeout(resolve, 500))

    const courseId = route.params.courseId
    const data = getCourseData(courseId)

    if (!data) {
      throw new Error('課程不存在')
    }

    courseData.value = {
      ...data,
      description: data.description || '<p>這是一門精心設計的課程，將帶領您深入了解相關知識與技能。</p>',
      instructor: {
        name: '王小明',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        bio: '資深講師，擁有 10 年以上教學經驗，專注於提供高品質的線上課程內容。'
      }
    }

    // 更新路由 meta
    route.meta.courseTitle = data.courseTitle

    // 檢查當前單元是否存在
    if (!currentLesson.value) {
      ElMessage.error('單元不存在')
      router.push('/')
      return
    }

  } catch (error) {
    console.error('載入課程資料失敗:', error)
    ElMessage.error(error.message || '載入課程資料失敗')
    router.push('/')
  } finally {
    pageLoading.value = false
  }
}

/**
 * 載入 Q&A 資料
 */
const loadQAData = async () => {
  try {
    // 模擬 API 呼叫
    await new Promise(resolve => setTimeout(resolve, 300))

    // Mock Q&A 資料
    allQA.value = [
      {
        id: 'qa-001',
        lessonId: currentLessonId.value,
        student: {
          id: 'user-001',
          name: '學生 A',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        },
        question: '請問這個概念可以應用在實際專案中嗎？',
        createdAt: '2024-01-15 10:30',
        instructor: {
          name: '王小明',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        },
        answer: '當然可以！這個概念在實際開發中非常常見，我建議您可以先從小型專案開始練習。',
        answeredAt: '2024-01-15 14:20'
      },
      {
        id: 'qa-002',
        lessonId: 'lesson-002',
        student: {
          id: 'user-002',
          name: '學生 B',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        },
        question: '有沒有推薦的延伸閱讀資源？',
        createdAt: '2024-01-16 09:15',
        instructor: {
          name: '王小明',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        },
        answer: '我推薦您閱讀官方文檔，裡面有更詳細的說明和範例。',
        answeredAt: '2024-01-16 11:30'
      }
    ]

  } catch (error) {
    console.error('載入 Q&A 失敗:', error)
    ElMessage.error('載入問答失敗')
  }
}

/**
 * 處理單元點擊
 */
const handleLessonClick = (lesson) => {
  if (lesson.id === currentLessonId.value) {
    return
  }

  router.push({
    name: 'CourseLearning',
    params: {
      courseId: route.params.courseId,
      lessonId: lesson.id
    }
  })
}

/**
 * 處理影片時間更新
 */
const handleTimeUpdate = (data) => {
  // 可以在這裡記錄學習進度
}

/**
 * 處理影片播放結束
 */
const handleVideoEnded = () => {
  if (currentLesson.value) {
    currentLesson.value.isCompleted = true
  }

  const nextLesson = getNextLesson()
  if (nextLesson) {
    ElMessage.success('已完成本單元，即將播放下一單元')
    setTimeout(() => {
      handleLessonClick(nextLesson)
    }, 2000)
  } else {
    ElMessage.success('恭喜！您已完成本課程所有單元')
  }
}

/**
 * 處理影片錯誤
 */
const handleVideoError = (error) => {
  ElMessage.error(error || '影片播放發生錯誤')
}

/**
 * 取得下一個單元
 */
const getNextLesson = () => {
  let foundCurrent = false

  for (const chapter of courseData.value.chapters) {
    for (const lesson of chapter.lessons) {
      if (foundCurrent && !lesson.isLocked) {
        return lesson
      }
      if (lesson.id === currentLessonId.value) {
        foundCurrent = true
      }
    }
  }

  return null
}

/**
 * 處理附件下載
 */
const handleDownload = (attachment) => {
  ElMessage.success(`開始下載：${attachment.name}`)

  const link = document.createElement('a')
  link.href = attachment.url
  link.download = attachment.name
  link.click()
}

/**
 * 取得檔案類型標籤樣式
 */
const getFileTagType = (type) => {
  const typeMap = {
    'pdf': 'danger',
    'doc': 'primary',
    'docx': 'primary',
    'ppt': 'warning',
    'pptx': 'warning',
    'zip': 'info',
    'rar': 'info'
  }
  return typeMap[type.toLowerCase()] || 'info'
}

/**
 * 清理 HTML（防止 XSS）
 */
const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  })
}

/**
 * 處理星星點擊（未評分時）
 */
const handleRatingChange = (value) => {
  if (!isRated.value && value > 0) {
    // 打開對話框並預設該評分
    ratingDialogVisible.value = true
  }
}

/**
 * 處理評分文字點擊（未評分時）
 */
const handleRatingTextClick = () => {
  if (!isRated.value) {
    ratingDialogVisible.value = true
  }
}

/**
 * 處理評論提交
 */
const handleReviewSubmitted = async (reviewData) => {
  try {
    // 模擬 API 呼叫
    await new Promise(resolve => setTimeout(resolve, 500))

    // 更新本地狀態
    userRating.value = reviewData.rating
    userComment.value = reviewData.comment

    ElMessage.success('評價提交成功！感謝您的反饋')
  } catch (error) {
    console.error('提交評價失敗:', error)
    ElMessage.error('評價提交失敗，請稍後再試')
  }
}

/**
 * 打開提問對話框
 */
const openAskDialog = () => {
  if (!currentLesson.value) {
    ElMessage.warning('請先選擇要提問的單元')
    return
  }
  askForm.value.content = ''
  showAskDialog.value = true
}

/**
 * 提交問題
 */
const submitQuestion = async () => {
  try {
    if (!askForm.value.content.trim()) {
      ElMessage.warning('請輸入問題內容')
      return
    }

    // 模擬 API 呼叫 POST /api/questions
    await new Promise(resolve => setTimeout(resolve, 500))

    const payload = {
      course_id: route.params.courseId,
      lesson_id: currentLessonId.value,
      content: askForm.value.content.trim()
    }

    console.log('提交問題:', payload)

    // 模擬新增問題到列表
    const newQuestion = {
      id: `qa-${Date.now()}`,
      lessonId: currentLessonId.value,
      student: {
        id: currentUserId.value,
        name: '我',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
      },
      question: askForm.value.content.trim(),
      createdAt: new Date().toLocaleString('zh-TW'),
      instructor: {
        name: '王小明',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
      },
      answer: null,
      answeredAt: null
    }

    allQA.value.unshift(newQuestion)

    // 關閉對話框並清空表單
    showAskDialog.value = false
    askForm.value.content = ''

    ElMessage.success('問題提交成功！講師會盡快回覆')
  } catch (error) {
    console.error('提交問題失敗:', error)
    ElMessage.error('提交問題失敗，請稍後再試')
  }
}

/**
 * 監聽路由參數變化
 */
watch(() => route.params.lessonId, (newLessonId) => {
  if (newLessonId && !pageLoading.value) {
    activeTab.value = 'details'
    loadQAData()
  }
})

// 生命週期
onMounted(async () => {
  await loadCourseData()
  await loadQAData()
})
</script>

<style scoped lang="scss">
.course-learning-page {
  min-height: 100vh;
  background-color: var(--el-bg-color-page, #f5f5f5);
  display: flex;
  flex-direction: column;
}

// 主容器
.learning-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

// 左側主內容區
.main-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 0 !important;  // 強制移除 Element Plus 預設 padding
  background-color: var(--el-bg-color-page, #f5f5f5);
  overflow-y: auto;  // 允許內容滾動
  overflow-x: hidden;

  // Theater Mode 狀態
  &.is-theater-mode {
    .video-stage {
      height: 85vh;  // Theater Mode：更高的舞台
    }

    .video-player-box {
      height: 100%;  // 🔑 優先級切換：高度優先
      width: auto;   // 🔑 寬度根據比例計算
    }
  }
}

// 影片舞台區域
.video-stage {
  position: relative;
  width: 100%;
  height: 60vh;  // 預設固定高度
  background-color: #000;
  display: flex;
  justify-content: center;  // 水平居中
  align-items: center;      // 垂直居中
  flex-shrink: 0;           // 防止被壓縮
  overflow: hidden;         // 🔑 防止內容溢出
  transition: height 0.3s ease;  // 平滑高度過渡
  will-change: height;      // 🔑 瀏覽器優化提示
}

// 影片播放器盒子（優先級切換策略）
.video-player-box {
  position: relative;
  aspect-ratio: 16 / 9;  // 🔑 始終保持 16:9 比例
  width: 100%;           // 🔑 預設：寬度優先
  height: auto;          // 🔑 預設：高度自動計算
  max-width: 100%;       // 不超過舞台寬度
  max-height: 100%;      // 不超過舞台高度

  :deep(.video-player-container) {
    width: 100%;
    height: 100%;
  }
}

// Hahow 風格邊緣展開按鈕
.expand-trigger {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(50, 50, 50, 0.8);
  color: #ffffff;
  padding: 16px 8px;
  border-radius: 8px 0 0 8px;  // 僅左側圓角
  cursor: pointer;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: var(--capy-primary, #54CDF2);
    padding-left: 12px;  // Hover 時輕微滑出效果
    box-shadow: -4px 0 12px rgba(84, 205, 242, 0.4);
  }

  .el-icon {
    color: #ffffff;
  }
}

// 右側側邊欄
.sidebar-container {
  width: 400px;
  flex-shrink: 0;  // 防止側邊欄被壓縮
  background-color: var(--el-bg-color, #ffffff);
  border-left: 1px solid var(--el-border-color, #DCDFE6);
  overflow: hidden;
  transition: width 0.3s ease, opacity 0.3s ease;
  opacity: 1;

  &.is-collapsed {
    width: 0 !important;
    opacity: 0;
    border-left: none;
  }

  .sidebar-content {
    width: 400px;
    height: 100%;
    white-space: nowrap;
    overflow: hidden;  // 防止內容溢出
  }

  @media (max-width: 1199px) {
    width: 350px;

    .sidebar-content {
      width: 350px;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 400px;
    border-left: none;
    border-top: 1px solid var(--el-border-color, #DCDFE6);

    .sidebar-content {
      width: 100%;
    }
  }
}

.info-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  background-color: #ffffff;
  border-bottom: 1px solid #DCDFE6;

  .info-left {
    flex: 1;

    .lesson-title {
      font-size: 24px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 8px 0;
    }

    .course-subtitle {
      font-size: 14px;
      color: #909399;
      margin: 0;
    }
  }

  .info-right {
    .rating-cta {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      border-radius: 8px;

      .rating-stars {
        cursor: pointer;

        :deep(.el-rate__icon) {
          font-size: 20px;
          margin-right: 4px;
          transition: transform 0.2s ease;
        }

        // 未評分的星星 - 灰色
        :deep(.el-rate__icon.el-icon) {
          color: #C0C4CC;
        }

        // 已評分的星星 - 金色
        :deep(.el-rate__icon.is-active) {
          color: #FFD700;
        }

        // Hover 效果（未評分時）
        &:not(.is-disabled):hover :deep(.el-rate__icon) {
          transform: scale(1.1);
        }
      }

      .rating-text {
        font-size: 14px;
        color: var(--el-text-color-secondary);
        white-space: nowrap;

        &.clickable {
          color: var(--capy-primary, #54CDF2);
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;

          &:hover {
            color: #3db8d9;
            text-decoration: underline;
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;

    .info-left .lesson-title {
      font-size: 20px;
    }
  }
}

.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  min-height: 400px;
  overflow: hidden;
  min-height: 0;  // 允許 flex 子元素正確收縮
}

.tabs-container {
  flex: 1;
  background-color: #ffffff;
  overflow: hidden;

  .content-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;

    :deep(.el-tabs__header) {
      margin: 0;
      padding: 0 24px;
      background-color: #fafafa;
      border-bottom: 1px solid #DCDFE6;
    }

    :deep(.el-tabs__content) {
      flex: 1;
      overflow: auto;
      padding: 0;
    }

    :deep(.el-tab-pane) {
      height: 100%;
    }
  }

  .tab-content {
    padding: 24px;
    height: 100%;
    overflow-y: auto;

    &.qa-content {
      padding: 16px;
    }
  }
}

// 單元介紹盒子
.lesson-intro-box {
  background: linear-gradient(135deg, #f0feff 0%, #e6f7ff 100%);
  border-left: 4px solid #54CDF2;
  padding: 20px;
  margin-bottom: 24px;
  border-radius: 8px;

  .intro-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 12px 0;

    .el-icon {
      color: #54CDF2;
    }
  }

  .intro-content {
    font-size: 15px;
    line-height: 1.8;
    color: #606266;
  }
}

// 課程介紹區塊
.course-intro-section,
.instructor-section {
  margin-bottom: 24px;

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 16px 0;
    padding-bottom: 12px;
    border-bottom: 2px solid #EBEEF5;

    .el-icon {
      color: #54CDF2;
    }
  }

  .course-description {
    font-size: 15px;
    line-height: 1.8;
    color: #606266;

    :deep(p) {
      margin: 12px 0;
    }

    :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
      margin: 16px 0 8px;
      font-weight: 600;
      color: #303133;
    }

    :deep(ul), :deep(ol) {
      padding-left: 24px;
      margin: 12px 0;
    }

    :deep(li) {
      margin: 6px 0;
    }

    :deep(a) {
      color: #54CDF2;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

// 講師卡片
.instructor-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;

  .instructor-avatar {
    flex-shrink: 0;
  }

  .instructor-info {
    flex: 1;

    .instructor-name {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 8px 0;
    }

    .instructor-bio {
      font-size: 14px;
      line-height: 1.6;
      color: #606266;
      margin: 0;
    }
  }
}

// Q&A 樣式
.qa-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #EBEEF5;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.qa-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.qa-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.question-box {
  background-color: #ffffff;
  border: 1px solid #EBEEF5;
  border-radius: 8px;
  padding: 16px;
}

.answer-box {
  background-color: #F5F7FA;
  border: 1px solid #EBEEF5;
  border-radius: 8px;
  padding: 16px;
  margin-left: 40px;

  &.pending {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #909399;
    font-size: 14px;
    font-style: italic;
  }
}

.qa-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  .qa-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;

    .qa-author {
      font-size: 14px;
      font-weight: 600;
      color: #303133;

      &.instructor {
        color: #FB8C00;
      }
    }

    .qa-time {
      font-size: 12px;
      color: #909399;
    }
  }
}

.qa-content {
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
  white-space: pre-wrap;
}

// 附件樣式
.file-name {
  display: flex;
  align-items: center;
  gap: 8px;

  .el-icon {
    font-size: 18px;
    color: #909399;
  }
}

// 響應式設計
@media (max-width: 768px) {
  .info-bar {
    .info-left .lesson-title {
      font-size: 20px;
    }
  }

  .tabs-container {
    .tab-content {
      padding: 16px;
    }
  }

  .lesson-intro-box,
  .course-intro-section,
  .instructor-section {
    .intro-title,
    .section-title {
      font-size: 16px;
    }
  }

  .answer-box {
    margin-left: 20px;
  }
}
</style>
