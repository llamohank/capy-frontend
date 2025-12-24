/**
 * Course Detail API
 *
 * 這個模組提供課程詳情相關的 API 服務
 * 已拆分為以下四個 API：
 * 1. 取得課程基本資訊 - GET /api/courses/{courseId}/info
 * 2. 取得課程章節列表 - GET /api/courses/{courseId}/sections
 * 3. 取得評分統計 - GET /api/courses/{courseId}/rate
 * 4. 取得評論列表（游標分頁）- GET /api/courses/{courseId}/reviews
 */

import request from '@/utils/http'

// ==================== 主要 API ====================

/**
 * 1. 取得課程基本資訊
 * GET /api/courses/{courseId}/info
 *
 * @param {number} courseId - 課程 ID
 * @returns {Promise<CourseInfoVo>}
 *
 * @example
 * Response: CourseInfoVo
 * {
 *   courseId: number,
 *   title: string,
 *   coverImageUrl: string,
 *   price: number,
 *   description: string,
 *   categories: [{ categoryId: number, categoryName: string }],
 *   tags: [{ tagId: number, tagName: string }],
 *   instructor: {
 *     instructorId: number,
 *     instructorName: string,
 *     bio: string,
 *     avatarUrl: string,
 *     totalStudents: number,
 *     totalCourses: number
 *   },
 *   totalHours: number,        // 課程總時數（秒→小時，保留 2 位小數）
 *   totalSections: number,
 *   attachmentCount: number,   // 課程下附件數
 *   isEnrolled: boolean        // 登入且已購課為 true
 * }
 *
 * @throws {Error} 403/404 - 課程未上架或不存在
 */
export const fetchCourseInfo = (courseId) => {
  return request({
    url: `/courses/${courseId}/info`,
    method: 'GET'
  })
}

/**
 * 2. 取得課程章節列表
 * GET /api/courses/{courseId}/sections
 *
 * @param {number} courseId - 課程 ID
 * @returns {Promise<Array<SectionInfoVo>>}
 *
 * @example
 * Response: List<SectionInfoVo>
 * [
 *   {
 *     sectionId: number,
 *     displayOrder: number,
 *     title: string,
 *     lessons: [
 *       {
 *         lessonId: number,
 *         lessonTitle: string,
 *         lessonDurationText: string,  // 已格式化如「X分Y秒」
 *         freePreview: boolean,
 *         displayOrder: number,
 *         description: string
 *       }
 *     ]
 *   }
 * ]
 *
 * @throws {Error} 403/404 - 課程未上架或不存在
 */
export const fetchCourseSections = (courseId) => {
  return request({
    url: `/courses/${courseId}/sections`,
    method: 'GET'
  })
}

/**
 * 3. 取得評分統計
 * GET /api/courses/{courseId}/rate
 *
 * @param {number} courseId - 課程 ID
 * @returns {Promise<RateTableVo>}
 *
 * @example
 * Response: RateTableVo
 * {
 *   averageRating: number,
 *   reviewCount: number,
 *   oneStarRatings: number,    // 0~1 的小數（四位小數），分母是 reviewCount
 *   twoStarRatings: number,
 *   threeStarRatings: number,
 *   fourStarRatings: number,
 *   fiveStarRatings: number
 * }
 *
 * @throws {Error} 403/404 - 課程未上架或不存在
 */
export const fetchCourseRateTable = (courseId) => {
  return request({
    url: `/courses/${courseId}/rate`,
    method: 'GET'
  })
}

/**
 * 4. 取得評論列表（游標分頁）
 * GET /api/courses/{courseId}/reviews
 *
 * @param {number} courseId - 課程 ID
 * @param {Object} [params] - 查詢參數
 * @param {string} [params.cursorCreatedAt] - ISO8601 時間，用來做游標分頁（可選）
 * @param {number} [params.cursorId] - 上一筆的 ID，配合游標分頁（可選）
 * @param {number} [params.limit=5] - 批次大小，預設 5
 * @returns {Promise<Object>}
 *
 * @example
 * Response: Map
 * {
 *   reviews: [
 *     {
 *       rateId: number,
 *       userId: number,
 *       userName: string,
 *       userAvatarUrl: string,
 *       rating: number,
 *       comment: string,
 *       createdAt: string  // ISO8601
 *     }
 *   ],
 *   hasMore: boolean,
 *   nextCursorCreatedAt: string | null,  // Instant
 *   nextCursorId: number | null          // Long
 * }
 *
 * @throws {Error} 403/404 - 課程未上架或不存在
 */
export const fetchCourseReviews = (courseId, params = {}) => {
  return request({
    url: `/courses/${courseId}/reviews`,
    method: 'GET',
    params: {
      cursorCreatedAt: params.cursorCreatedAt,
      cursorId: params.cursorId,
      limit: params.limit ?? 5
    }
  })
}

// ==================== 舊版整合 API（保留相容性）====================

/**
 * 取得課程詳情（整合所有資料）
 * @deprecated 請改用 fetchCourseInfo、fetchCourseSections、fetchCourseRateTable、fetchCourseReviews
 *
 * 此函數會並行呼叫四個 API，並整合成舊版回應格式
 */
export const fetchCourseDetail = async (courseId, params = {}) => {
  try {
    // 並行呼叫所有 API
    const [courseInfo, sections, rateTable, reviewsData] = await Promise.all([
      fetchCourseInfo(courseId),
      fetchCourseSections(courseId),
      fetchCourseRateTable(courseId),
      fetchCourseReviews(courseId, params)
    ])

    console.log('🔍 fetchCourseInfo 回應:', courseInfo)
    console.log('📊 isEnrolled 值:', courseInfo?.isEnrolled)

    // 整合成舊版格式
    // 注意：isEnrolled 需要從 courseInfo 中提取到 courseInfo 層級
    return {
      nextCursorId: reviewsData.nextCursorId,
      nextCursorCreatedAt: reviewsData.nextCursorCreatedAt,
      hasMore: reviewsData.hasMore,
      courseInfo: {
        course: courseInfo,
        sections: sections,
        rateTable: rateTable,
        userReviews: reviewsData.reviews,
        // 🔥 關鍵：將 isEnrolled 提升到 courseInfo 層級
        isEnrolled: courseInfo?.isEnrolled || false
      }
    }
  } catch (error) {
    console.error('❌ 載入課程詳情失敗:', error)
    throw error
  }
}

// ==================== 免費試看相關 ====================

/**
 * 取得免費試看影片的 HLS 播放器 URL
 * GET /api/student/preview/{lessonId}/master
 *
 * @param {number} lessonId - 課程單元 ID
 * @returns {string} 回傳完整的 HLS master.m3u8 URL
 */
export const getPreviewVideoUrl = (lessonId) => {
  if (!lessonId) {
    throw new Error('lessonId 為必填參數')
  }

  const apiBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
  return `${apiBaseURL}/api/student/preview/${lessonId}/master`
}

/**
 * 驗證免費試看影片是否可用
 *
 * @param {number} lessonId - 課程單元 ID
 * @returns {Promise<boolean>} 回傳是否可以播放
 */
export const checkPreviewAvailability = async (lessonId) => {
  try {
    await request({
      url: `/student/preview/${lessonId}/master`,
      method: 'HEAD',
      withCredentials: true
    })
    return true
  } catch (error) {
    console.error('❌ 免費試看影片不可用:', error)
    return false
  }
}

// ==================== 輔助函數 ====================

/**
 * 將秒數轉換為小時（四捨五入到上一小時）
 */
export const convertSecondsToHours = (seconds) => {
  if (!seconds || seconds <= 0) return 0
  return Math.ceil(seconds / 3600)
}

/**
 * 計算課程總時長（分鐘）
 */
export const calculateTotalDuration = (sections) => {
  if (!sections || !Array.isArray(sections)) return 0

  return sections.reduce((total, section) => {
    if (!section.lessons || !Array.isArray(section.lessons)) return total

    const sectionDuration = section.lessons.reduce((sum, lesson) => {
      return sum + (lesson.lessonDurationMinutes || 0)
    }, 0)

    return total + sectionDuration
  }, 0)
}

/**
 * 格式化評分分佈資料
 */
export const formatRatingDistribution = (rateTable) => {
  if (!rateTable) {
    return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  }

  return {
    1: Math.round((rateTable.oneStarRatings || 0) * 100),
    2: Math.round((rateTable.twoStarRatings || 0) * 100),
    3: Math.round((rateTable.threeStarRatings || 0) * 100),
    4: Math.round((rateTable.fourStarRatings || 0) * 100),
    5: Math.round((rateTable.fiveStarRatings || 0) * 100)
  }
}

/**
 * 從章節中提取學習重點（使用單元描述）
 */
export const extractLearningPoints = (sections) => {
  if (!sections || !Array.isArray(sections)) return []

  const learningPoints = []
  sections.forEach(section => {
    if (section.lessons && Array.isArray(section.lessons)) {
      section.lessons.forEach(lesson => {
        if (lesson.description && lesson.description.trim()) {
          learningPoints.push(lesson.description)
        }
      })
    }
  })

  return learningPoints
}

// 匯出所有 API 函數
export default {
  // 新版拆分 API
  fetchCourseInfo,
  fetchCourseSections,
  fetchCourseRateTable,
  fetchCourseReviews,
  // 舊版整合 API（保留相容性）
  fetchCourseDetail,
  // 免費試看
  getPreviewVideoUrl,
  checkPreviewAvailability,
  // 輔助函數
  convertSecondsToHours,
  calculateTotalDuration,
  formatRatingDistribution,
  extractLearningPoints
}
