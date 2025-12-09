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
 * @param {('all'|'ongoing'|'completed')} [params.status='all'] - 課程狀態
 *   - 'all': 所有課程
 *   - 'ongoing': 進行中的課程（completionPercentage < 100）
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
 *   status: 'ongoing'
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
      sort: params.sort ?? 'lastWatchedAt,desc'
    }
  })
}

/**
 * 更新學生 Profile
 *
 * 使用 JSON 格式更新暱稱和頭像 URL
 *
 * @param {Object} data - 要更新的資料
 *   - nickname（可選，文字）- 新暱稱
 *   - avatarUrl（可選，文字）- 頭像 URL
 *
 * @returns {Promise<{
 *   success: boolean,
 *   code: number,
 *   message: string,
 *   data: {
 *     userId: number,
 *     nickname: string,
 *     email: string,
 *     avatarUrl: string,
 *     ownedCoursesCount: number,
 *     wishlistCount: number,
 *     completedCoursesCount: number,
 *     googleLinked: boolean
 *   },
 *   path: string
 * }>}
 *
 * @example
 * // 只更新暱稱
 * const result = await updateStudentProfile({
 *   nickname: 'New Name'
 * })
 *
 * @example
 * // 更新暱稱和頭像 URL（需先上傳頭像取得 URL）
 * const uploadResult = await uploadStudentAvatar(file)
 * const result = await updateStudentProfile({
 *   nickname: 'New Name',
 *   avatarUrl: uploadResult.avatarUrl
 * })
 */
export const updateStudentProfile = (data) => {
  return request({
    url: '/student/profile/update',
    method: 'PUT',
    data
  })
}

/**
 * 上傳學生頭像
 *
 * 使用 multipart/form-data 上傳頭像檔案，返回 GCS URL
 *
 * @param {File} file - 頭像圖片檔案（僅接受 image/png, image/jpeg, image/jpg）
 * @returns {Promise<{
 *   avatarUrl: string
 * }>}
 *
 * @example
 * const file = document.querySelector('input[type="file"]').files[0]
 * const result = await uploadStudentAvatar(file)
 * console.log(result.avatarUrl) // 'https://storage.googleapis.com/...'
 *
 * // 然後更新 profile
 * await updateStudentProfile({
 *   nickname: 'New Name',
 *   avatarUrl: result.avatarUrl
 * })
 */
export const uploadStudentAvatar = (file) => {
  const formData = new FormData()
  formData.append('avatar', file)

  return request({
    url: '/student/profile/avatar',
    method: 'POST',
    data: formData
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

/**
 * 變更學生密碼
 *
 * API 規格：
 * - 路徑：PUT /api/student/change-password
 * - 需登入：必須帶上 JWT（cookie 或 Bearer），未登入會 401/403
 * - Request Body（JSON，ChangePasswordRequestDto）：
 *   - currentPassword（當前密碼）
 *   - newPassword（新密碼；8–64 碼，需含大寫/小寫/數字，可包含特殊字元）
 * - Response：Result<Void>，成功通常回 200，data 為 null
 * - 密碼格式：^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}[]:;"'<>,.?/]{8,64}$
 * - 錯誤情況：
 *   - 當前密碼錯誤 → 400，訊息 "current password incorrect"
 *   - 新密碼與當前密碼相同 → 400，訊息 "new password must be different from current password"
 *   - 新密碼違反驗證（長度/強度） → 400，訊息取決於 Bean Validation
 *   - 未登入/Token 失效 → 401/403
 *
 * @param {Object} data - 密碼資料
 * @param {string} data.currentPassword - 當前密碼
 * @param {string} data.newPassword - 新密碼（8-64碼，需含大寫/小寫/數字，可包含特殊字元，且必須與當前密碼不同）
 *
 * @returns {Promise<{
 *   success: boolean,
 *   code: number,
 *   message: string,
 *   data: null,
 *   path: string
 * }>}
 *
 * @example
 * // 變更密碼
 * try {
 *   const result = await changeStudentPassword({
 *     currentPassword: 'OldPass123',
 *     newPassword: 'NewPass456!'
 *   })
 *   console.log('密碼變更成功')
 * } catch (error) {
 *   if (error.response?.status === 400) {
 *     const message = error.response?.data?.message
 *     if (message?.includes('current password incorrect')) {
 *       console.error('當前密碼錯誤')
 *     } else if (message?.includes('must be different')) {
 *       console.error('新密碼不能與當前密碼相同')
 *     } else {
 *       console.error('密碼格式不符合規則')
 *     }
 *   } else if (error.response?.status === 401 || error.response?.status === 403) {
 *     console.error('未登入或 Token 失效，請重新登入')
 *   }
 * }
 */
export const changeStudentPassword = (data) => {
  return request({
    url: '/student/change-password',
    method: 'PUT',
    data
  })
}

/**
 * 刪除學生帳號
 *
 * @param {Object} data - 刪除帳號資料
 * @param {string} data.currentPassword - 目前密碼（用於確認身份）
 *
 * @returns {Promise<{
 *   success: boolean,
 *   code: number,
 *   message: string,
 *   data: string,
 *   path: string
 * }>}
 *
 * @example
 * const result = await deleteStudentAccount({
 *   currentPassword: 'myPassword123'
 * })
 */
export const deleteStudentAccount = (data) => {
  return request({
    url: '/student/delete-account',
    method: 'POST',
    data
  })
}

/**
 * 解綁定 Google 帳號
 *
 * @param {Object} data - 解綁定資料
 * @param {string} data.password - 當前密碼（用於確認身份）
 *
 * @returns {Promise<{
 *   success: boolean,
 *   code: number,
 *   message: string,
 *   data: null,
 *   path: string
 * }>}
 *
 * @example
 * const result = await unlinkGoogleAccount({
 *   password: 'myPassword123'
 * })
 */
export const unlinkGoogleAccount = (data) => {
  return request({
    url: '/student/account/unlinkGoogle',
    method: 'POST',
    data
  })
}

// 匯出所有 API 函數
export default {
  fetchStudentProfile,
  fetchMyLearning,
  updateStudentProfile,
  uploadStudentAvatar,
  submitCourseRating,
  updateCourseRating,
  changeStudentPassword,
  deleteStudentAccount,
  unlinkGoogleAccount
}
