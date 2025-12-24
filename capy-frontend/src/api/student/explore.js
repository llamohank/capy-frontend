/**
 * Explore API
 *
 * 這個模組提供課程探索相關的 API 服務
 * 包含：
 * 1. 搜尋課程 - GET /api/search
 * 2. 取得分類樹 - GET /explore/categories
 * 3. 取得所有標籤 - GET /explore/tags
 */

import request from '@/utils/http'

/**
 * 1. 搜尋課程（無需登入）
 * GET /explore/search
 *
 * @param {Object} params - 查詢參數
 * @param {string} [params.keyword] - 全文搜尋關鍵字（搜尋 title/description/tags/categories/講師名）
 * @param {Array<number>} [params.categoryIds] - 指定分類 ID 陣列（多選）
 * @param {number} [params.page=0] - 頁碼（從 0 開始）
 * @param {number} [params.size=12] - 每頁筆數
 * @param {string} [params.sort='popular'] - 排序方式（popular/latest/oldest/unpopular/price_low/price_high）
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
 * // 多分類篩選
 * const result = await searchCourses({
 *   keyword: 'java',
 *   categoryIds: [1, 3],
 *   sort: 'latest',
 *   page: 0,
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
 *         publishDate: string,
 *         isEnrolled: boolean  // 是否已購買（登入時有值，未登入為 false/null）
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
  // 建立查詢參數物件
  const queryParams = {
    page: params.page ?? 0,
    size: params.size ?? 12,
    sort: params.sort ?? 'popular'
  }

  // 添加關鍵字（如果有）
  if (params.keyword) {
    queryParams.keyword = params.keyword
  }

  // 添加陣列參數到 queryParams
  if (params.categoryIds) {
    queryParams.categoryIds = params.categoryIds
  }

  // 添加評分篩選參數（如果有）
  if (params.maxRatings) {
    queryParams.maxRatings = params.maxRatings
  }

  // 添加標籤篩選參數（如果有）
  if (params.tagIds) {
    queryParams.tagIds = params.tagIds
  }

  // 處理多值參數：categoryIds, maxRatings, tagIds
  // 後端使用 @ModelAttribute 綁定，需要用重複的 key 傳遞陣列
  // 例如：?categoryIds=1&categoryIds=2&maxRatings=4.0&maxRatings=4.5

  return request({
    url: '/explore/search',
    method: 'GET',
    params: queryParams,
    paramsSerializer: {
      serialize: (params) => {
        const parts = []

        // 處理一般參數（非陣列）
        Object.keys(params).forEach(key => {
          const value = params[key]
          if (value !== undefined && value !== null && !Array.isArray(value)) {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          }
        })

        // 處理 categoryIds 陣列
        if (Array.isArray(params.categoryIds) && params.categoryIds.length > 0) {
          params.categoryIds.forEach(id => {
            parts.push(`categoryIds=${encodeURIComponent(id)}`)
          })
        }

        // 處理 maxRatings 陣列（評分篩選，OR 條件）
        if (Array.isArray(params.maxRatings) && params.maxRatings.length > 0) {
          params.maxRatings.forEach(rating => {
            parts.push(`maxRatings=${encodeURIComponent(rating)}`)
          })
        }

        // 處理 tagIds 陣列
        if (Array.isArray(params.tagIds) && params.tagIds.length > 0) {
          params.tagIds.forEach(id => {
            parts.push(`tagIds=${encodeURIComponent(id)}`)
          })
        }

        return parts.join('&')
      }
    }
  }).then(response => {
    // http.js 攔截器已經提取了 response.data
    // 後端返回的結構是 { data: { content: [...], number: 0, ... } }
    // 攔截器會自動提取 data 欄位，所以 response 就是 Page 物件
    return response || {
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

/**
 * 2. 取得分類樹（無需登入）
 * GET /explore/categories
 *
 * @returns {Promise<Array>} 回傳分類樹陣列
 *
 * @example
 * const categories = await getCategories()
 *
 * @returns {Promise<Array>} 回應結構：
 * [
 *   {
 *     id: number,
 *     name: string,
 *     parentId: number | null,
 *     displayOrder: number,
 *     children: [
 *       {
 *         id: number,
 *         name: string,
 *         parentId: number,
 *         displayOrder: number,
 *         children: []
 *       }
 *     ]
 *   }
 * ]
 */
export const getCategories = () => {
  return request({
    url: '/explore/categories',
    method: 'GET'
  }).then(response => {
    // http.js 攔截器已經提取了 response.data
    // 後端返回的結構是 { code: 200, msg: "ok", data: [...] }
    // 攔截器會自動提取 data 欄位
    return response || []
  }).catch(error => {
    console.error('取得分類樹失敗:', error)
    return []
  })
}

/**
 * 3. 取得所有標籤（無需登入）
 * GET /explore/tags
 *
 * @returns {Promise<Array>} 回傳標籤陣列
 *
 * @example
 * const tags = await getTags()
 *
 * @returns {Promise<Array>} 回應結構：
 * [
 *   {
 *     id: number,
 *     name: string,
 *     usageCount: number
 *   }
 * ]
 */
export const getTags = () => {
  return request({
    url: '/explore/tags',
    method: 'GET'
  }).then(response => {
    // http.js 攔截器已經提取了 response.data
    // 後端返回的結構是 { code: 200, msg: "ok", data: [...] }
    // 攔截器會自動提取 data 欄位
    return response || []
  }).catch(error => {
    console.error('取得標籤列表失敗:', error)
    return []
  })
}

/**
 * 4. 取得關鍵字建議（無需登入）
 * GET /explore/suggest
 *
 * @param {Object} params - 查詢參數
 * @param {string} params.keyword - 搜尋關鍵字
 * @param {number} [params.size=15] - 建議數量上限
 * @returns {Promise<Array<string>>} 回傳關鍵字建議列表
 *
 * @example
 * const suggestions = await getSuggestions({ keyword: 'py', size: 10 })
 *
 * @returns {Promise<Array<string>>} 回應結構：
 * [
 *   "python",
 *   "pytorch",
 *   "pycharm"
 * ]
 */
export const getSuggestions = (params = {}) => {
  return request({
    url: '/explore/suggest',
    method: 'GET',
    params: {
      keyword: params.keyword || '',
      size: params.size ?? 15
    }
  }).then(response => {
    // http.js 攔截器已經提取了 response.data
    // 後端返回的結構是 { code: 200, msg: "ok", data: [...] }
    // 攔截器會自動提取 data 欄位
    return response || []
  }).catch(error => {
    console.error('取得關鍵字建議失敗:', error)
    return []
  })
}

/**
 * 5. 取得各星等課程數量（無需登入）
 * GET /explore/rates
 *
 * @returns {Promise<RateQuantityVo>} 回傳各星等的課程數量
 *
 * @example
 * const rates = await getRateQuantities()
 *
 * @returns {Promise<Object>} 回應結構：
 * {
 *   oneStarQuantity: number,    // 1 星課程數量
 *   twoStarQuantity: number,    // 2 星課程數量
 *   threeStarQuantity: number,  // 3 星課程數量
 *   fourStarQuantity: number,   // 4 星課程數量
 *   fiveStarQuantity: number    // 5 星課程數量
 * }
 */
export const getRateQuantities = () => {
  return request({
    url: '/explore/rates',
    method: 'GET'
  }).then(response => {
    // http.js 攔截器已經提取了 response.data
    return response || {
      oneStarQuantity: 0,
      twoStarQuantity: 0,
      threeStarQuantity: 0,
      fourStarQuantity: 0,
      fiveStarQuantity: 0
    }
  }).catch(error => {
    console.error('取得評分數量失敗:', error)
    return {
      oneStarQuantity: 0,
      twoStarQuantity: 0,
      threeStarQuantity: 0,
      fourStarQuantity: 0,
      fiveStarQuantity: 0
    }
  })
}

// 匯出所有 API 函數
export default {
  searchCourses,
  getCategories,
  getTags,
  getSuggestions,
  getRateQuantities
}
