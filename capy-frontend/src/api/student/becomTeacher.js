import instance from "../../utils/http.js";

/**
 * 提交成為老師的申請
 * POST /api/become-teacher
 *
 * 需要 JWT 認證（Cookie jwt 或 Header Authorization: Bearer <token>）
 * Content-Type: multipart/form-data
 *
 * @param {Object} applicationData - 申請資料物件
 * @param {string} applicationData.fullName - 真實姓名（必填）
 * @param {string} applicationData.resume - 履歷文字（必填）
 * @param {string} applicationData.bankCode - 銀行代碼（必填）
 * @param {string} applicationData.accountNumber - 帳號（必填）
 * @param {File[]} certificates - 證明文件陣列（可選），最多 5 份，每份 ≤ 10MB
 * @returns {Promise} 回傳申請結果
 * @example
 * // 使用範例
 * const applicationData = {
 *   fullName: "王小明",
 *   resume: "5年後端經驗",
 *   bankCode: "822",
 *   accountNumber: "1234567890"
 * };
 * const certificates = [file1, file2]; // File 物件陣列
 *
 * becomeTeacher(applicationData, certificates)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 *
 * // Response 範例:
 * {
 *   "success": true,
 *   "code": 0,
 *   "message": "申請已提交",
 *   "data": {
 *     "applicationId": 123,
 *     "status": "pending",  // pending|approved|rejected
 *     "certificates": [
 *       {
 *         "certificateId": 1,
 *         "fileName": "cert1.pdf",
 *         "filePath": "/uploads/certificates/cert1.pdf"
 *       },
 *       {
 *         "certificateId": 2,
 *         "fileName": "cert2.pdf",
 *         "filePath": "/uploads/certificates/cert2.pdf"
 *       }
 *     ]
 *   },
 *   "path": "/api/become-teacher"
 * }
 *
 * // 常見錯誤：
 * // - 400: 缺少必填欄位或證明檔超過 5 份或 >10MB
 * // - 401: JWT 未帶或過期 (Unauthorized)
 */
export const becomeTeacher = (applicationData, certificates = []) => {
  // 建立 FormData 物件
  const formData = new FormData();

  // 將申請資料轉為 JSON 字串並加入 FormData
  // 注意：需要設定 Content-Type 為 application/json
  const applicationBlob = new Blob(
    [JSON.stringify(applicationData)],
    { type: 'application/json' }
  );
  formData.append('application', applicationBlob);

  // 加入證明文件（如果有的話）
  if (certificates && certificates.length > 0) {
    // 驗證證明文件數量
    if (certificates.length > 5) {
      return Promise.reject(new Error('證明文件最多只能上傳 5 份'));
    }

    // 驗證每個文件大小
    const maxSize = 10 * 1024 * 1024; // 10MB
    for (const file of certificates) {
      if (file.size > maxSize) {
        return Promise.reject(new Error(`檔案 ${file.name} 超過 10MB 限制`));
      }
    }

    // 將所有證明文件加入 FormData
    certificates.forEach((file) => {
      formData.append('certificates', file);
    });
  }

  // 發送請求
  // instance 會自動處理 JWT（從 Cookie 或 Header）
  // FormData 會自動設定正確的 Content-Type (multipart/form-data)
  return instance.post('/become-teacher', formData, {
    headers: {
      // 讓瀏覽器自動設定 Content-Type，包含正確的 boundary
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * 取得申請狀態
 * GET /api/instructor-application/status
 *
 * 查詢當前用戶的老師申請狀態
 * 需要 JWT 認證
 *
 * @returns {Promise} 回傳申請狀態
 * @example
 * // Response 範例:
 * {
 *   "success": true,
 *   "code": 0,
 *   "message": "查詢成功",
 *   "data": {
 *     "applicationId": 123,
 *     "status": "pending",  // pending|approved|rejected
 *     "fullName": "王小明",
 *     "resume": "5年後端經驗",
 *     "bankCode": "822",
 *     "accountNumber": "1234567890",
 *     "submittedAt": "2024-01-01T00:00:00Z",
 *     "reviewedAt": null,
 *     "rejectionReason": null,
 *     "certificates": [...]
 *   },
 *   "path": "/api/instructor-application/status"
 * }
 */
export const getApplicationStatus = () => {
  return instance.get('/instructor-application/status');
};

/**
 * 取得申請歷史記錄
 * GET /api/instructor-application/history
 *
 * 查詢當前用戶的所有申請記錄（包含已審核和待審核）
 * 需要 JWT 認證
 *
 * @param {number} page - 頁碼（0-based，預設 0）
 * @param {number} size - 每頁數量（預設 10）
 * @returns {Promise} 回傳申請歷史記錄
 * @example
 * // Response 範例:
 * {
 *   "success": true,
 *   "code": 0,
 *   "message": "查詢成功",
 *   "data": {
 *     "content": [
 *       {
 *         "applicationId": 123,
 *         "status": "approved",
 *         "submittedAt": "2024-01-01T00:00:00Z",
 *         "reviewedAt": "2024-01-02T00:00:00Z"
 *       }
 *     ],
 *     "totalElements": 1,
 *     "totalPages": 1,
 *     "number": 0,
 *     "size": 10
 *   },
 *   "path": "/api/instructor-application/history"
 * }
 */
export const getApplicationHistory = (page = 0, size = 10) => {
  return instance.get(`/instructor-application/history?page=${page}&size=${size}`);
};
