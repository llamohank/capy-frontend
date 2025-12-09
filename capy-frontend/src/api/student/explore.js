/**
 * Explore API
 *
 * 這個模組提供課程探索相關的 API 服務
 * 包含：
 * 1. 搜尋課程 - GET /api/search
 */

import request from '@/utils/http'

/**
 * 1. 搜尋課程（無需登入）
 * GET /api/search
 *
 * @param {Object} params - 查詢參數
 * @param {string} [params.keyword] - 全文搜尋關鍵字（搜尋 title/description/tags/categories/講師名，AND 匹配）
 * @param {number} [params.categoryId] - 指定分類 ID
 * @param {number} [params.maxRating] - 平均評分上限（含）
 * @param {number} [params.page=0] - 頁碼（從 0 開始）
 * @param {number} [params.size=12] - 每頁筆數
 * @param {string} [params.sort='popular'] - 排序方式（popular: enrollmentCount desc → publishedAt desc | latest: publishedAt desc → enrollmentCount desc）
 * @returns {Promise<Object>} 回傳包含課程列表和分頁資訊的物件
 *
 * @example
 * // 基本搜尋
 * const result = await searchCourses({ page: 0, size: 12, sort: 'popular' })
 *
 * @example
 * // 關鍵字搜尋
 * const result = await searchCourses({ keyword: 'python', page: 0, size: 12 })
 *
 * @example
 * // 進階篩選
 * const result = await searchCourses({
 *   keyword: 'python',
 *   categoryId: 3,
 *   maxRating: 4.5,
 *   sort: 'latest',
 *   page: 1,
 *   size: 12
 * })
 *
 * @returns {Promise<Object>} 回應結構：
 * {
 *   courses: {
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
 *     number: number,        // 當前頁碼
 *     size: number,          // 每頁筆數
 *     totalElements: number, // 總筆數
 *     totalPages: number,    // 總頁數
 *     first: boolean,        // 是否為第一頁
 *     last: boolean,         // 是否為最後一頁
 *     empty: boolean         // 是否為空
 *   }
 * }
 */
export const searchCourses = (params = {}) => {
  return request({
    url: '/search',
    method: 'GET',
    params: {
      keyword: params.keyword,
      categoryId: params.categoryId,
      maxRating: params.maxRating,
      page: params.page ?? 0,
      size: params.size ?? 12,
      sort: params.sort ?? 'popular'
    }
  }).then(response => {
    // http.js 攔截器已經提取了 response.data
    // 後端返回的結構是 { data: { courses: {...} } }
    // 提取 courses 物件（Spring Page 格式）
    return response?.courses || {
      content: [],
      number: 0,
      size: 0,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
      empty: true
    }
  })
}

// 匯出所有 API 函數
export default {
  searchCourses
}
