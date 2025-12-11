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
            <p class="course-subtitle">{{ courseData.courseTitle || '載入中...' }}</p>
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
                    <h3 class="section-title-student">
                      <el-icon><Reading /></el-icon>
                      課程介紹
                    </h3>
                    <div class="course-description" v-html="sanitizeHtml(courseData.courseDescription || '暫無課程介紹')"></div>
                  </div>

                  <!-- 講師資訊 -->
                  <div class="instructor-section">
                    <h3 class="section-title-student">
                      <el-icon><User /></el-icon>
                      講師資訊
                    </h3>
                    <div class="instructor-card">
                      <el-avatar :size="64" :src="lessonSummary.instructorInfo?.avatarUrl" class="instructor-avatar">
                        {{ lessonSummary.instructorInfo?.instructorName?.charAt(0) || '講' }}
                      </el-avatar>
                      <div class="instructor-info">
                        <h4 class="instructor-name">{{ lessonSummary.instructorInfo?.instructorName || '講師名稱' }}</h4>
                        <p class="instructor-bio">{{ lessonSummary.instructorInfo?.bio || '暫無講師簡介' }}</p>
                        <div class="instructor-stats" v-if="lessonSummary.instructorInfo">
                          <span>👥 {{ lessonSummary.instructorInfo.totalStudents || 0 }} 位學生</span>
                          <span>📚 {{ lessonSummary.instructorInfo.totalCourses || 0 }} 門課程</span>
                        </div>
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
                      <el-radio-button value="current">當前單元</el-radio-button>
                      <el-radio-button value="all">全部課程</el-radio-button>
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
                    <el-table-column prop="fileName" label="檔案名稱" min-width="200">
                      <template #default="{ row }">
                        <div class="file-name">
                          <el-icon><Document /></el-icon>
                          <span>{{ row.fileName }}</span>
                        </div>
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
            :chapters="courseData.sections"
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

// 導入 API
import {
  getLessonSummary,
  getCourseSections,
  getLessonAttachments,
  getCourseQA,
  getMyQA,
  postQuestion,
  buildHlsUrl,
  triggerAttachmentDownload
} from '@/api/student/courseLearning'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()

// 狀態管理
const pageLoading = ref(true)
const activeTab = ref('details')

// Theater Mode
const isSidebarCollapsed = computed(() => courseStore.isSidebarCollapsed)
const toggleSidebar = () => courseStore.toggleSidebar()

// 課程資料（對應後端 Response 結構）
const courseData = ref({
  courseId: '',
  courseTitle: '',
  courseDescription: '',
  publishedDate: '',
  totalSections: 0,
  totalLessons: 0,
  sections: [] // 章節列表（原 chapters）
})

// 單元摘要資料
const lessonSummary = ref({
  lessonDescription: '',
  course: null,
  instructorInfo: null
})

// 附件列表
const attachments = ref([])

// Q&A 資料
const qaFilter = ref('current')
const allQA = ref([])
const myQuestionsData = ref([])
const qaHasMore = ref(false)
const qaCursor = ref({ createdAt: null, id: null })
const myQAHasMore = ref(false)
const myQACursor = ref({ createdAt: null, id: null })

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
  for (const section of courseData.value.sections) {
    // 使用寬鬆比較來處理 number vs string 的問題
    const lesson = section.lessons?.find(l => l.id == currentLessonId.value)

    if (lesson) {
      return {
        ...lesson,
        description: lessonSummary.value.lessonDescription,
        attachments: attachments.value,
        videoUrl: buildHlsUrl(currentLessonId.value)
      }
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
  return myQuestionsData.value
})

/**
 * 課程資訊（用於評分對話框）
 */
const courseInfoForRating = computed(() => {
  if (!courseData.value.courseId) return null

  return {
    courseId: courseData.value.courseId,
    courseTitle: courseData.value.courseTitle,
    instructorName: lessonSummary.value.instructorInfo?.instructorName || '講師',
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
 * 載入單元摘要資料
 */
const loadLessonSummary = async () => {
  try {
    const data = await getLessonSummary(currentLessonId.value)
    lessonSummary.value = data

    // 更新課程基本資訊
    if (data.course) {
      courseData.value = {
        ...courseData.value,
        courseId: data.course.courseId,
        courseTitle: data.course.courseTitle,
        courseDescription: data.course.courseDescription,
        publishedDate: data.course.publishedDate,
        totalSections: data.course.totalSections,
        totalLessons: data.course.totalLessons
      }
    }
  } catch (error) {
    console.error('載入單元摘要失敗:', error)
    ElMessage.error('載入單元資訊失敗')
  }
}

/**
 * 載入課程章節資料
 */
const loadCourseSections = async () => {
  try {
    const data = await getCourseSections(route.params.courseId)
    // 注意：後端回傳的是 section（單數），不是 sections（複數）
    courseData.value.sections = data.section || data.sections || []
  } catch (error) {
    console.error('載入章節資料失敗:', error)
    ElMessage.error('載入課程章節失敗')
  }
}

/**
 * 載入附件列表
 */
const loadAttachments = async () => {
  try {
    const data = await getLessonAttachments(currentLessonId.value)
    attachments.value = data || []
  } catch (error) {
    console.error('載入附件失敗:', error)
    // 附件載入失敗不影響主要功能，僅記錄錯誤
  }
}

/**
 * 載入課程資料（整合所有資料載入）
 */
const loadCourseData = async () => {
  try {
    pageLoading.value = true

    // 並行載入所有資料
    await Promise.all([
      loadLessonSummary(),
      loadCourseSections(),
      loadAttachments()
    ])

    // 更新路由 meta
    route.meta.courseTitle = courseData.value.courseTitle

    // 檢查當前單元是否存在（在所有資料載入完成後）
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
const loadQAData = async (loadMore = false) => {
  try {
    const params = {
      limit: 10
    }

    // 根據篩選條件設定參數
    if (qaFilter.value === 'current') {
      params.lessonId = currentLessonId.value
    }

    // 載入更多時使用游標
    if (loadMore && qaCursor.value.createdAt) {
      params.cursorCreatedAt = qaCursor.value.createdAt
      params.cursorId = qaCursor.value.id
    }

    const data = await getCourseQA(route.params.courseId, params)

    // 轉換後端資料格式為前端格式
    const formattedItems = (data.items || []).map(item => ({
      id: item.questionId,
      lessonId: params.lessonId || null,
      student: {
        id: item.userId,
        name: item.userName,
        avatar: '' // 後端未提供，使用預設
      },
      question: item.content,
      createdAt: formatDateTime(item.createdAt),
      instructor: item.answer ? {
        name: item.answer.instructorName,
        avatar: item.answer.avatarUrl
      } : null,
      answer: item.answer?.content || null,
      answeredAt: item.answer ? formatDateTime(item.answer.createdAt) : null
    }))

    if (loadMore) {
      allQA.value = [...allQA.value, ...formattedItems]
    } else {
      allQA.value = formattedItems
    }

    qaHasMore.value = data.hasMore
    qaCursor.value = {
      createdAt: data.nextCursorCreatedAt,
      id: data.nextCursorId
    }

  } catch (error) {
    console.error('載入 Q&A 失敗:', error)
    ElMessage.error('載入問答失敗')
  }
}

/**
 * 載入我的提問
 */
const loadMyQuestions = async (loadMore = false) => {
  try {
    const params = {
      limit: 10,
      order: 'desc',
      answered: 'all'
    }

    // 載入更多時使用游標
    if (loadMore && myQACursor.value.createdAt) {
      params.cursorCreatedAt = myQACursor.value.createdAt
      params.cursorId = myQACursor.value.id
    }

    const data = await getMyQA(route.params.courseId, params)

    // 轉換後端資料格式為前端格式
    const formattedItems = (data.items || []).map(item => ({
      id: item.questionId,
      lessonId: null, // 我的提問不需要 lessonId
      student: {
        id: item.userId,
        name: item.userName,
        avatar: ''
      },
      question: item.content,
      createdAt: formatDateTime(item.createdAt),
      instructor: item.answer ? {
        name: item.answer.instructorName,
        avatar: item.answer.avatarUrl
      } : null,
      answer: item.answer?.content || null,
      answeredAt: item.answer ? formatDateTime(item.answer.createdAt) : null
    }))

    if (loadMore) {
      myQuestionsData.value = [...myQuestionsData.value, ...formattedItems]
    } else {
      myQuestionsData.value = formattedItems
    }

    myQAHasMore.value = data.hasMore
    myQACursor.value = {
      createdAt: data.nextCursorCreatedAt,
      id: data.nextCursorId
    }

  } catch (error) {
    console.error('載入我的提問失敗:', error)
    ElMessage.error('載入我的提問失敗')
  }
}

/**
 * 格式化日期時間
 */
const formatDateTime = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * 處理單元點擊
 */
const handleLessonClick = (lesson) => {
  if (lesson.id === currentLessonId.value) {
    return
  }

  router.push({
    name: 'courseLearning',
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

  for (const section of courseData.value.sections) {
    for (const lesson of section.lessons || []) {
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
const handleDownload = async (attachment) => {
  try {
    ElMessage.info(`開始下載：${attachment.fileName}`)
    await triggerAttachmentDownload(attachment.attachmentId, attachment.fileName)
    ElMessage.success(`下載完成：${attachment.fileName}`)
  } catch (error) {
    console.error('下載附件失敗:', error)
    ElMessage.error('下載附件失敗，請稍後再試')
  }
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

    const questionDto = {
      courseId: route.params.courseId,
      lessonId: currentLessonId.value,
      content: askForm.value.content.trim()
    }

    const result = await postQuestion(questionDto)

    // 將新問題加入列表
    const newQuestion = {
      id: result.questionId,
      lessonId: currentLessonId.value,
      student: {
        id: result.userId,
        name: result.userName,
        avatar: ''
      },
      question: result.content,
      createdAt: formatDateTime(result.createdAt),
      instructor: null,
      answer: null,
      answeredAt: null
    }

    allQA.value.unshift(newQuestion)
    myQuestionsData.value.unshift(newQuestion)

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
watch(() => route.params.lessonId, async (newLessonId) => {
  if (newLessonId && !pageLoading.value) {
    activeTab.value = 'details'
    // 重新載入單元相關資料
    await Promise.all([
      loadLessonSummary(),
      loadAttachments(),
      loadQAData()
    ])
  }
})

// 監聽 Q&A 篩選變化
watch(qaFilter, () => {
  loadQAData()
})

// 監聽 Tab 切換
watch(activeTab, (newTab) => {
  if (newTab === 'my-questions' && myQuestionsData.value.length === 0) {
    loadMyQuestions()
  }
})

// 生命週期
onMounted(async () => {
  await loadCourseData()
  await loadQAData()
  // 我的提問在切換到該 Tab 時才載入
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

  // Theater Mode 狀態覆寫
  &.is-theater-mode {
    .video-stage {
      aspect-ratio: unset;  // 🔑 移除比例限制
      height: 85vh;         // 🔑 強制高度
      max-height: 85vh;
    }

    .video-player-box {
      height: 100%;   // 🔑 填滿舞台高度
      width: auto;    // 🔑 寬度根據比例計算
      max-width: 100%;
    }
  }
}

// 影片舞台區域（標準模式：零黑邊）
.video-stage {
  position: relative;
  width: 100%;
  height: auto;          // 🔑 標準模式：自動高度
  aspect-ratio: 16 / 9;  // 🔑 標準模式：保持比例
  max-height: 70vh;      // 🔑 安全上限
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

// 影片播放器盒子
.video-player-box {
  position: relative;
  aspect-ratio: 16 / 9;  // 🔑 始終保持比例
  width: 100%;           // 🔑 標準模式：寬度優先
  height: 100%;          // 🔑 填滿舞台

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

  .section-title-student {
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
      margin: 0 0 8px 0;
    }

    .instructor-stats {
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: #909399;

      span {
        display: flex;
        align-items: center;
        gap: 4px;
      }
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
    .section-title-student {
      font-size: 16px;
    }
  }

  .answer-box {
    margin-left: 20px;
  }
}
</style>
