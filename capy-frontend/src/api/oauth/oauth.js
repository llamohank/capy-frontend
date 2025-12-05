import instance from "../../utils/http.js";
import {
  sanitizeLoginParam,
  sanitizeRegisterParam,
  validateEmail,
  validatePasswordStrength
} from "./oauthSchema.ts";

/**
 * 登入 API
 * @param {Object} loginParam - 登入參數 { email, password }
 * @returns {Promise} 回傳包含 token 和 user 資訊的 Promise
 */
export const login = ({ email, password }) => {
  // 清理參數
  const cleanedParam = sanitizeLoginParam({ email, password });

  // 驗證電子郵件格式
  if (!validateEmail(cleanedParam.email)) {
    return Promise.reject(new Error('電子郵件格式不正確'));
  }

  // 對應後端 API: POST /api/login
  return instance.post("/student/login", cleanedParam);
};

/**
 * 註冊 API
 * @param {Object} registerParam - 註冊參數 { email, password, nickname, googleId? }
 * @returns {Promise} 回傳包含使用者資訊的 Promise
 */
export const register = ({ email, password, nickname, googleId }) => {
  // 清理參數
  const cleanedParam = sanitizeRegisterParam({
    email,
    password,
    nickname,
    googleId
  });

  // 驗證電子郵件格式
  if (!validateEmail(cleanedParam.email)) {
    return Promise.reject(new Error('電子郵件格式不正確'));
  }

  // 驗證密碼強度
  const passwordValidation = validatePasswordStrength(cleanedParam.password);
  if (!passwordValidation.isValid) {
    return Promise.reject(new Error(passwordValidation.message));
  }

  // 對應後端 API: POST /api/register
  // 後端使用 google_id (snake_case)
  const requestBody = {
    email: cleanedParam.email,
    password: cleanedParam.password,
    nickname: cleanedParam.nickname
  };

  // 只有在有 googleId 時才加入
  if (cleanedParam.googleId) {
    requestBody.googleId = cleanedParam.googleId;
  }

  return instance.post("/student/register", requestBody);
};

/**
 * 導向 Google OAuth 登入
 * 這會將使用者導向後端的 OAuth 授權端點
 * 後端會處理整個 OAuth 流程並透過 redirect 返回結果
 */
export const initiateGoogleOAuth = () => {
  // 導向後端的 Google OAuth 授權端點
  // 後端會處理 OAuth 流程並 redirect 回前端
  window.location.href = 'http://localhost:8080/api/oauth2/authorization/google';
};

/**
 * 忘記密碼 - 發送重設密碼郵件
 * @param {string} email - 電子郵件
 * @returns {Promise}
 */
export const forgotPassword = (email) => {
  if (!validateEmail(email)) {
    return Promise.reject(new Error('電子郵件格式不正確'));
  }

  return instance.post("/student/forgotPassword", {
    email: email.trim().toLowerCase()
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

  return instance.post("/student/resetPassword", {
    token,
    newPassword  // 使用 camelCase 符合後端格式
  });
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
    new_password: newPassword
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
    return Promise.reject(new Error('缺少必要參數'));
  }

  return instance.post("/student/account/bindGoogle", {
    googleId,
    password
  });
};
