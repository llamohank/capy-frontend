import instance from "../../utils/http.js";

/**
 * 獲取購物車列表
 * 取得當前用戶購物車中的所有課程
 *
 * @returns {Promise} 回傳購物車課程列表
 * @example
 * {
 *   "success": true,
 *   "code": 0,
 *   "message": "string",
 *   "data": [
 *     {
 *       "courseId": 0,
 *       "courseTitle": "string",
 *       "price": 0,
 *       "coverImageUrl": "string",
 *       "instructorId": 0,
 *       "instructorName": "string"
 *     }
 *   ],
 *   "path": "string"
 * }
 */
export const getCartList = () => {
  return instance.get("/student/cart");
};

/**
 * 新增課程到購物車
 *
 * @param {number} courseId - 課程 ID
 * @returns {Promise} 回傳操作結果
 * @example
 * Request: { "courseId": 0 }
 * Response: {
 *   "success": true,
 *   "code": 0,
 *   "message": "string",
 *   "data": "string",
 *   "path": "string"
 * }
 */
export const addToCart = (courseId) => {
  return instance.post("/student/cart/add", { courseId });
};

/**
 * 從購物車移除課程
 *
 * @param {number} courseId - 課程 ID
 * @returns {Promise} 回傳操作結果
 * @example
 * Request: { "courseId": 0 }
 * Response: {
 *   "success": true,
 *   "code": 0,
 *   "message": "string",
 *   "data": "string",
 *   "path": "string"
 * }
 */
export const removeFromCart = (courseId) => {
  return instance.post("/student/cart/remove", { courseId });
};

/**
 * 清空購物車
 * 移除購物車中的所有課程
 * 使用 POST /student/cart/remove 但不傳 courseId 來清空所有課程
 *
 * @returns {Promise} 回傳操作結果
 */
export const clearCart = () => {
  return instance.post("/student/cart/remove", {});
};

