import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// @ts-ignore - http.js 是 JavaScript 檔案
import instance from '@/utils/http.js'

/**
 * 使用者資訊介面
 * 對應後端 API 回傳的使用者資料結構
 */
interface UserInfo {
  id: number | null
  nickname: string
  avatar: string
  roles: string[]  // 例如: ['STUDENT', 'INSTRUCTOR', 'ADMIN']
  email?: string   // 選填：使用者電子郵件
}

/**
 * 使用者狀態管理 Store
 * 使用 Composition API 風格
 */
export const useUserStore = defineStore('user', () => {
  // ===== State =====

  /**
   * 使用者資訊
   * 後端使用 Cookie 管理認證，前端不需要儲存 token
   */
  const userInfo = ref<UserInfo>({
    id: null,
    nickname: '',
    avatar: '',
    roles: []
  })

  // ===== Getters =====

  /**
   * 檢查使用者是否已驗證（已登入）
   * @returns {boolean} 如果使用者 ID 存在則返回 true
   */
  const isAuthenticated = computed(() => {
    return !!userInfo.value.id
  })

  // ===== Actions =====

  /**
   * 登入動作
   * 更新使用者資訊（Cookie 由後端自動設定）
   *
   * @param {UserInfo} user - 使用者資訊
   */
  const login = (user: UserInfo) => {
    userInfo.value = user
  }

  /**
   * 登出動作
   * 清除前端狀態，並呼叫後端登出 API 清除 Cookie
   */
  const logout = async () => {
    try {
      // 呼叫後端登出 API，清除 Cookie
      await instance.post('/student/logout')
    } catch (error) {
      console.error('登出 API 呼叫失敗:', error)
      // 即使 API 失敗，仍然清除前端狀態
    }

    // 清除前端使用者資訊
    userInfo.value = {
      id: null,
      nickname: '',
      avatar: '',
      roles: []
    }
  }

  /**
   * 初始化使用者資訊
   * 當頁面重新整理時，透過 Cookie 驗證並獲取使用者資料
   *
   * @returns {Promise<void>}
   */
  const init = async () => {
    // 如果沒有使用者資訊，嘗試從後端獲取（透過 Cookie 驗證）
    if (!userInfo.value.id) {
      try {
        // 呼叫後端 API 驗證 Cookie 並獲取使用者資料
        const response = await instance.get('/student/verify').catch((error: any) => {
          // 靜默處理 401 錯誤（未登入是正常狀態）
          // 檢查多種可能的錯誤結構
          if (error.status === 401 ||
              error.response?.status === 401 ||
              error.handled === true ||
              error.silent === true) {
            return null
          }
          // 其他錯誤繼續拋出
          throw error
        })

        // 如果沒有回應（401 未登入），直接返回
        if (!response) {
          return
        }

        // 檢查回應資料是否有效
        if (!response.user) {
          console.warn('後端回應資料格式不正確:', response)
          throw new Error('無效的回應資料格式')
        }

        // 更新使用者資訊
        userInfo.value = {
          id: response.user.id,
          nickname: response.user.nickname,
          avatar: response.user.avatarUrl || '',
          roles: response.roles || [],
          email: response.user.email
        }

        console.log('使用者資訊初始化成功:', userInfo.value)
      } catch (error: any) {
        console.error('獲取使用者資訊失敗:', error)

        // 如果是資料格式錯誤，清除使用者資訊
        if (error.message === '無效的回應資料格式') {
          userInfo.value = {
            id: null,
            nickname: '',
            avatar: '',
            roles: []
          }
        }
      }
    }
  }

  /**
   * 更新使用者資訊
   * 用於更新使用者的暱稱、頭像等資訊
   *
   * @param {Partial<UserInfo>} updates - 要更新的使用者資訊
   */
  const updateUserInfo = (updates: Partial<UserInfo>) => {
    userInfo.value = {
      ...userInfo.value,
      ...updates
    }
  }

  return {
    // State
    userInfo,

    // Getters
    isAuthenticated,

    // Actions
    login,
    logout,
    init,
    updateUserInfo
  }
})
