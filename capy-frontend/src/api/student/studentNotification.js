import instance from '@/utils/http'

/**
 * 通知 API 模組
 * 提供學生端通知相關的 API 接口
 */

/**
 * 獲取通知列表
 * @param {Object} params - 查詢參數
 * @param {Array<string>} params.types - 通知類型篩選（可選）
 * @param {number} params.page - 頁碼（從 0 開始，預設 0）
 * @param {number} params.size - 每頁數量（預設 20）
 * @param {string} params.sort - 排序方式（預設 'createdAt,DESC'）
 * @returns {Promise<Object>} 分頁通知列表
 *
 * 回應格式：
 * {
 *   content: [...],      // 通知列表
 *   totalElements: 100,  // 總數量
 *   totalPages: 5,       // 總頁數
 *   size: 20,            // 每頁數量
 *   number: 0            // 當前頁碼
 * }
 */
export const getNotifications = async (params = {}) => {
  const {
    types = [],
    page = 0,
    size = 20,
    sort = 'createdAt,DESC'
  } = params

  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort
    })

    // 添加 types 參數（如果有）
    if (types.length > 0) {
      types.forEach(type => {
        queryParams.append('types', type)
      })
    }

    const response = await instance.get(`/notifications?${queryParams.toString()}`)
    return response
  } catch (error) {
    console.error('獲取通知列表失敗:', error)
    throw error
  }
}

/**
 * 獲取學生通知列表
 * @param {Object} params - 查詢參數
 * @param {string} params.announcementType - 公告類型篩選（platform / instructor / other / 未填=全部）
 * @param {number} params.page - 頁碼（從 0 開始，預設 0）
 * @param {number} params.size - 每頁數量（預設 5）
 * @param {string} params.sort - 排序方式（預設 'createdAt,DESC'）
 * @returns {Promise<Object>} 分頁通知列表
 *
 * 回應格式：
 * {
 *   content: [...],      // 通知列表
 *   totalElements: 100,  // 總數量
 *   totalPages: 5,       // 總頁數
 *   size: 5,             // 每頁數量
 *   number: 0,           // 當前頁碼
 *   first: true,         // 是否第一頁
 *   last: false          // 是否最後一頁
 * }
 */
export const getStudentNotifications = async (params = {}) => {
  const {
    announcementType,
    page = 0,
    size = 5,
    sort = 'createdAt,DESC'
  } = params

  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort
    })

    // 添加 announcementType 參數（如果有）
    if (announcementType) {
      queryParams.append('announcementType', announcementType)
    }

    const response = await instance.get(`/notifications/student?${queryParams.toString()}`)
    return response
  } catch (error) {
    console.error('獲取學生通知列表失敗:', error)
    throw error
  }
}

/**
 * 獲取學生未讀通知數量
 * @returns {Promise<number>} 未讀通知數量
 */
export const getStudentUnreadCount = async () => {
  try {
    const response = await instance.get('/notifications/student-unread-count')
    return response
  } catch (error) {
    console.error('獲取未讀通知數量失敗:', error)
    throw error
  }
}

/**
 * 標記單個通知為已讀
 * @param {number} notificationId - 通知 ID
 * @returns {Promise<void>}
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    await instance.put(`/notifications/${notificationId}/read`)
    console.log(`通知 ${notificationId} 已標記為已讀`)
  } catch (error) {
    console.error(`標記通知 ${notificationId} 為已讀失敗:`, error)
    throw error
  }
}

/**
 * 標記所有學生通知為已讀
 * @returns {Promise<void>}
 */
export const markAllStudentNotificationsAsRead = async () => {
  try {
    await instance.put('/notifications/student-read-all')
    console.log('所有學生通知已標記為已讀')
  } catch (error) {
    console.error('標記所有學生通知為已讀失敗:', error)
    throw error
  }
}

/**
 * 刪除單個通知
 * @param {number} notificationId - 通知 ID
 * @returns {Promise<void>}
 */
export const deleteNotification = async (notificationId) => {
  try {
    await instance.delete(`/notifications/${notificationId}`)
    console.log(`通知 ${notificationId} 已刪除`)
  } catch (error) {
    console.error(`刪除通知 ${notificationId} 失敗:`, error)
    throw error
  }
}

/**
 * 批量刪除通知
 * @param {Array<number>} notificationIds - 通知 ID 陣列
 * @returns {Promise<void>}
 */
export const deleteNotifications = async (notificationIds) => {
  try {
    // 使用 Promise.all 並行刪除
    await Promise.all(
      notificationIds.map(id => deleteNotification(id))
    )
    console.log(`已刪除 ${notificationIds.length} 個通知`)
  } catch (error) {
    console.error('批量刪除通知失敗:', error)
    throw error
  }
}

/**
 * 獲取通知詳情
 * @param {number} notificationId - 通知 ID
 * @returns {Promise<Object>} 通知詳情
 */
export const getNotificationDetail = async (notificationId) => {
  try {
    const response = await instance.get(`/notifications/${notificationId}`)
    return response
  } catch (error) {
    console.error(`獲取通知 ${notificationId} 詳情失敗:`, error)
    throw error
  }
}

export default {
  getNotifications,
  getStudentNotifications,
  getStudentUnreadCount,
  markNotificationAsRead,
  markAllStudentNotificationsAsRead,
  deleteNotification,
  deleteNotifications,
  getNotificationDetail
}
