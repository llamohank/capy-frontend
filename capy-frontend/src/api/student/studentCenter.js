/**
 * Student Center API
 *
 * 這個模組提供學生中心相關的 API 服務
 * 包含：
 * 1. Student Profile - 學生基本資料和統計數據
 * 2. My Learning - 課程學習記錄（支援分頁、篩選、排序）
 *
 * @see /instruction/STUDENT_CENTER_API_DESIGN.md
 */

import request from '@/utils/http'

/**
 * 獲取學生 Profile 和統計資料
 *
 * 這個 API 只返回學生的基本資料和統計數據，不包含課程列表
 * 適用場景：
 * - 進入 Student Center 時顯示用戶資訊
 * - 更新頁面頂部的統計數據
 * - 任何需要用戶基本資料的地方
 *
 * @returns {Promise<{
 *   userId: number,
 *   nickname: string,
 *   email: string,
 *   avatarUrl: string,
 *   ownedCoursesCount: number,
 *   wishlistCount: number,
 *   completedCoursesCount: number
 * }>}
 *
 * @example
 * const profile = await fetchStudentProfile()
 * console.log(profile.ownedCoursesCount) // 15
 */
export const fetchStudentProfile = () => {
  return request({
    url: '/student/center/profile',
    method: 'GET'
  })
}

/**
 * 獲取我的課程學習記錄
 *
 * 支援分頁、篩選和排序功能
 *
 * @param {Object} params - 查詢參數
 * @param {number} [params.page=0] - 頁碼（從 0 開始）
 * @param {number} [params.size=10] - 每頁筆數
 * @param {('all'|'in_progress'|'completed')} [params.status='all'] - 課程狀態
 *   - 'all': 所有課程
 *   - 'in_progress': 進行中的課程（completionPercentage < 100）
 *   - 'completed': 已完成的課程（completionPercentage = 100）
 * @param {string} [params.sort='lastWatch,desc'] - 排序方式
 *   - 'lastWatch,desc': 最近觀看時間（降序）
 *   - 'lastWatch,asc': 最近觀看時間（升序）
 *   - 'title,asc': 課程標題（升序）
 *   - 'title,desc': 課程標題（降序）
 *   - 'progress,desc': 完成度（降序）
 *   - 'progress,asc': 完成度（升序）
 *
 * @returns {Promise<{
 *   totalPages: number,
 *   totalElements: number,
 *   size: number,
 *   content: Array<{
 *     courseId: number,
 *     courseTitle: string,
 *     coverImageUrl: string,
 *     instructorId: number,
 *     instructorName: string,
 *     completionPercentage: number,
 *     rating: number,
 *     rateComment: string,
 *     lastWatchedSectionOrder: number,
 *     lastWatchedSectionTitle: string,
 *     lastWatchedLessonOrder: number,
 *     lastWatchedLessonTitle: string,
 *     lastWatch: string,
 *     progressId: number
 *   }>,
 *   number: number,
 *   first: boolean,
 *   last: boolean,
 *   numberOfElements: number,
 *   empty: boolean
 * }>}
 *
 * @example
 * // 獲取第一頁的所有課程
 * const page1 = await fetchMyLearning({ page: 0, size: 10 })
 *
 * @example
 * // 獲取進行中的課程
 * const inProgress = await fetchMyLearning({
 *   page: 0,
 *   size: 10,
 *   status: 'in_progress'
 * })
 *
 * @example
 * // 按標題排序
 * const sorted = await fetchMyLearning({
 *   page: 0,
 *   size: 10,
 *   sort: 'title,asc'
 * })
 */
export const fetchMyLearning = (params = {}) => {
  return request({
    url: '/student/center/my-learning',
    method: 'GET',
    params: {
      page: params.page ?? 0,
      size: params.size ?? 10,
      status: params.status ?? 'all',
      sort: params.sort ?? 'lastWatch,desc'
    }
  })
}

/**
 * 更新學生 Profile
 *
 * @param {Object} data - 要更新的資料
 * @param {string} [data.nickname] - 暱稱
 * @param {string} [data.avatarUrl] - 頭像 URL
 *
 * @returns {Promise<{
 *   userId: number,
 *   nickname: string,
 *   email: string,
 *   avatarUrl: string
 * }>}
 *
 * @example
 * const updated = await updateStudentProfile({
 *   nickname: 'New Name',
 *   avatarUrl: 'https://example.com/new-avatar.jpg'
 * })
 */
export const updateStudentProfile = (data) => {
  return request({
    url: '/student/center/profile',
    method: 'PUT',
    data
  })
}

/**
 * 提交課程評分
 *
 * @param {number} progressId - 學習進度 ID
 * @param {Object} data - 評分資料
 * @param {number} data.rating - 評分（1-5）
 * @param {string} [data.comment] - 評論內容
 *
 * @returns {Promise<{
 *   progressId: number,
 *   rating: number,
 *   comment: string,
 *   createdAt: string
 * }>}
 *
 * @example
 * const review = await submitCourseRating(1001, {
 *   rating: 5,
 *   comment: '很棒的課程！'
 * })
 */
export const submitCourseRating = (progressId, data) => {
  return request({
    url: `/student/center/my-learning/${progressId}/rating`,
    method: 'POST',
    data
  })
}

/**
 * 更新課程評分
 *
 * @param {number} progressId - 學習進度 ID
 * @param {Object} data - 評分資料
 * @param {number} data.rating - 評分（1-5）
 * @param {string} [data.comment] - 評論內容
 *
 * @returns {Promise<{
 *   progressId: number,
 *   rating: number,
 *   comment: string,
 *   updatedAt: string
 * }>}
 *
 * @example
 * const updated = await updateCourseRating(1001, {
 *   rating: 4,
 *   comment: '更新後的評論'
 * })
 */
export const updateCourseRating = (progressId, data) => {
  return request({
    url: `/student/center/my-learning/${progressId}/rating`,
    method: 'PUT',
    data
  })
}

// 匯出所有 API 函數
export default {
  fetchStudentProfile,
  fetchMyLearning,
  updateStudentProfile,
  submitCourseRating,
  updateCourseRating
}
