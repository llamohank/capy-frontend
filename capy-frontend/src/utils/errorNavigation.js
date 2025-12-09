/**
 * 錯誤頁面導航輔助函數
 * 用於在應用中統一處理錯誤頁面跳轉
 */

import { useRouter } from 'vue-router'

/**
 * 導航到 403 禁止訪問頁面
 * @param {Object} router - Vue Router 實例
 */
export const navigateToForbidden = (router) => {
  router.push({ name: 'forbidden' })
}

/**
 * 導航到 404 未找到頁面
 * @param {Object} router - Vue Router 實例
 */
export const navigateToNotFound = (router) => {
  router.push({ name: 'notFound' })
}

/**
 * 導航到 404 未找到頁面（別名方法）
 * @param {Object} router - Vue Router 實例
 */
export const navigateTo404 = (router) => {
  navigateToNotFound(router)
}

/**
 * 導航到 500 伺服器錯誤頁面
 * @param {Object} router - Vue Router 實例
 */
export const navigateToServerError = (router) => {
  router.push({ name: 'serverError' })
}

/**
 * 導航到 500 伺服器錯誤頁面（別名方法）
 * @param {Object} router - Vue Router 實例
 */
export const navigateTo500 = (router) => {
  navigateToServerError(router)
}

/**
 * 根據錯誤狀態碼導航到對應的錯誤頁面
 * @param {Object} router - Vue Router 實例
 * @param {number} statusCode - HTTP 狀態碼
 */
export const navigateToErrorPage = (router, statusCode) => {
  switch (statusCode) {
    case 403:
      navigateToForbidden(router)
      break
    case 404:
      navigateToNotFound(router)
      break
    case 500:
    case 502:
    case 503:
    case 504:
      navigateToServerError(router)
      break
    default:
      // 其他錯誤可以根據需要添加
      console.warn(`未處理的錯誤狀態碼: ${statusCode}`)
  }
}

/**
 * 在 Composition API 中使用的錯誤導航 Hook
 * @returns {Object} 包含各種錯誤導航函數的對象
 */
export const useErrorNavigation = () => {
  const router = useRouter()

  return {
    goToForbidden: () => navigateToForbidden(router),
    goToNotFound: () => navigateToNotFound(router),
    goToServerError: () => navigateToServerError(router),
    goToErrorPage: (statusCode) => navigateToErrorPage(router, statusCode)
  }
}
