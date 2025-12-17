import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import { getCartList, addToCart as addToCartAPI, removeFromCart as removeFromCartAPI, clearCart as clearCartAPI } from '@/api/student/cart'
import { ElMessage } from 'element-plus'
import { getItemState } from '@/composable/useCourseState.js'

/**
 * 購物車項目介面
 */
interface CartItem {
  courseId: number
  title: string
  instructor: string
  price: number
  coverImageUrl: string
  status?: string
  isEnrolled?: boolean
}

/**
 * 購物車 Store
 * 管理購物車狀態、項目和操作
 */
export const useCartStore = defineStore('cart', () => {
  // ==================== State ====================

  /**
   * 購物車項目列表
   */
  const items = ref<CartItem[]>([])

  /**
   * 控制購物車抽屜顯示狀態
   */
  const isCartOpen = ref(false)

  // ==================== Getters ====================

  /**
   * 購物車項目數量
   * 購物車功能需要登入才能使用，直接使用後端 API 數據
   */
  const itemCount = computed(() => {
    const userStore = useUserStore()
    // 購物車需要登入，直接使用 API 數據
    return userStore.isAuthenticated ? userStore.cartQuantity : 0
  })

  /**
   * 購物車總價（TWD）
   * 只計算可購買的項目（過濾已下架和已擁有的課程）
   */
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => {
      const state = getItemState(item)
      // 只計算可購買的項目
      if (state.canBuy) {
        return sum + item.price
      }
      return sum
    }, 0)
  })

  /**
   * 格式化的總價字串（NT$ X,XXX）
   */
  const formattedTotalPrice = computed(() => {
    return `NT$ ${totalPrice.value.toLocaleString('zh-TW')}`
  })

  /**
   * 購物車是否為空
   */
  const isEmpty = computed(() => items.value.length === 0)

  // ==================== Actions ====================

  /**
   * 從後端載入購物車列表
   */
  const fetchCartList = async () => {
    const userStore = useUserStore()

    // 如果未登入，直接返回 false（不顯示錯誤訊息）
    if (!userStore.isAuthenticated) {
      return false
    }

    try {
      const data = await getCartList()
      if (data && Array.isArray(data)) {
        items.value = data.map((item: any) => ({
          courseId: item.courseId,
          title: item.courseTitle,
          instructor: item.instructorName,
          price: item.price,
          coverImageUrl: item.coverImageUrl,
          status: item.status,
          isEnrolled: item.isEnrolled
        }))
        // 同步到 localStorage（作為臨時快取）
        saveToStorage()
        return true
      }
      return false
    } catch (error: any) {
      // 靜默處理 401 錯誤（未登入）
      if (error?.response?.status === 401 || error?.status === 401) {
        return false
      }

      // 其他錯誤才顯示訊息
      ElMessage.error('載入購物車失敗')
      return false
    }
  }

  /**
   * 新增課程到購物車
   * @param course 課程資訊
   *
   * 注意：此方法假設後端已修改為：
   * - 成功時返回 200 OK
   * - 已擁有課程時返回 400 Bad Request
   * - 已在購物車時返回 409 Conflict
   */
  const addItem = async (course: {
    id: number
    title: string
    instructor: string
    price: number
    cover_image_url: string
  }) => {
    try {
      // 呼叫後端 API（成功時返回 200）
      await addToCartAPI(course.id)

      // 成功加入：更新本地購物車
      const existingItem = items.value.find(item => item.courseId === course.id)

      if (!existingItem) {
        items.value.push({
          courseId: course.id,
          title: course.title,
          instructor: course.instructor,
          price: course.price,
          coverImageUrl: course.cover_image_url,
          status: 'PUBLISHED', // 新加入的課程預設為已上架
          isEnrolled: false // 新加入的課程預設為未擁有
        })

        // 儲存到 localStorage
        saveToStorage()

        // 更新 user store 的購物車數量
        const userStore = useUserStore()
        if (userStore.isAuthenticated) {
          userStore.cartQuantity = items.value.length
        }
      }

      // 顯示成功訊息
      ElMessage.success(`已加入「${course.title}」到購物車`)
      return true
    } catch (error: any) {
      // 從錯誤回應中提取訊息
      let errorMessage = '加入購物車失敗'
      let messageType: 'info' | 'warning' | 'error' = 'error'

      if (error?.response?.data) {
        const responseData = error.response.data
        // 後端標準格式：{ success, code, message, data }
        errorMessage = responseData.message || errorMessage
      } else if (error?.message) {
        errorMessage = error.message
      }

      // 根據狀態碼或訊息內容判斷錯誤類型
      if (error?.response?.status === 409) {
        // 409 Conflict - 課程已在購物車
        errorMessage = '課程已在購物車中'
        messageType = 'warning'
      } else if (typeof errorMessage === 'string') {
        if (errorMessage.includes('已擁有')) {
          // 已購買課程
          messageType = 'info'
        } else if (errorMessage.includes('已在購物車')) {
          // 已在購物車
          errorMessage = '課程已在購物車中'
          messageType = 'warning'
        }
      }

      // 顯示訊息（不包含錯誤代碼）
      if (messageType === 'info') {
        ElMessage.info(errorMessage)
      } else if (messageType === 'warning') {
        ElMessage.warning(errorMessage)
      } else {
        ElMessage.error(errorMessage)
      }

      return false
    }
  }

  /**
   * 從購物車移除課程
   * @param courseId 課程 ID
   */
  const removeItem = async (courseId: number) => {
    const index = items.value.findIndex(item => item.courseId === courseId)

    if (index === -1) {
      return false
    }

    try {
      // 呼叫後端 API
      await removeFromCartAPI(courseId)

      // 從本地購物車移除
      items.value.splice(index, 1)

      // 儲存到 localStorage
      saveToStorage()

      // 更新 user store 的購物車數量
      const userStore = useUserStore()
      if (userStore.isAuthenticated) {
        userStore.cartQuantity = items.value.length
      }

      return true
    } catch (error) {
      ElMessage.error('移除失敗')
      return false
    }
  }

  /**
   * 清空購物車選項介面
   */
  interface ClearCartOptions {
    /**
     * 是否跳過呼叫後端 API
     * 用於登出時，因為 Cookie 已被清除，無需再呼叫 API
     */
    skipAPICall?: boolean
  }

  /**
   * 清空購物車
   * @param options - 清空選項
   */
  const clearCart = async (options: ClearCartOptions = {}) => {
    const { skipAPICall = false } = options

    try {
      // 只在需要時呼叫後端 API
      if (!skipAPICall) {
        await clearCartAPI()
      }

      // 清空本地購物車
      items.value = []

      // 儲存到 localStorage
      saveToStorage()

      // 更新 user store 的購物車數量
      const userStore = useUserStore()
      if (userStore.isAuthenticated) {
        userStore.cartQuantity = 0
      }

      if (!skipAPICall) {
        ElMessage.success('購物車已清空')
      }
      return true
    } catch (error) {
      if (!skipAPICall) {
        ElMessage.error('清空購物車失敗')
      }
      return false
    }
  }

  /**
   * 檢查課程是否在購物車中
   * @param courseId 課程 ID
   */
  const hasItem = (courseId: number) => {
    return items.value.some(item => item.courseId === courseId)
  }

  /**
   * 將購物車項目移至願望清單
   * @param courseId 課程 ID
   */
  const moveToWishlist = async (courseId: number) => {
    const item = items.value.find(item => item.courseId === courseId)

    if (!item) {
      return false
    }

    // 動態導入 wishlist store 以避免循環依賴
    const { useWishlistStore } = await import('./wishlist')
    const wishlistStore = useWishlistStore()

    // 新增到願望清單
    const added = await wishlistStore.addItem({
      id: item.courseId,
      title: item.title,
      instructor: item.instructor,
      price: item.price,
      cover_image_url: item.coverImageUrl
    })

    // 如果成功加入願望清單，從購物車移除
    if (added) {
      await removeItem(courseId)
      return true
    }

    return false
  }

  /**
   * 格式化價格（TWD）
   * @param price 價格
   */
  const formatPrice = (price: number) => {
    return `NT$ ${price.toLocaleString('zh-TW')}`
  }

  // ==================== Persistence ====================

  /**
   * 從 localStorage 載入購物車
   */
  /**
   * 從 localStorage 載入購物車
   * 注意：僅作為已登入用戶的臨時快取使用
   */
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('cart')
      if (stored) {
        items.value = JSON.parse(stored)
      }
    } catch (error) {
      // 靜默失敗
    }
  }

  /**
   * 儲存購物車到 localStorage
   */
  /**
   * 儲存購物車到 localStorage
   * 注意：僅作為已登入用戶的臨時快取使用
   */
  const saveToStorage = () => {
    try {
      localStorage.setItem('cart', JSON.stringify(items.value))
    } catch (error) {
      // 靜默失敗
    }
  }

  // ==================== UI Controls ====================

  const openCart = () => {
    isCartOpen.value = true
  }

  const closeCart = () => {
    isCartOpen.value = false
  }

  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value
  }

  // 監聽購物車變化並自動儲存
  // 注意：在實際使用時，可以在元件中使用 watch 來觸發儲存

  return {
    // State
    items,
    isCartOpen,

    // Getters
    itemCount,
    totalPrice,
    formattedTotalPrice,
    isEmpty,

    // Actions
    fetchCartList,
    addItem,
    removeItem,
    clearCart,
    hasItem,
    moveToWishlist,
    formatPrice,
    loadFromStorage,
    saveToStorage,
    openCart,
    closeCart,
    toggleCart
  }
})
