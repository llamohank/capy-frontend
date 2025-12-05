import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'

/**
 * 通知狀態管理 Store
 * 使用 Composition API 風格
 */
export const useNotificationStore = defineStore('notification', () => {
  // ===== State =====

  /**
   * 通知列表
   * 包含所有通知項目
   */
  const notifications = ref([
    // Mock data for development
    {
      id: 1,
      notification_type: 'account_suspended',
      title: '帳號警告',
      content: '請立即聯繫客服支援。',
      is_read: false,
      created_at: new Date().toISOString(),
      related_entity_type: null,
      related_entity_id: null
    },
    {
      id: 2,
      notification_type: 'question_answered',
      title: 'Sarah 回覆了您的問題',
      content: '在 Python 101 課程中查看您的答案。',
      is_read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      related_entity_type: 'question',
      related_entity_id: 123
    },
    {
      id: 3,
      notification_type: 'platform_announcement',
      title: '系統維護通知',
      content: '系統將於凌晨 2 點進行更新。',
      is_read: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      related_entity_type: null,
      related_entity_id: null
    },
    {
      id: 4,
      notification_type: 'new_enrollment',
      title: '新學員加入',
      content: '您的課程「Vue.js 完整指南」有新學員註冊。',
      is_read: false,
      created_at: new Date(Date.now() - 7200000).toISOString(),
      related_entity_type: 'course',
      related_entity_id: 456
    },
    {
      id: 5,
      notification_type: 'transcoding_failed',
      title: '影片轉檔失敗',
      content: '您上傳的影片「第三章：進階概念」轉檔失敗，請重新上傳。',
      is_read: false,
      created_at: new Date(Date.now() - 10800000).toISOString(),
      related_entity_type: 'video',
      related_entity_id: 789
    }
  ])

  // ===== Getters =====

  /**
   * 未讀通知數量
   * 優先使用 user store 的數量（來自 API），如果沒有則使用本地數量
   */
  const unreadCount = computed(() => {
    const userStore = useUserStore()
    // 如果已登入且有 API 數據，使用 API 數據
    if (userStore.isAuthenticated && userStore.notifyQuantity > 0) {
      return userStore.notifyQuantity
    }
    // 否則使用本地未讀通知數量
    return notifications.value.filter(n => !n.is_read).length
  })

  /**
   * 最近的通知（用於 popover 顯示）
   * 限制顯示最新的 5 條
   */
  const recentNotifications = computed(() => {
    return notifications.value.slice(0, 5)
  })

  // ===== Actions =====

  /**
   * 標記所有通知為已讀
   */
  const markAllAsRead = async () => {
    // 先更新本地狀態
    notifications.value.forEach(notification => {
      notification.is_read = true
    })

    try {
      // TODO: 實際專案中應該呼叫 API
      // await instance.post('/notifications/mark-all-read')
      console.log('所有通知已標記為已讀')
    } catch (error) {
      console.error('標記所有通知為已讀失敗:', error)
      // 如果 API 失敗，可以選擇回滾本地狀態
    }
  }

  /**
   * 標記單個通知為已讀
   * @param {number} id - 通知 ID
   */
  const markAsRead = async (id) => {
    const notification = notifications.value.find(n => n.id === id)
    if (!notification) return

    // 先更新本地狀態
    notification.is_read = true

    try {
      // TODO: 實際專案中應該呼叫 API
      // await instance.post(`/notifications/${id}/read`)
      console.log(`通知 ${id} 已標記為已讀`)
    } catch (error) {
      console.error(`標記通知 ${id} 為已讀失敗:`, error)
      // 如果 API 失敗，回滾本地狀態
      notification.is_read = false
    }
  }

  /**
   * 獲取通知列表
   * 從後端 API 獲取通知資料
   */
  const fetchNotifications = async () => {
    try {
      // TODO: 實際專案中應該呼叫 API
      // const data = await instance.get('/notifications')
      // notifications.value = data

      console.log('獲取通知列表 - 使用 Mock 資料')
    } catch (error) {
      console.error('獲取通知列表失敗:', error)
      throw error
    }
  }

  /**
   * 添加新通知（用於即時通知）
   * @param {Object} notification - 通知物件
   */
  const addNotification = (notification) => {
    notifications.value.unshift(notification)
  }

  return {
    // State
    notifications,

    // Getters
    unreadCount,
    recentNotifications,

    // Actions
    markAllAsRead,
    markAsRead,
    fetchNotifications,
    addNotification
  }
})
