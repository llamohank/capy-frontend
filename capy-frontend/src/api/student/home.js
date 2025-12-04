import instance from "../../utils/http.js";

/**
 * 獲取首頁所有資料
 * 一次性從後端獲取首頁所需的所有資料，包括：
 * - 熱門課程 (topCourses)
 * - 最新課程 (latestCourses)
 * - 金牌講師 (goldenTeachers)
 * - 熱門標籤 (popularTags)
 * - 統計資料 (stats)
 * - 繼續學習課程 (continueLearning) - 僅登入用戶
 *
 * @returns {Promise} 回傳包含所有首頁資料的物件
 */
export const getHomePageData = () => {
  return instance.get("/student/main");
};

/**
 * 獲取首頁所有資料（別名）
 * 與 getHomePageData 功能相同
 * @returns {Promise} 回傳包含所有首頁資料的物件
 */
export const getMainPageData = () => {
  return instance.get("/student/main");
};

/**
 * 獲取繼續學習的所有資料（別名）
 * 與 getHomePageData 功能相同
 * @returns {Promise} 回傳包含所有首頁資料的物件
 */

export const getContinueLearningData=()=>{
  return instance.get("/student/progress")
}
