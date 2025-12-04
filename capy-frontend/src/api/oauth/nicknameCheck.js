import instance from "../../utils/http.js";

/**
 * 檢查暱稱是否可用
 * @param {string} nickname - 要檢查的暱稱
 * @returns {Promise<{available: boolean}>} 回傳暱稱是否可用
 */
export const checkNickname = (nickname) => {
  // 清理暱稱（去除前後空白）
  const trimmedNickname = nickname.trim();

  // 如果暱稱為空，直接返回錯誤
  if (!trimmedNickname) {
    return Promise.reject(new Error('暱稱不能為空'));
  }

  // 呼叫後端 API: GET /checkNickname?value=xxx
  return instance.get("/student/checkNickname", {
    params: {
      value: trimmedNickname
    }
  });
};
