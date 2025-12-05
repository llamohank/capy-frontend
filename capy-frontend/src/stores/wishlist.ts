import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCartStore } from './cart'
import { useUserStore } from './user'

/**
 * 願望清單項目介面
 */
interface WishlistItem {
  courseId: number
  title: string
  instructor: string
  price: number
  coverImageUrl: string
  addedAt: number // 時間戳記，用於排序
}

/**
 * 願望清單 Store
 * 管理願望清單狀態、項目和操作
 */
export const useWishlistStore = defineStore('wishlist', () => {
  // ==================== State ====================

  /**
   * 願望清單項目列表
   */
  const items = ref<WishlistItem[]>([])

  // ==================== Getters ====================

  /**
   * 願望清單項目數量
   * 優先使用 user store 的數量（來自 API），如果沒有則使用本地數量
   */
  const itemCount = computed(() => {
    const userStore = useUserStore()
    // 如果已登入且有 API 數據，使用 API 數據
    if (userStore.isAuthenticated && userStore.wishlistQuantity > 0) {
      return userStore.wishlistQuantity
    }
    // 否則使用本地願望清單數量
    return items.value.length
  })

  /**
   * 願望清單是否為空
   */
  const isEmpty = computed(() => items.value.length === 0)

  /**
   * 最近加入的項目（最多 5 個）
   */
  const recentItems = computed(() => {
    return [...items.value]
      .sort((a, b) => b.addedAt - a.addedAt)
      .slice(0, 5)
  })

  // ==================== Actions ====================

  /**
   * 新增課程到願望清單
   * @param course 課程資訊
   */
  const addItem = (course: {
    id: number
    title: string
    instructor: string
    price: number
    cover_image_url: string
  }) => {
    // 檢查課程是否已在願望清單中
    const existingItem = items.value.find(item => item.courseId === course.id)

    if (existingItem) {
      console.warn('課程已在願望清單中')
      return false
    }

    // 新增到願望清單
    items.value.push({
      courseId: course.id,
      title: course.title,
      instructor: course.instructor,
      price: course.price,
      coverImageUrl: course.cover_image_url,
      addedAt: Date.now()
    })

    saveToStorage()
    return true
  }

  /**
   * 從願望清單移除課程
   * @param courseId 課程 ID
   */
  const removeItem = (courseId: number) => {
    const index = items.value.findIndex(item => item.courseId === courseId)

    if (index !== -1) {
      items.value.splice(index, 1)
      saveToStorage()
      return true
    }

    return false
  }

  /**
   * 清空願望清單
   */
  const clearWishlist = () => {
    items.value = []
    saveToStorage()
  }

  /**
   * 檢查課程是否在願望清單中
   * @param courseId 課程 ID
   */
  const hasItem = (courseId: number) => {
    return items.value.some(item => item.courseId === courseId)
  }

  /**
   * 將願望清單項目移至購物車
   * @param courseId 課程 ID
   */
  const moveToCart = (courseId: number) => {
    const item = items.value.find(item => item.courseId === courseId)

    if (!item) {
      return false
    }

    const cartStore = useCartStore()

    // 新增到購物車
    const added = cartStore.addItem({
      id: item.courseId,
      title: item.title,
      instructor: item.instructor,
      price: item.price,
      cover_image_url: item.coverImageUrl
    })

    // 如果成功加入購物車，從願望清單移除
    if (added) {
      removeItem(courseId)
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
   * 從 localStorage 載入願望清單
   */
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('wishlist')
      if (stored) {
        items.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('載入願望清單失敗:', error)
    }
  }

  /**
   * 儲存願望清單到 localStorage
   */
  const saveToStorage = () => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(items.value))
    } catch (error) {
      console.error('儲存願望清單失敗:', error)
    }
  }

  return {
    // State
    items,

    // Getters
    itemCount,
    isEmpty,
    recentItems,

    // Actions
    addItem,
    removeItem,
    clearWishlist,
    hasItem,
    moveToCart,
    formatPrice,
    loadFromStorage,
    saveToStorage
  }
})
