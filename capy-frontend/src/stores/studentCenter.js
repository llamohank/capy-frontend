/**
 * Student Center Store
 *
 * 管理學生中心的狀態，包括：
 * 1. Profile 資料快取
 * 2. My Learning 資料管理
 * 3. 載入狀態管理
 *
 * @see /instruction/STUDENT_CENTER_API_DESIGN.md
 */

import { defineStore } from 'pinia'
import {
  fetchStudentProfile,
  fetchMyLearning,
  updateStudentProfile,
  submitCourseRating,
  updateCourseRating
} from '@/api/student/studentCenter'

export const useStudentCenterStore = defineStore('studentCenter', {
  state: () => ({
    // Profile 相關
    profile: null,
    profileLoading: false,
    profileError: null,
    profileLastFetchTime: null,

    // My Learning 相關
    myLearning: {
      content: [],
      totalPages: 0,
      totalElements: 0,
      currentPage: 0,
      size: 10,
      empty: true
    },
    myLearningLoading: false,
    myLearningError: null,

    // 快取設定
    cacheDuration: 5 * 60 * 1000 // 5 分鐘
  }),

  getters: {
    /**
     * 檢查 Profile 快取是否有效
     * @returns {boolean}
     */
    isProfileCacheValid: (state) => {
      if (!state.profileLastFetchTime || !state.profile) {
        return false
      }
      const now = Date.now()
      const cacheAge = now - state.profileLastFetchTime
      return cacheAge < state.cacheDuration
    },

    /**
     * 獲取統計數據
     * @returns {Object}
     */
    statistics: (state) => {
      if (!state.profile) {
        return {
          ownedCoursesCount: 0,
          wishlistCount: 0,
          completedCoursesCount: 0
        }
      }
      return {
        ownedCoursesCount: state.profile.ownedCoursesCount || 0,
        wishlistCount: state.profile.wishlistCount || 0,
        completedCoursesCount: state.profile.completedCoursesCount || 0
      }
    },

    /**
     * 獲取進行中的課程數量
     * @returns {number}
     */
    inProgressCoursesCount: (state) => {
      if (!state.profile) return 0
      return state.profile.ownedCoursesCount - state.profile.completedCoursesCount
    },

    /**
     * 檢查是否有課程資料
     * @returns {boolean}
     */
    hasCourses: (state) => {
      return state.myLearning.content.length > 0
    },

    /**
     * 獲取當前頁的課程列表
     * @returns {Array}
     */
    currentPageCourses: (state) => {
      return state.myLearning.content
    }
  },

  actions: {
    /**
     * 載入學生 Profile
     *
     * @param {boolean} forceRefresh - 是否強制刷新（忽略快取）
     * @returns {Promise<Object>}
     *
     * @example
     * // 使用快取（如果有效）
     * await studentCenterStore.loadProfile()
     *
     * @example
     * // 強制刷新
     * await studentCenterStore.loadProfile(true)
     */
    async loadProfile(forceRefresh = false) {
      // 如果快取有效且不強制刷新，直接返回
      if (!forceRefresh && this.isProfileCacheValid) {
        return this.profile
      }

      this.profileLoading = true
      this.profileError = null

      try {
        const response = await fetchStudentProfile()
        // http.js 已經提取了 response.data.data，所以 response 就是我們要的資料
        console.log('🔍 Store received response:', response)
        this.profile = response
        this.profileLastFetchTime = Date.now()
        console.log('🔍 Store profile set to:', this.profile)
        return this.profile
      } catch (error) {
        this.profileError = error.message || '載入 Profile 失敗'
        console.error('Failed to load student profile:', error)
        throw error
      } finally {
        this.profileLoading = false
      }
    },

    /**
     * 載入我的課程學習記錄
     *
     * @param {Object} params - 查詢參數
     * @param {number} [params.page=0] - 頁碼
     * @param {number} [params.size=10] - 每頁筆數
     * @param {string} [params.status='all'] - 課程狀態
     * @param {string} [params.sort='lastWatch,desc'] - 排序方式
     * @returns {Promise<Object>}
     *
     * @example
     * // 載入第一頁
     * await studentCenterStore.loadMyLearning({ page: 0 })
     *
     * @example
     * // 載入進行中的課程
     * await studentCenterStore.loadMyLearning({
     *   page: 0,
     *   status: 'in_progress'
     * })
     */
    async loadMyLearning(params = {}) {
      this.myLearningLoading = true
      this.myLearningError = null

      try {
        const response = await fetchMyLearning(params)
        // http.js 已經提取了 response.data.data，所以 response 就是我們要的資料
        const data = response

        this.myLearning = {
          content: data.content || [],
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0,
          currentPage: data.number || 0,
          size: data.size || 10,
          empty: data.empty ?? true
        }

        return this.myLearning
      } catch (error) {
        this.myLearningError = error.message || '載入課程列表失敗'
        console.error('Failed to load my learning:', error)
        throw error
      } finally {
        this.myLearningLoading = false
      }
    },

    /**
     * 更新 Profile 資料
     *
     * @param {Object} data - 要更新的資料
     * @param {string} [data.nickname] - 暱稱
     * @param {string} [data.avatarUrl] - 頭像 URL
     * @returns {Promise<Object>}
     *
     * @example
     * await studentCenterStore.updateProfile({
     *   nickname: 'New Name',
     *   avatarUrl: 'https://example.com/avatar.jpg'
     * })
     */
    async updateProfile(data) {
      this.profileLoading = true
      this.profileError = null

      try {
        const response = await updateStudentProfile(data)

        // 更新本地 profile
        // http.js 已經提取了 response.data.data，所以 response 就是我們要的資料
        if (this.profile) {
          this.profile = {
            ...this.profile,
            ...response
          }
        }

        // 重置快取時間，強制下次重新載入
        this.profileLastFetchTime = Date.now()

        return response
      } catch (error) {
        this.profileError = error.message || '更新 Profile 失敗'
        console.error('Failed to update profile:', error)
        throw error
      } finally {
        this.profileLoading = false
      }
    },

    /**
     * 提交課程評分
     *
     * @param {number} progressId - 學習進度 ID
     * @param {Object} data - 評分資料
     * @param {number} data.rating - 評分（1-5）
     * @param {string} [data.comment] - 評論內容
     * @returns {Promise<Object>}
     *
     * @example
     * await studentCenterStore.submitRating(1001, {
     *   rating: 5,
     *   comment: '很棒的課程！'
     * })
     */
    async submitRating(progressId, data) {
      try {
        const response = await submitCourseRating(progressId, data)

        // 更新本地課程的評分資料
        const course = this.myLearning.content.find(
          c => c.progressId === progressId
        )
        if (course) {
          course.rating = data.rating
          course.rateComment = data.comment || ''
        }

        return response
      } catch (error) {
        console.error('Failed to submit rating:', error)
        throw error
      }
    },

    /**
     * 更新課程評分
     *
     * @param {number} progressId - 學習進度 ID
     * @param {Object} data - 評分資料
     * @param {number} data.rating - 評分（1-5）
     * @param {string} [data.comment] - 評論內容
     * @returns {Promise<Object>}
     *
     * @example
     * await studentCenterStore.updateRating(1001, {
     *   rating: 4,
     *   comment: '更新後的評論'
     * })
     */
    async updateRating(progressId, data) {
      try {
        const response = await updateCourseRating(progressId, data)

        // 更新本地課程的評分資料
        const course = this.myLearning.content.find(
          c => c.progressId === progressId
        )
        if (course) {
          course.rating = data.rating
          course.rateComment = data.comment || ''
        }

        return response
      } catch (error) {
        console.error('Failed to update rating:', error)
        throw error
      }
    },

    /**
     * 清除 Profile 快取
     */
    clearProfileCache() {
      this.profile = null
      this.profileLastFetchTime = null
      this.profileError = null
    },

    /**
     * 清除 My Learning 資料
     */
    clearMyLearning() {
      this.myLearning = {
        content: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        size: 10,
        empty: true
      }
      this.myLearningError = null
    },

    /**
     * 清除所有資料
     */
    clearAll() {
      this.clearProfileCache()
      this.clearMyLearning()
    },

    /**
     * 設定快取持續時間
     *
     * @param {number} duration - 持續時間（毫秒）
     *
     * @example
     * // 設定為 10 分鐘
     * studentCenterStore.setCacheDuration(10 * 60 * 1000)
     */
    setCacheDuration(duration) {
      this.cacheDuration = duration
    }
  }
})
