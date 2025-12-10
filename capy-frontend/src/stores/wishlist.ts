import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from './cart'
import { useUserStore } from './user'
import {
  fetchCenterWishlist,
  fetchWishlistItems,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist
} from '@/api/student/wishlist'
import { ElMessage } from 'element-plus'

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
  // Student Center 完整資料欄位
  averageRating?: number
  reviewCount?: number
  enrollmentCount?: number
  tags?: string[]
  categories?: string[]
  status?: string
  publishDate?: string
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

  /**
   * 載入狀態
   */
  const loading = ref(false)

  /**
   * 分頁資訊
   */
  const pagination = ref({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10
  })

  // ==================== Getters ====================

  /**
   * 願望清單項目數量
   * 優先使用 user store 的數量（來自 API），如果沒有則使用本地數量
   */
  const itemCount = computed(() => {
    const userStore = useUserStore()
    // 如果已登入，優先使用 API 數據
    if (userStore.isAuthenticated) {
      // 如果 API 數據大於 0，使用 API 數據
      if (userStore.wishlistQuantity > 0) {
        return userStore.wishlistQuantity
      }
      // 如果 API 數據是 0，但本地有資料，使用本地數據（API 可能還沒載入）
      if (items.value.length > 0) {
        return items.value.length
      }
      // 都是 0，返回 0
      return 0
    }
    // 未登入時使用本地願望清單數量
    return items.value.length
  })

  /**
   * 願望清單是否為空
   * 使用 itemCount 來判斷，而不是 items.value.length
   * 這樣可以確保與顯示的數量一致
   */
  const isEmpty = computed(() => itemCount.value === 0)

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
   * 從後端載入 Student Center 的願望清單（完整資料）
   * 專門用於 Student Center 頁面，包含完整的課程資訊
   * @param params 查詢參數
   */
  const loadCenterWishlistFromAPI = async (params = {}) => {
    try {
      loading.value = true
      const response = await fetchCenterWishlist(params)

      // 更新分頁資訊
      pagination.value = {
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        currentPage: response.number,
        pageSize: response.size
      }

      // 轉換後端資料格式為前端格式（包含完整資訊）
      items.value = response.content.map((course: any) => ({
        courseId: course.id,
        title: course.title,
        instructor: course.instructorName,
        price: course.price,
        coverImageUrl: course.coverImageUrl,
        addedAt: Date.now(),
        // 完整資料欄位
        averageRating: course.averageRating || 0,
        reviewCount: course.reviewCount || 0,
        enrollmentCount: course.enrollmentCount || 0,
        tags: course.tags || [],
        categories: course.categories || [],
        status: course.status,
        publishDate: course.publishDate
      }))

      // 同步到 localStorage
      saveToStorage()

      return response
    } catch (error) {
      console.error('載入願望清單失敗:', error)
      ElMessage({
        message: '載入願望清單失敗',
        type: 'error',
        grouping: true,
        duration: 3000
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 從後端載入簡版願望清單（不分頁）
   * 用於小組件顯示，例如 Header 的 Popover
   */
  const loadWishlistItems = async () => {
    try {
      console.log('📡 呼叫 fetchWishlistItems API...')
      const itemsData = await fetchWishlistItems()
      console.log('📡 API 回應:', itemsData)
      console.log('📡 API 回應類型:', typeof itemsData, Array.isArray(itemsData))

      // 確保 itemsData 是陣列
      if (!Array.isArray(itemsData)) {
        console.error('❌ 載入簡版願望清單失敗: API 返回的資料不是陣列', itemsData)
        return []
      }

      console.log('📊 API 返回的項目數量:', itemsData.length)

      // 轉換為標準格式
      items.value = itemsData.map((item: any) => {
        console.log('🔄 轉換項目:', item)
        return {
          courseId: item.courseId || item.id,
          title: item.courseTitle || item.title,
          instructor: item.instructorName || '',
          price: item.price,
          coverImageUrl: item.coverImageUrl,
          addedAt: Date.now()
        }
      })

      console.log('✅ 轉換後的 items.value:', items.value)

      // 同步到 localStorage
      saveToStorage()

      return itemsData
    } catch (error) {
      console.error('❌ 載入簡版願望清單失敗:', error)
      // 簡版 API 失敗不顯示錯誤訊息，避免干擾使用者
      return []
    }
  }

  /**
   * 新增課程到願望清單（整合後端 API）
   * @param course 課程資訊
   */
  const addItem = async (course: {
    id: number
    title: string
    instructor: string
    price: number
    cover_image_url: string
    status?: string
  }) => {
    try {
      const userStore = useUserStore()
      const router = useRouter()

      // 1. 檢查登入狀態
      if (!userStore.isAuthenticated) {
        ElMessage({
          message: '請先登入以使用願望清單功能',
          type: 'warning',
          grouping: true,
          duration: 3000
        })
        // 導向登入頁，並記錄當前頁面以便登入後返回
        router.push({
          name: 'Login',
          query: { redirect: router.currentRoute.value.fullPath }
        })
        return false
      }

      // 2. 檢查課程上架狀態
      if (course.status && course.status !== 'published') {
        ElMessage({
          message: '此課程尚未上架，無法加入願望清單',
          type: 'error',
          grouping: true,
          duration: 3000
        })
        return false
      }

      // 3. 檢查課程是否已在願望清單中
      const existingItem = items.value.find(item => item.courseId === course.id)

      if (existingItem) {
        ElMessage({
          message: '課程已在願望清單中',
          type: 'warning',
          grouping: true,
          duration: 2000
        })
        return false
      }

      // 4. 呼叫後端 API
      await apiAddToWishlist(course.id)

      // 新增到本地願望清單
      items.value.push({
        courseId: course.id,
        title: course.title,
        instructor: course.instructor,
        price: course.price,
        coverImageUrl: course.cover_image_url,
        addedAt: Date.now()
      })

      saveToStorage()

      // 更新 user store 的願望清單數量
      if (userStore.isAuthenticated) {
        userStore.wishlistQuantity = items.value.length
      }

      ElMessage({
        message: '已加入願望清單',
        type: 'success',
        grouping: true,
        duration: 2000
      })

      // 觸發跨頁面同步：重新載入簡版清單以確保其他頁面同步
      if (userStore.isAuthenticated) {
        await loadWishlistItems()
      }

      return true
    } catch (error: any) {
      console.error('加入願望清單失敗:', error)
      console.error('錯誤詳情:', {
        message: error.message,
        response: error.response,
        stack: error.stack
      })

      const router = useRouter()

      // 處理網路錯誤
      if (!navigator.onLine) {
        ElMessage({
          message: '網路連線中斷，請檢查您的網路連線',
          type: 'error',
          grouping: true,
          duration: 3000
        })
        return false
      }

      // 處理請求逾時
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        ElMessage({
          message: '請求逾時，請稍後再試',
          type: 'error',
          grouping: true,
          duration: 3000,
          showClose: true
        })
        return false
      }

      // 處理 401 未授權錯誤
      if (error.response?.status === 401) {
        ElMessage({
          message: '登入已過期，請重新登入',
          type: 'warning',
          grouping: true,
          duration: 3000
        })
        router.push({
          name: 'Login',
          query: { redirect: router.currentRoute.value.fullPath }
        })
        return false
      }

      // 處理 403 禁止存取
      if (error.response?.status === 403) {
        ElMessage({
          message: '您沒有權限執行此操作',
          type: 'error',
          grouping: true,
          duration: 3000
        })
        return false
      }

      // 處理其他錯誤
      ElMessage({
        message: error.response?.data?.message || '加入願望清單失敗，請稍後再試',
        type: 'error',
        grouping: true,
        duration: 3000
      })
      return false
    }
  }

  /**
   * 從願望清單移除課程（整合後端 API）
   * @param courseId 課程 ID
   */
  const removeItem = async (courseId: number) => {
    try {
      const userStore = useUserStore()
      const router = useRouter()
      const index = items.value.findIndex(item => item.courseId === courseId)

      // 檢查課程是否在願望清單中
      if (index === -1) {
        ElMessage({
          message: '課程不在願望清單中',
          type: 'warning',
          grouping: true,
          duration: 2000
        })
        return false
      }

      // 呼叫後端 API
      if (userStore.isAuthenticated) {
        await apiRemoveFromWishlist(courseId)
      }

      // 從本地願望清單移除
      items.value.splice(index, 1)
      saveToStorage()

      // 更新 user store 的願望清單數量
      if (userStore.isAuthenticated) {
        userStore.wishlistQuantity = items.value.length
      }

      // 顯示成功訊息
      ElMessage({
        message: '已從願望清單移除',
        type: 'success',
        grouping: true,
        duration: 2000
      })

      // 觸發跨頁面同步：重新載入簡版清單以確保其他頁面同步
      if (userStore.isAuthenticated) {
        await loadWishlistItems()
      }

      return true
    } catch (error: any) {
      console.error('移除願望清單失敗:', error)
      console.error('錯誤詳情:', {
        message: error.message,
        response: error.response,
        stack: error.stack
      })

      const router = useRouter()

      // 處理網路錯誤
      if (!navigator.onLine) {
        ElMessage({
          message: '網路連線中斷，請檢查您的網路連線',
          type: 'error',
          grouping: true,
          duration: 3000
        })
        return false
      }

      // 處理請求逾時
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        ElMessage({
          message: '請求逾時，請稍後再試',
          type: 'error',
          grouping: true,
          duration: 3000,
          showClose: true
        })
        return false
      }

      // 處理 401 未授權錯誤
      if (error.response?.status === 401) {
        ElMessage({
          message: '登入已過期，請重新登入',
          type: 'warning',
          grouping: true,
          duration: 3000
        })
        router.push({
          name: 'Login',
          query: { redirect: router.currentRoute.value.fullPath }
        })
        return false
      }

      // 處理 404 錯誤（課程已不在清單中）
      if (error.response?.status === 404) {
        ElMessage({
          message: '課程已不在願望清單中',
          type: 'warning',
          grouping: true,
          duration: 2000
        })
        // 同步本地狀態
        const index = items.value.findIndex(item => item.courseId === courseId)
        if (index !== -1) {
          items.value.splice(index, 1)
          saveToStorage()
        }
        return false
      }

      // 處理 403 禁止存取
      if (error.response?.status === 403) {
        ElMessage({
          message: '您沒有權限執行此操作',
          type: 'error',
          grouping: true,
          duration: 3000
        })
        return false
      }

      // 處理其他錯誤
      ElMessage({
        message: error.response?.data?.message || '移除願望清單失敗，請稍後再試',
        type: 'error',
        grouping: true,
        duration: 3000
      })
      return false
    }
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
  const moveToCart = async (courseId: number) => {
    const item = items.value.find(item => item.courseId === courseId)

    if (!item) {
      return false
    }

    const cartStore = useCartStore()

    // 新增到購物車（等待非同步操作完成）
    const added = await cartStore.addItem({
      id: item.courseId,
      title: item.title,
      instructor: item.instructor,
      price: item.price,
      cover_image_url: item.coverImageUrl
    })

    // 如果成功加入購物車，從願望清單移除
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
    loading,
    pagination,

    // Getters
    itemCount,
    isEmpty,
    recentItems,

    // Actions
    loadCenterWishlistFromAPI,
    loadWishlistItems,
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
