import http from '@/utils/http'

/**
 * 課程學習相關 API
 */

/**
 * 取得單元摘要與課程/講師資訊
 * @param {string} lessonId - 單元 ID
 * @returns {Promise<LessonSummaryVo>}
 * @example
 * Response: Result<LessonSummaryVo>
 * {
 *   lessonDescription: string,
 *   completionPercentage: number | null,  // 課程完成百分比（登入且有購買時回傳，否則為 null）
 *   course: {
 *     courseId: string,
 *     courseTitle: string,
 *     courseDescription: string,
 *     publishedDate: string,
 *     totalSections: number,
 *     totalLessons: number  // 總單元數
 *   },
 *   instructorInfo: {
 *     instructorId: string,
 *     instructorName: string,
 *     bio: string,
 *     avatarUrl: string,
 *     totalStudents: number,
 *     totalCourses: number
 *   }
 * }
 */
export const getLessonSummary = (lessonId) => {
  return http.get(`/lesson/${lessonId}/summary`)
}

/**
 * 取得課程章節/單元清單（供播放頁樹狀側欄）
 * @param {string} courseId - 課程 ID
 * @returns {Promise<SectionsLessonsVo>}
 * @example
 * Response: Result<SectionsLessonsVo>
 * {
 *   section: [  // 注意：後端回傳的欄位名稱是 section（單數），代表章節列表
 *     {
 *       id: number,
 *       title: string,  // 章節標題
 *       displayOrder: number,
 *       lessons: [  // 該章節下的單元列表
 *         {
 *           id: number,
 *           title: string,  // 單元標題
 *           displayOrder: number,
 *           duration: string,  // MM:SS 格式
 *           completed: boolean // 是否已完成
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
export const getCourseSections = (courseId) => {
  return http.get(`/lesson/${courseId}/sections`)
}

/**
 * 列出該單元附件清單（需已購課）
 * @param {string} lessonId - 單元 ID
 * @returns {Promise<Array<AttachmentDownloadVo>>}
 * @example
 * Response: Result<List<AttachmentDownloadVo>>
 * [
 *   {
 *     attachmentId: string,
 *     fileName: string,
 *     size: string  // 例如: "2.5 MB"
 *   }
 * ]
 */
export const getLessonAttachments = (lessonId) => {
  return http.get(`/lesson/${lessonId}/attachments`)
}

/**
 * 下載附件（需已購課）
 * @param {string} attachmentId - 附件 ID
 * @returns {Promise<Blob>} 檔案二進位資料
 * @example
 * Response: 檔案本體（二進位）
 * Content-Disposition: attachment; filename="檔案名稱.ext"
 * Content-Type: 依附件 mimeType（如 application/pdf, application/zip 等）
 */
export const downloadAttachment = (attachmentId) => {
  return http.get(`/lesson/${attachmentId}/download`, {
    responseType: 'blob' // 處理二進位檔案
  })
}

/**
 * 課程 Q&A（全課程或指定章節/單元），需已購課
 * @param {string} courseId - 課程 ID
 * @param {Object} params - 查詢參數
 * @param {string} [params.sectionId] - 章節 ID（可選）
 * @param {string} [params.lessonId] - 單元 ID（可選）
 * @param {string} [params.cursorCreatedAt] - 游標創建時間（ISO-8601 格式，可選）
 * @param {number} [params.cursorId] - 游標 ID（Long，可選）
 * @param {number} [params.limit=10] - 每頁數量（預設 10）
 * @returns {Promise<Object>}
 * @example
 * Response: Result<Map>
 * {
 *   items: [
 *     {
 *       questionId: string,
 *       userId: string,
 *       userName: string,
 *       content: string,
 *       createdAt: string,  // ISO-8601 格式
 *       answer: {
 *         instructorId: string,
 *         instructorName: string,
 *         avatarUrl: string,
 *         content: string,
 *         createdAt: string  // ISO-8601 格式
 *       } | null
 *     }
 *   ],
 *   hasMore: boolean,
 *   nextCursorCreatedAt: string | null,  // ISO-8601 格式
 *   nextCursorId: number | null
 * }
 */
export const getCourseQA = (courseId, params = {}) => {
  return http.get(`/lesson/${courseId}/qa`, { params })
}

/**
 * 使用者自己的提問列表，需已購課
 * @param {string} courseId - 課程 ID
 * @param {Object} params - 查詢參數
 * @param {string} [params.order='desc'] - 排序方式（desc|asc，預設 desc）
 * @param {string} [params.answered='all'] - 篩選條件（all|answered|unanswered，預設 all）
 * @param {string} [params.cursorCreatedAt] - 游標創建時間（可選）
 * @param {number} [params.cursorId] - 游標 ID（可選）
 * @param {number} [params.limit=10] - 每頁數量（預設 10）
 * @returns {Promise<Object>}
 * @example
 * Response: Result<Map>
 * {
 *   items: [
 *     {
 *       questionId: string,
 *       userId: string,
 *       userName: string,
 *       content: string,
 *       createdAt: string,  // ISO-8601 格式
 *       answer: {
 *         instructorId: string,
 *         instructorName: string,
 *         avatarUrl: string,
 *         content: string,
 *         createdAt: string  // ISO-8601 格式
 *       } | null
 *     }
 *   ],
 *   hasMore: boolean,
 *   nextCursorCreatedAt: string | null,  // ISO-8601 格式
 *   nextCursorId: number | null
 * }
 */
export const getMyQA = (courseId, params = {}) => {
  return http.get(`/lesson/${courseId}/myqa`, { params })
}

/**
 * 新增提問（需已購課）
 * @param {Object} questionDto - 提問資料
 * @param {string} questionDto.courseId - 課程 ID
 * @param {string} questionDto.lessonId - 單元 ID
 * @param {string} questionDto.content - 問題內容
 * @returns {Promise<LessonQAVo>}
 * @example
 * Request Body: QuestionDto
 * {
 *   courseId: string,
 *   lessonId: string,
 *   content: string
 * }
 *
 * Response: Result<LessonQAVo>
 * {
 *   questionId: string,
 *   userId: string,
 *   userName: string,
 *   content: string,
 *   createdAt: string,  // ISO-8601 格式
 *   answer: null  // 新提問時為 null
 * }
 *
 * 注意：提交後會同時觸發通知給講師
 */
export const postQuestion = (questionDto) => {
  return http.post('/lesson/question', questionDto)
}

/**
 * 播放影片相關 API
 */

/**
 * 取得 HLS master.m3u8 播放清單（需登入、有 enrollment，或該單元為免費預覽）
 * @param {string} lessonId - 單元 ID
 * @returns {Promise<string>} master.m3u8 文字內容
 * @example
 * Response: master.m3u8 播放清單（文字格式）
 * Content-Type: application/vnd.apple.mpegurl 或 text/plain
 *
 * 授權邏輯：
 * - 若單元標記為免費預覽 (lesson.is_free_preview = true) → 無須 enrollment
 * - 否則必須登入且擁有該課程 enrollment
 * - 否則拋出 AccessDeniedException
 */
export const getHlsMaster = (lessonId) => {
  return http.get(`/videos/hls/${lessonId}/master`, {
    responseType: 'text' // m3u8 是文字格式
  })
}

/**
 * 取得 HLS 變體/片段檔案（需登入、有 enrollment，或該單元為免費預覽）
 * @param {string} lessonId - 單元 ID
 * @param {string} filePath - 檔案路徑（如 audio.m3u8, video-720p.m3u8, video-720p0000000000.m4s）
 * @returns {Promise<ArrayBuffer>} 檔案內容（byte[]）
 * @example
 * Response: byte[]
 * Content-Type: 取自 GCS 物件的 Content-Type
 *
 * 檔案路徑格式：courses/{courseId}/lessons/{lessonId}/{relativePath}
 * 讀取來源：GCS hls-video bucket
 *
 * 進度追蹤：
 * - 對非 m3u8 片段會解析 segment 序號
 * - 計算完成度 ≥95% 時將該單元標記完成（寫入 lesson_progress）
 *
 * 注意：請求需帶 JWT Cookie（withCredentials: true）
 */
export const getHlsResource = (lessonId, filePath) => {
  return http.get(`/videos/hls/${lessonId}/${filePath}`, {
    responseType: 'arraybuffer' // 處理二進位資料
  })
}

/**
 * 輔助函數：構建完整的 HLS 影片 URL
 * @param {string} lessonId - 單元 ID
 * @returns {string} HLS master.m3u8 的完整 URL
 */
export const buildHlsUrl = (lessonId) => {
  const baseURL = http.defaults.baseURL || 'http://localhost:8080/api'
  return `${baseURL}/videos/hls/${lessonId}/master`
}

/**
 * 輔助函數：下載附件並觸發瀏覽器下載
 * @param {string} attachmentId - 附件 ID
 * @param {string} fileName - 檔案名稱
 */
export const triggerAttachmentDownload = async (attachmentId, fileName) => {
  try {
    const blob = await downloadAttachment(attachmentId)

    // 創建下載連結
    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()

    // 清理
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下載附件失敗:', error)
    throw error
  }
}

/**
 * 課程評論相關 API
 */

/**
 * 查詢我自己的評論（需已購課且登入）
 * @param {string} courseId - 課程 ID
 * @returns {Promise<CourseReviewVo|null>}
 * @example
 * Response: Result<CourseReviewVo>
 * {
 *   courseId: string,
 *   userId: string,
 *   rating: number,  // 1-5 星
 *   comment: string,
 *   createdAt: string  // ISO-8601 格式
 * }
 *
 * 若尚未評論則 data 為 null
 */
export const getMyReview = (courseId) => {
  return http.get('/student/reviews/me', {
    params: { courseId }
  })
}

/**
 * 儲存單元觀看進度
 * @param {{ lessonId: number|string, lastWatchSeconds: number }} payload
 * @returns {Promise<LessonProgressSaveVo>}
 * @example
 * Request Body:
 * {
 *   lessonId: number,
 *   lastWatchSeconds: number
 * }
 *
 * Response: Result<LessonProgressSaveVo>
 * {
 *   progressId: number,
 *   lessonId: number,
 *   courseId: number,
 *   lastWatchSeconds: number,
 *   completed: boolean,      // 後端判斷是否已完成
 *   completedAt: string|null // ISO-8601 格式，完成時間
 * }
 */
export const saveLessonProgress = (payload) => {
  return http.post('/lesson/progress/update', payload)
}

export default {
  getLessonSummary,
  getCourseSections,
  getLessonAttachments,
  downloadAttachment,
  getCourseQA,
  getMyQA,
  postQuestion,
  getHlsMaster,
  getHlsResource,
  buildHlsUrl,
  triggerAttachmentDownload,
  getMyReview,
  saveLessonProgress
}
