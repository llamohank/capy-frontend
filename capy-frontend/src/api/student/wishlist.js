/**
 * Wishlist API
 *
 * 這個模組提供願望清單相關的 API 服務
 * 包含：
 * 1. 加入收藏清單 - POST /api/student/wishlist/add
 * 2. 從收藏清單移除 - POST /api/student/wishlist/remove
 * 3. 取得收藏清單（簡版，用於 navbar/彈窗）- GET /api/student/wishlist
 * 4. 學生中心 - 我的收藏（分頁）- GET /api/student/center/wishlist
 */

import request from '@/utils/http'

/**
 * 1. 加入收藏清單
 * POST /api/student/wishlist/add
 *
 * @param {number} courseId - 課程 ID
 * @returns {Promise<Object>}
 *
 * @example
 * const result = await addToWishlist(123)
 */
export const addToWishlist = (courseId) => {
  return request({
    url: '/student/wishlist/add',
    method: 'POST',
    data: { courseId }
  })
}

/**
 * 2. 從收藏清單移除
 * POST /api/student/wishlist/remove
 *
 * @param {number} courseId - 課程 ID
 * @returns {Promise<Object>}
 *
 * @example
 * const result = await removeFromWishlist(123)
 */
export const removeFromWishlist = (courseId) => {
  return request({
    url: '/student/wishlist/remove',
    method: 'POST',
    data: { courseId }
  })
}

/**
 * 3. 取得收藏清單（簡版，用於 navbar/彈窗）
 * GET /api/student/wishlist
 * 回傳 WishlistVo（所有項目，不分頁）
 *
 * @returns {Promise<Array>}
 *
 * @example
 * const items = await fetchWishlistItems()
 */
export const fetchWishlistItems = () => {
  return request({
    url: '/student/wishlist',
    method: 'GET'
  }).then(response => {
    console.log('🔍 fetchWishlistItems 原始回應:', response)

    // http.js 攔截器已經提取了 response.data
    // 所以這裡的 response 就是後端的 data 物件

    // 格式 1: { wishlistItems: [...] }
    if (response?.wishlistItems && Array.isArray(response.wishlistItems)) {
      console.log('✅ 找到 wishlistItems，數量:', response.wishlistItems.length)
      return response.wishlistItems
    }

    // 格式 2: { data: { wishlistItems: [...] } }
    if (response?.data?.wishlistItems && Array.isArray(response.data.wishlistItems)) {
      console.log('✅ 找到 data.wishlistItems，數量:', response.data.wishlistItems.length)
      return response.data.wishlistItems
    }

    // 格式 3: { myWishlist: { content: [...] } }
    if (response?.myWishlist?.content) {
      console.log('✅ 找到 myWishlist.content')
      return response.myWishlist.content
    }

    // 格式 4: { items: [...] }
    if (Array.isArray(response?.items)) {
      console.log('✅ 找到 items 陣列')
      return response.items
    }

    // 格式 5: 直接是陣列
    if (Array.isArray(response)) {
      console.log('✅ 回應本身是陣列')
      return response
    }

    // 如果都不是，返回空陣列
    console.warn('⚠️ 無法解析願望清單資料，返回空陣列', response)
    return []
  })
}

/**
 * 4. 學生中心 - 我的收藏（分頁）
 * GET /api/student/center/wishlist
 * Query: page/size（預設 size=6，可分頁）
 * 回傳 MyWishlistVo（分頁課程清單）
 *
 * @param {Object} params - 查詢參數
 * @param {number} [params.page=0] - 頁碼（從 0 開始）
 * @param {number} [params.size=6] - 每頁筆數
 * @param {string} [params.sort='desc'] - 排序方式（僅支援：asc 或 desc，對應 addedAt 時間排序，預設 desc 最新在前）
 * @returns {Promise<Object>}
 *
 * @example
 * const wishlist = await fetchCenterWishlist({ page: 0, size: 6, sort: 'desc' })
 */
export const fetchCenterWishlist = (params = {}) => {
  return request({
    url: '/student/center/wishlist',
    method: 'GET',
    params: {
      page: params.page ?? 0,
      size: params.size ?? 6,
      sort: params.sort ?? 'desc'
    }
  }).then(response => {
    console.log('🔍 fetchCenterWishlist 原始回應:', response)

    // 預設空結果
    const emptyResult = {
      totalPages: 0,
      totalElements: 0,
      size: 0,
      content: [],
      number: 0,
      sort: { empty: true, sorted: false, unsorted: true },
      first: true,
      last: true,
      numberOfElements: 0,
      pageable: {
        offset: 0,
        sort: { empty: true, sorted: false, unsorted: true },
        paged: true,
        pageNumber: 0,
        pageSize: 0,
        unpaged: false
      },
      empty: true
    }

    // 格式 1: response 直接是分頁物件 { content: [...], totalPages, ... }
    if (response?.content && Array.isArray(response.content)) {
      console.log('✅ 找到分頁資料 (格式1)，項目數:', response.content.length)
      return response
    }

    // 格式 2: { myWishlist: { content: [...] } }
    if (response?.myWishlist?.content) {
      console.log('✅ 找到 myWishlist (格式2)，項目數:', response.myWishlist.content.length)
      return response.myWishlist
    }

    // 格式 3: { data: { myWishlist: { content: [...] } } }
    if (response?.data?.myWishlist?.content) {
      console.log('✅ 找到 data.myWishlist (格式3)，項目數:', response.data.myWishlist.content.length)
      return response.data.myWishlist
    }

    // 格式 4: { data: { content: [...] } } (直接在 data 下)
    if (response?.data?.content && Array.isArray(response.data.content)) {
      console.log('✅ 找到 data.content (格式4)，項目數:', response.data.content.length)
      return response.data
    }

    console.warn('⚠️ 無法解析願望清單分頁資料，返回空結果', response)
    return emptyResult
  })
}

// 匯出所有 API 函數
export default {
  addToWishlist,
  removeFromWishlist,
  fetchWishlistItems,
  fetchCenterWishlist
}
