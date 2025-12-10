import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Course Learning Store
 * 管理課程學習頁面的全局狀態
 */
export const useCourseStore = defineStore('courseStore', () => {
  // Theater Mode 狀態
  const isSidebarCollapsed = ref(false)

  /**
   * 切換側邊欄展開/收合狀態
   */
  const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }

  /**
   * 設置側邊欄狀態
   * @param {boolean} collapsed - 是否收合
   */
  const setSidebarCollapsed = (collapsed) => {
    isSidebarCollapsed.value = collapsed
  }

  return {
    isSidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed
  }
})
