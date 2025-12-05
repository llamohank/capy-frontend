import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import { getCartList, addToCart as addToCartAPI, removeFromCart as removeFromCartAPI, clearCart as clearCartAPI } from '@/api/student/cart'
import { ElMessage } from 'element-plus'

/**
 * 購物車項目介面
 */
interface CartItem {
  courseId: number
  title: string
  instructor: string
  price: number
  coverImageUrl: string
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

  // ==================== Getters ====================

  /**
   * 購物車項目數量
   * 優先使用 user store 的數量（來自 API），如果沒有則使用本地數量
   */
  const itemCount = computed(() => {
    const userStore = useUserStore()
    // 如果已登入且有 API 數據，使用 API 數據
    if (userStore.isAuthenticated && userStore.cartQuantity > 0) {
      return userStore.cartQuantity
    }
    // 否則使用本地購物車數量
    return items.value.length
  })

  /**
   * 購物車總價（TWD）
   */
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price, 0)
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
    try {
      const data = await getCartList()
      if (data && Array.isArray(data)) {
        items.value = data.map((item: any) => ({
          courseId: item.courseId,
          title: item.courseTitle,
          instructor: item.instructorName,
          price: item.price,
          coverImageUrl: item.coverImageUrl
        }))
        // 同步到 localStorage
        saveToStorage()
        return true
      }
      return false
    } catch (error) {
      console.error('載入購物車失敗:', error)
      ElMessage.error('載入購物車失敗')
      return false
    }
  }

  /**
   * 新增課程到購物車
   * @param course 課程資訊
   */
  const addItem = async (course: {
    id: number
    title: string
    instructor: string
    price: number
    cover_image_url: string
  }) => {
    // 檢查課程是否已在購物車中
    const existingItem = items.value.find(item => item.courseId === course.id)

    if (existingItem) {
      ElMessage.warning('課程已在購物車中')
      return false
    }

    try {
      // 呼叫後端 API
      await addToCartAPI(course.id)

      // 新增到本地購物車
      items.value.push({
        courseId: course.id,
        title: course.title,
        instructor: course.instructor,
        price: course.price,
        coverImageUrl: course.cover_image_url
      })

      // 儲存到 localStorage
      saveToStorage()

      // 更新 user store 的購物車數量
      const userStore = useUserStore()
      if (userStore.isAuthenticated) {
        userStore.cartQuantity = items.value.length
      }

      ElMessage.success('已加入購物車')
      return true
    } catch (error) {
      console.error('加入購物車失敗:', error)
      ElMessage.error('加入購物車失敗')
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
      console.error('移除購物車項目失敗:', error)
      ElMessage.error('移除失敗')
      return false
    }
  }

  /**
   * 清空購物車
   */
  const clearCart = async () => {
    try {
      // 呼叫後端 API
      await clearCartAPI()

      // 清空本地購物車
      items.value = []

      // 儲存到 localStorage
      saveToStorage()

      // 更新 user store 的購物車數量
      const userStore = useUserStore()
      if (userStore.isAuthenticated) {
        userStore.cartQuantity = 0
      }

      ElMessage.success('購物車已清空')
      return true
    } catch (error) {
      console.error('清空購物車失敗:', error)
      ElMessage.error('清空購物車失敗')
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
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('cart')
      if (stored) {
        items.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('載入購物車失敗:', error)
    }
  }

  /**
   * 儲存購物車到 localStorage
   */
  const saveToStorage = () => {
    try {
      localStorage.setItem('cart', JSON.stringify(items.value))
    } catch (error) {
      console.error('儲存購物車失敗:', error)
    }
  }

  // 監聽購物車變化並自動儲存
  // 注意：在實際使用時，可以在元件中使用 watch 來觸發儲存

  return {
    // State
    items,

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
    formatPrice,
    loadFromStorage,
    saveToStorage
  }
})
