/**
 * Teacher Detail API
 *
 * 講師詳情相關的 API 服務
 */

import request from '@/utils/http'

/**
 * 取得講師公開資訊（包含講師課程列表）
 * GET /api/explore/{instructorId}
 *
 * @param {number} instructorId - 講師 ID
 * @param {Object} [params] - 查詢參數
 * @param {string} [params.sort='popular'] - 排序方式（popular: 熱門優先 | latest: 最新優先）
 * @param {number} [params.page=0] - 頁碼（0-based）
 * @param {number} [params.size=12] - 每頁課程數量
 * @returns {Promise<Object>} 回傳講師詳情資訊
 *
 * @example
 * // 基本呼叫
 * const teacherDetail = await fetchTeacherDetail(91, { page: 0, size: 10 })
 *
 * @example
 * // 指定排序方式
 * const teacherDetail = await fetchTeacherDetail(91, {
 *   page: 0,
 *   size: 10,
 *   sort: 'latest'
 * })
 *
 * @returns {Promise<Object>} 回應結構：
 * {
 *   instructorId: number,
 *   instructorName: string,
 *   bio: string,
 *   avatarUrl: string,
 *   totalStudents: number,
 *   totalCourses: number,
 *   courses: {
 *     totalElements: number,
 *     totalPages: number,
 *     size: number,
 *     content: [
 *       {
 *         id: number,
 *         title: string,
 *         coverImageUrl: string,
 *         price: number,
 *         status: string,
 *         instructorId: number,
 *         instructorName: string,
 *         averageRating: number,
 *         reviewCount: number,
 *         enrollmentCount: number,
 *         tags: string[],
 *         categories: string[],
 *         publishDate: string
 *       }
 *     ],
 *     number: number,
 *     numberOfElements: number,
 *     first: boolean,
 *     last: boolean,
 *     empty: boolean
 *   }
 * }
 */
export const fetchTeacherDetail = (instructorId, params = {}) => {
  return request({
    url: `/explore/${instructorId}`,
    method: 'GET',
    params: {
      sort: params.sort ?? 'popular',
      page: params.page ?? 0,
      size: params.size ?? 12
    }
  }).then(response => {
    console.log('🔍 fetchTeacherDetail 原始回應:', response)

    // http.js 攔截器已經提取了 response.data
    if (response && typeof response === 'object') {
      return response
    }

    throw new Error('講師詳情資料格式錯誤')
  }).catch(error => {
    // 處理 404 錯誤
    if (error.response?.status === 404) {
      console.error('❌ 講師不存在')
      throw new Error('講師不存在')
    }
    throw error
  })
}

/**
 * 輔助函數：格式化課程狀態
 * @param {string} status - 課程狀態
 * @returns {string} 格式化後的狀態文字
 */
export const formatCourseStatus = (status) => {
  const statusMap = {
    'draft': '草稿',
    'published': '已發布',
    'archived': '已封存'
  }
  return statusMap[status] || status
}

/**
 * 輔助函數：格式化發布日期
 * @param {string} dateString - ISO 8601 日期字串
 * @returns {string} 格式化後的日期
 */
export const formatPublishDate = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}/${month}/${day}`
}

export default {
  fetchTeacherDetail,
  formatCourseStatus,
  formatPublishDate
}
