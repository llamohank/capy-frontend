import instance from "../../utils/http.js";

/**
 * 獲取熱門課程前 15 筆
 * @returns {Promise<Result<List<CoursePreviewVo>>>}
 */
export const getPopularCourses = () => {
  return instance.get("/main/popular");
};

/**
 * 獲取最新課程前 15 筆
 * @returns {Promise<Result<List<CoursePreviewVo>>>}
 */
export const getLatestCourses = () => {
  return instance.get("/main/latest");
};

/**
 * 獲取熱門標籤前 18 筆
 * @returns {Promise<Result<List<TopTagVo>>>}
 */
export const getTopTags = () => {
  return instance.get("/main/toptags");
};

/**
 * 獲取金牌講師（最多 4 位）
 * @returns {Promise<Result<List<GoldenTrVo>>>}
 */
export const getGoldenTeachers = () => {
  return instance.get("/main/goldentr");
};

/**
 * 獲取繼續學習的所有資料（別名）
 * 與 getHomePageData 功能相同
 * @returns {Promise} 回傳包含所有首頁資料的物件
 */

export const getContinueLearningData = () => {
  return instance.get("/student/progress")
}

/**
 * 獲取用戶資料
 * 包含用戶基本資訊、購物車數量、願望清單數量、通知數量
 *
 * @returns {Promise} 回傳包含用戶資料的物件
 * @example
 * {
 *   "success": true,
 *   "code": 0,
 *   "message": "string",
 *   "data": {
 *     "userInfo": {
 *       "userId": 0,
 *       "nickname": "string",
 *       "email": "string",
 *       "avatarUrl": "string"
 *     },
 *     "cartQuantity": 0,
 *     "wishlistQuantity": 0,
 *     "notifyQuantity": 0
 *   },
 *   "path": "string"
 * }
 */
export const getUserData = () => {
  return instance.get("/student/user")
}
