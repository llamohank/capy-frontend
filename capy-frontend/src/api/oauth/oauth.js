import instance from "../../utils/http.js";
import {
  sanitizeLoginParam,
  sanitizeRegisterParam,
  validateEmail,
  validatePasswordStrength,
} from "./oauthSchema.ts";

/**
 * 登入 API
 * @param {Object} loginParam - 登入參數 { email, password, turnstileToken }
 * @returns {Promise} 回傳包含 token 和 user 資訊的 Promise
 */
export const login = ({ email, password, turnstileToken }) => {
  // 清理參數
  const cleanedParam = sanitizeLoginParam({ email, password });

  // 驗證電子郵件格式
  if (!validateEmail(cleanedParam.email)) {
    return Promise.reject(new Error("電子郵件格式不正確"));
  }

  // 準備請求資料，包含 Turnstile token
  // 後端期望的參數名稱是 cf-turnstile-response
  const requestData = {
    ...cleanedParam,
    'cf-turnstile-response': turnstileToken || ''
  };

  console.log('Login API 準備送出:', {
    email: requestData.email,
    password: '***',
    'cf-turnstile-response': requestData['cf-turnstile-response'] ? `${requestData['cf-turnstile-response'].substring(0, 20)}...` : 'empty'
  });

  // 對應後端 API: POST /api/login
  return instance.post("/auth/login", requestData);
};

/**
 * 註冊 API
 * @param {Object} registerParam - 註冊參數 { email, password, nickname, googleId?, turnstileToken }
 * @returns {Promise} 回傳包含使用者資訊的 Promise
 */
export const register = ({ email, password, nickname, googleId, turnstileToken }) => {
  // 清理參數
  const cleanedParam = sanitizeRegisterParam({
    email,
    password,
    nickname,
    googleId,
  });

  // 驗證電子郵件格式
  if (!validateEmail(cleanedParam.email)) {
    return Promise.reject(new Error("電子郵件格式不正確"));
  }

  // 驗證密碼強度
  const passwordValidation = validatePasswordStrength(cleanedParam.password);
  if (!passwordValidation.isValid) {
    return Promise.reject(new Error(passwordValidation.message));
  }

  // 對應後端 API: POST /api/register
  // 後端期望的參數名稱是 cf-turnstile-response
  const requestBody = {
    email: cleanedParam.email,
    password: cleanedParam.password,
    nickname: cleanedParam.nickname,
    'cf-turnstile-response': turnstileToken || ''
  };

  // 只有在有 googleId 時才加入
  if (cleanedParam.googleId) {
    requestBody.googleId = cleanedParam.googleId;
  }

  console.log('Register API 準備送出:', {
    email: requestBody.email,
    password: '***',
    nickname: requestBody.nickname,
    googleId: requestBody.googleId || 'none',
    'cf-turnstile-response': requestBody['cf-turnstile-response'] ? `${requestBody['cf-turnstile-response'].substring(0, 20)}...` : 'empty'
  });

  return instance.post("/auth/register", requestBody);
};

/**
 * 導向 Google OAuth 登入
 * 這會將使用者導向後端的 OAuth 授權端點
 * 後端會處理整個 OAuth 流程並透過 redirect 返回結果
 */
export const initiateGoogleOAuth = () => {
  // 導向後端的 Google OAuth 授權端點
  window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/oauth2/authorization/google`;
};

/**
 * 忘記密碼 - 發送重設密碼郵件
 * @param {string} email - 電子郵件
 * @returns {Promise}
 */
export const forgotPassword = (email) => {
  if (!validateEmail(email)) {
    return Promise.reject(new Error("電子郵件格式不正確"));
    return Promise.reject(new Error("電子郵件格式不正確"));
  }

  return instance.post("/auth/forgotPassword", {
    email: email.trim().toLowerCase(),
  });
};

/**
 * 重設密碼
 * @param {Object} resetParam - 重設密碼參數 { token, newPassword }
 * @returns {Promise}
 */
export const resetPassword = ({ token, newPassword }) => {
  // 驗證密碼強度
  const passwordValidation = validatePasswordStrength(newPassword);
  if (!passwordValidation.isValid) {
    return Promise.reject(new Error(passwordValidation.message));
  }

  return instance.post("/auth/resetPassword", {
    token,
    newPassword, // 使用 camelCase 符合後端格式
    newPassword, // 使用 camelCase 符合後端格式
  });
};

/**
 * 驗證電子郵件
 * @param {string} token - 驗證令牌
 * @returns {Promise}
 */
export const verifyEmail = (token) => {
  if (!token) {
    return Promise.reject(new Error('缺少驗證令牌'));
  }

  // 使用 POST 請求，token 作為 query parameter
  // 確保 URL 中有 ?token=
  return instance.post('/auth/verifyEmail', null, { params: { token } });
};

/**
 * 修改密碼（已登入使用者）
 * @param {Object} changeParam - 修改密碼參數 { oldPassword, newPassword }
 * @returns {Promise}
 */
export const changePassword = ({ oldPassword, newPassword }) => {
  // 驗證新密碼強度
  const passwordValidation = validatePasswordStrength(newPassword);
  if (!passwordValidation.isValid) {
    return Promise.reject(new Error(passwordValidation.message));
  }


  return instance.put("/password/change", {
    old_password: oldPassword,
    new_password: newPassword,
  });
};

/**
 * 綁定 Google 帳號
 * @param {Object} bindParam - 綁定參數
 * @param {string} bindParam.googleId - Google ID
 * @param {string} bindParam.password - 使用者密碼（用於驗證身份）
 * @returns {Promise}
 */
export const bindGoogleAccount = ({ googleId, password }) => {
  // 驗證必要參數
  if (!googleId || !password) {
    return Promise.reject(new Error("缺少必要參數"));
  }

  return instance.post("/student/account/bindGoogle", {
    googleId,
    password,
  });
};

/**
 * 驗證使用者身份 API（學生端未授權區 Controller）
 * 用於頁面重整時驗證 JWT Cookie 是否有效，並獲取使用者資訊
 *
 * @description
 * - 方法：GET /api/auth/verify（不需 body）
 * - 認證：使用 HttpOnly Cookie（withCredentials: true）
 * - 成功回應：Result<AuthResponseVo>，其中 token 欄位為 null（僅回傳使用者資訊與角色）
 *
 * @returns {Promise<Object>} 回傳使用者資訊和角色
 *
 * @example 成功回應格式
 * {
 *   "success": true,
 *   "code": 200,
 *   "message": null,
 *   "path": null,
 *   "data": {
 *     "token": null,
 *     "roles": ["student", "instructor"],   // 依角色而定，預設 student
 *     "user": {
 *       "id": 123,
 *       "email": "user@example.com",
 *       "nickname": "Nick",
 *       "role": "student",                   // 取 roles 第一個
 *       "avatarUrl": "https://...",
 *       "googleLinked": true
 *     }
 *   }
 * }
 *
 * @example 失敗回應（未登入/Token 無效）
 * {
 *   "success": false,
 *   "code": 401,
 *   "message": "未授權或 Token 無效",
 *   "path": "/api/auth/verify",
 *   "data": null
 * }
 */
export const verifyAuth = () => {
  return instance.get("/auth/verify");
};

/**
 * 登出 API
 * 清除後端 Cookie 並結束使用者會話
 * @returns {Promise}
 */
export const logout = () => {
  return instance.post("/auth/logout");
};
//進老師頁面前檢查
export const CheckIsTeacher = () => {
  return instance.get("/teacher/health");
};
//進管理員頁面前檢查
export const CheckIsAdmin = () => {
  return instance.get("/admin/health");
};
