import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// @ts-ignore - home.js 是 JavaScript 檔案
import { getUserData } from '@/api/student/home.js'
// @ts-ignore - http.js 是 JavaScript 檔案
import instance from '@/utils/http.js'

/**
 * 使用者資訊介面
 * 對應後端 API 回傳的使用者資料結構
 */
interface UserInfo {
  userId: number | null
  nickname: string
  email: string
  avatarUrl: string
  roles?: string[]  // 例如: ['STUDENT', 'INSTRUCTOR', 'ADMIN']
}

/**
 * 用戶數據介面（包含購物車、願望清單、通知數量）
 */
interface UserData {
  userInfo: UserInfo
  cartQuantity: number
  wishlistQuantity: number
  notifyQuantity: number
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
    userId: null,
    nickname: '',
    email: '',
    avatarUrl: ''
  })

  /**
   * 購物車數量
   */
  const cartQuantity = ref<number>(0)

  /**
   * 願望清單數量
   */
  const wishlistQuantity = ref<number>(0)

  /**
   * 通知數量
   */
  const notifyQuantity = ref<number>(0)

  // ===== Getters =====

  /**
   * 檢查使用者是否已驗證（已登入）
   * @returns {boolean} 如果使用者 ID 存在則返回 true
   */
  const isAuthenticated = computed(() => {
    return !!userInfo.value.userId
  })

  // ===== Actions =====

  /**
   * 登入動作
   * 更新使用者資訊（Cookie 由後端自動設定）
   *
   * @param {UserInfo} user - 使用者資訊
   */
  const login = (user: UserInfo, quantities?: { cart?: number; wishlist?: number; notify?: number }) => {
    userInfo.value = user
    if (quantities) {
      cartQuantity.value = quantities.cart || 0
      wishlistQuantity.value = quantities.wishlist || 0
      notifyQuantity.value = quantities.notify || 0
    }
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
      userId: null,
      nickname: '',
      email: '',
      avatarUrl: ''
    }
    cartQuantity.value = 0
    wishlistQuantity.value = 0
    notifyQuantity.value = 0
  }

  /**
   * 初始化使用者資訊
   * 當頁面重新整理時，透過 Cookie 驗證並獲取使用者資料
   *
   * @returns {Promise<void>}
   */
  const init = async () => {
    // 如果沒有使用者資訊，嘗試從後端獲取（透過 Cookie 驗證）
    if (!userInfo.value.userId) {
      try {
        // 呼叫後端 API 驗證 Cookie 並獲取使用者資料
        const response = await getUserData().catch((error: any) => {
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
        // http.js 攔截器已經返回 response.data，所以 response 本身就是 data
        if (!response || !response.userInfo) {
          console.warn('後端回應資料格式不正確:', response)
          throw new Error('無效的回應資料格式')
        }

        const data = response as UserData

        // 更新使用者資訊
        userInfo.value = {
          userId: data.userInfo.userId,
          nickname: data.userInfo.nickname,
          email: data.userInfo.email,
          avatarUrl: data.userInfo.avatarUrl || ''
        }

        // 更新數量資訊
        cartQuantity.value = data.cartQuantity
        wishlistQuantity.value = data.wishlistQuantity
        notifyQuantity.value = data.notifyQuantity

        console.log('使用者資訊初始化成功:', userInfo.value)
      } catch (error: any) {
        console.error('獲取使用者資訊失敗:', error)

        // 如果是資料格式錯誤，清除使用者資訊
        if (error.message === '無效的回應資料格式') {
          userInfo.value = {
            userId: null,
            nickname: '',
            email: '',
            avatarUrl: ''
          }
          cartQuantity.value = 0
          wishlistQuantity.value = 0
          notifyQuantity.value = 0
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

  /**
   * 更新數量資訊
   * @param quantities 數量資訊
   */
  const updateQuantities = (quantities: { cart?: number; wishlist?: number; notify?: number }) => {
    if (quantities.cart !== undefined) cartQuantity.value = quantities.cart
    if (quantities.wishlist !== undefined) wishlistQuantity.value = quantities.wishlist
    if (quantities.notify !== undefined) notifyQuantity.value = quantities.notify
  }

  return {
    // State
    userInfo,
    cartQuantity,
    wishlistQuantity,
    notifyQuantity,

    // Getters
    isAuthenticated,

    // Actions
    login,
    logout,
    init,
    updateUserInfo,
    updateQuantities
  }
})
