import axios from "@/utils/http";

/**
 * 取得操作紀錄列表
 * @param {Object} params
 * @param {string} [params.action] - 操作類型篩選
 * @param {number} [params.startEpochMillis] - 開始時間 (毫秒)
 * @param {number} [params.endEpochMillis] - 結束時間 (毫秒)
 * @param {number} params.page - 頁碼 (0-based)
 * @param {number} params.size - 每頁筆數
 * @param {string} [params.sort] - 排序欄位，如 "createdAt,desc"
 */
export const getAuditLogs = (params) => {
    return axios.get("/admin/logs", { params });
};
