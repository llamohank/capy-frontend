import instance from "../../utils/http.js";

/**
 * 取得購物車（分頁版）
 * GET /student/orders/cart?page=<0-based>&size=<預設5>
 *
 * @param {number} page - 頁碼（0-based）
 * @param {number} size - 每頁數量（預設5）
 * @returns {Promise} 回傳分頁的購物車課程列表
 * @example
 * Response: {
 *   "content": [
 *     {
 *       "courseId": 0,
 *       "courseTitle": "string",
 *       "price": 0,
 *       "coverImageUrl": "string",
 *       "instructorId": 0,
 *       "instructorName": "string"
 *     }
 *   ],
 *   "totalElements": 0,
 *   "totalPages": 0,
 *   "number": 0,
 *   "size": 0
 * }
 */
export const getCartPaginated = (page = 0, size = 5) => {
  return instance.get(`/student/orders/cart?page=${page}&size=${size}`);
};

/**
 * 建立訂單
 * POST /student/orders/create
 *
 * @param {number[]} courseIds - 課程 ID 陣列
 * @returns {Promise} 回傳訂單 ID
 * @example
 * Request: { "courseIds": [123, 456] }
 * Response: {
 *   "success": true,
 *   "code": 0,
 *   "message": "string",
 *   "data": 789,  // orderId (Long)
 *   "path": "string"
 * }
 */
export const createOrder = (courseIds) => {
  return instance.post("/student/orders/create", { courseIds });
};

/**
 * 取得訂單詳情（付款後/失敗查看）
 * GET /student/orders/{orderId}/details
 *
 * @param {number} orderId - 訂單 ID
 * @returns {Promise} 回傳訂單詳細資訊
 * @example
 * Response: {
 *   "orderId": 0,
 *   "totalAmount": "0.00",  // BigDecimal
 *   "transactionId": "string",
 *   "paidAt": "2024-01-01T00:00:00Z",  // Instant ISO 8601
 *   "createdAt": "2024-01-01T00:00:00Z",  // Instant ISO 8601
 *   "status": "pending|paid|failed",  // OrderStatusEnum
 *   "orderItems": [
 *     {
 *       "courseId": 0,
 *       "courseTitle": "string",
 *       "price": 0,  // Long (下單時價格)
 *       "coverImageUrl": "string",
 *       "instructorId": 0,
 *       "instructorName": "string"
 *     }
 *   ]
 * }
 */
export const getOrderDetails = (orderId) => {
  return instance.get(`/student/orders/${orderId}/details`);
};

/**
 * 取得 ECPay 付款頁資訊
 * POST /student/orders/{orderId}/ecpay/checkout
 *
 * @param {number} orderId - 訂單 ID
 * @param {string} paymentMethod - 付款方式 (Credit|WebATM|ATM|CVS|BARCODE)
 * @returns {Promise} 回傳 ECPay 付款表單資訊
 * @example
 * Response: {
 *   "actionUrl": "https://payment.ecpay.com.tw/...",  // 付款表單提交 URL
 *   "formFields": {  // Map<String,String> 欄位鍵值需前端組 form 並 submit
 *     "MerchantID": "...",
 *     "MerchantTradeNo": "...",
 *     "MerchantTradeDate": "...",
 *     "PaymentType": "aio",
 *     "TotalAmount": "...",
 *     "TradeDesc": "...",
 *     "ItemName": "...",
 *     "ReturnURL": "...",
 *     "ChoosePayment": "...",
 *     "CheckMacValue": "..."
 *   }
 * }
 */
export const getEcpayCheckout = (orderId, paymentMethod = 'Credit') => {
  return instance.post(`/student/orders/${orderId}/ecpay/checkout`, {
    choosePayment: paymentMethod
  });
};

/**
 * 取得付款成功頁資料
 * GET /student/orders/{orderId}/success
 *
 * @param {number} orderId - 訂單 ID
 * @returns {Promise} 回傳付款成功資訊
 * @example
 * Response: {
 *   "orderId": 0,
 *   "paidAt": "2024-01-01T00:00:00Z",  // Instant ISO 8601
 *   "totalAmount": "0.00",  // BigDecimal
 *   "items": [  // CourseItemVo[]
 *     {
 *       "courseId": 0,
 *       "courseTitle": "string",
 *       "price": 0,  // Long
 *       "coverImageUrl": "string",
 *       "instructorId": 0,
 *       "instructorName": "string"
 *     }
 *   ]
 * }
 */
export const getOrderSuccess = (orderId) => {
  return instance.get(`/student/orders/${orderId}/success`);
};

/**
 * 取得訂單列表（學生中心）
 * GET /student/center/orders?status=<paid|pending|failed>&page=&size=
 *
 * @param {string} status - 狀態篩選 (paid|pending|failed)，不傳則取得全部
 * @param {number} page - 頁碼（0-based）
 * @param {number} size - 每頁數量
 * @returns {Promise} 回傳分頁的訂單列表
 * @example
 * Response: {
 *   "content": [
 *     {
 *       "orderId": 0,
 *       "totalAmount": "0.00",  // BigDecimal
 *       "status": "pending|paid|failed",  // OrderStatusEnum
 *       "createdAt": "2024-01-01T00:00:00Z",  // Instant ISO 8601
 *       "paidAt": "2024-01-01T00:00:00Z",  // Instant ISO 8601
 *       "items": [  // CourseItemVo[]
 *         {
 *           "courseId": 0,
 *           "courseTitle": "string",
 *           "price": 0,  // Long
 *           "coverImageUrl": "string",
 *           "instructorId": 0,
 *           "instructorName": "string"
 *         }
 *       ]
 *     }
 *   ],
 *   "totalElements": 0,
 *   "totalPages": 0,
 *   "number": 0,
 *   "size": 0
 * }
 */
export const getOrdersList = (status, page = 0, size = 10) => {
  // 如果 status 為 undefined 或 null，不傳遞 status 參數
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });

  if (status) {
    params.append('status', status);
  }

  return instance.get(`/student/center/orders?${params.toString()}`);
};
