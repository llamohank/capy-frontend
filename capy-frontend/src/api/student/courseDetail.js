/**
 * Course Detail API
 *
 * 這個模組提供課程詳情相關的 API 服務
 * 包含：
 * 1. 取得課程詳情 - GET /api/courses/{courseId}
 */

import request from '@/utils/http'

/**
 * 1. 取得課程詳情（未登入也可呼叫，但僅限已上架課程）
 * GET /api/courses/{courseId}
 *
 * @param {number} courseId - 課程 ID
 * @param {Object} [params] - 查詢參數（可選，用於評論游標批次）
 * @param {string} [params.nextCursorCreatedAt] - ISO8601 時間，用來做游標分頁（可選）
 * @param {string} [params.nextCursorId] - 上一筆的 ID，配合游標分頁（可選）
 * @param {number} [params.limit=5] - 批次大小，預設 5（可選）
 * @returns {Promise<Object>} 回傳課程詳情資訊
 *
 * @example
 * // 基本呼叫
 * const courseDetail = await fetchCourseDetail(1)
 *
 * @example
 * // 帶游標分頁參數（用於評論）
 * const courseDetail = await fetchCourseDetail(1, {
 *   nextCursorCreatedAt: '2024-03-20T10:00:00Z',
 *   nextCursorId: '1',
 *   limit: 10
 * })
 *
 * @returns {Promise<Object>} 回應結構：
 * {
 *   nextCursorId: string | null,
 *   nextCursorCreatedAt: string | null,
 *   hasMore: boolean,
 *   courseInfo: {
 *     course: {
 *       courseId: number,
 *       title: string,
 *       coverImageUrl: string,
 *       price: number,
 *       description: string,
 *       categories: [{ categoryId: number, categoryName: string }],
 *       tags: [{ tagId: number, tagName: string }],
 *       instructor: {
 *         instructorId: number,
 *         instructorName: string,
 *         bio: string,
 *         avatarUrl: string,
 *         totalStudents: number,
 *         totalCourses: number
 *       },
 *       totalHours: number,
 *       totalSections: number
 *     },
 *     sections: [
 *       {
 *         sectionId: number,
 *         displayOrder: number,
 *         title: string,
 *         lessons: [
 *           {
 *             lessonId: number,
 *             lessonTitle: string,
 *             lessonDurationMinutes: number,
 *             freePreview: boolean,
 *             displayOrder: number,
 *             description: string
 *           }
 *         ]
 *       }
 *     ],
 *     rateTable: {
 *       averageRating: number,
 *       reviewCount: number,
 *       oneStarRatings: number,    // 0~1 的比例值
 *       twoStarRatings: number,
 *       threeStarRatings: number,
 *       fourStarRatings: number,
 *       fiveStarRatings: number
 *     },
 *     userReviews: [
 *       {
 *         rateId: number,
 *         userId: number,
 *         userName: string,
 *         userAvatarUrl: string,
 *         rating: number,
 *         comment: string,
 *         createdAt: string
 *       }
 *     ]
 *   }
 * }
 *
 * @throws {Error} 403/404 - 課程未上架或不存在
 */
export const fetchCourseDetail = (courseId, params = {}) => {
  return request({
    url: `/courses/${courseId}`,
    method: 'GET',
    params: {
      nextCursorCreatedAt: params.nextCursorCreatedAt,
      nextCursorId: params.nextCursorId,
      limit: params.limit ?? 5
    }
  }).then(response => {
    console.log('🔍 fetchCourseDetail 原始回應:', response)

    // http.js 攔截器已經提取了 response.data
    // 後端返回的結構是 { nextCursorId, nextCursorCreatedAt, hasMore, courseInfo: {...} }
    if (response && typeof response === 'object' && response.courseInfo) {
      return response
    }

    // 如果回應格式不符預期，拋出錯誤
    throw new Error('課程詳情資料格式錯誤')
  }).catch(error => {
    // 處理 403/404 錯誤
    if (error.response?.status === 403 || error.response?.status === 404) {
      console.error('❌ 課程未上架或不存在')
      throw new Error('課程未上架或不存在')
    }
    throw error
  })
}

/**
 * 輔助函數：將秒數轉換為小時（四捨五入到上一小時）
 * @param {number} seconds - 秒數
 * @returns {number} 小時數
 */
export const convertSecondsToHours = (seconds) => {
  if (!seconds || seconds <= 0) return 0
  return Math.ceil(seconds / 3600)
}

/**
 * 輔助函數：計算課程總時長（分鐘）
 * @param {Array} sections - 課程章節陣列
 * @returns {number} 總時長（分鐘）
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
 * 輔助函數：格式化評分分佈資料
 * @param {Object} rateTable - 評分表
 * @returns {Object} 格式化後的評分分佈
 */
export const formatRatingDistribution = (rateTable) => {
  if (!rateTable) {
    return {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }
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
 * 輔助函數：從課程章節中提取學習重點（使用課程描述）
 * @param {Array} sections - 課程章節陣列
 * @returns {Array} 學習重點陣列
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
  fetchCourseDetail,
  convertSecondsToHours,
  calculateTotalDuration,
  formatRatingDistribution,
  extractLearningPoints
}
