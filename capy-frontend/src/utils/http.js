import axios from "axios";
import router from "@/router";

// 建立實體時指派預設配置
const instance = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  withCredentials: true, // 啟用 Cookie 傳送
});

// 新增一個請求攔截器
instance.interceptors.request.use(
  (config) => {
    // 後端使用 Cookie 認證，不需要手動添加 Authorization header
    return config;
  },
  (error) => {
    // 發生請求錯誤時，做些什麼
    return Promise.reject(error);
  }
);

// 新增一個回應攔截器
instance.interceptors.response.use(
  (response) => {
    // 任何 2xx 的 HTTP 狀態碼，將會觸發此函數
    // 針對回應資料，做些什麼
    // 安全地提取 data，避免 null/undefined 錯誤
    return response.data?.data ?? response.data ?? null;
  },
  (error) => {
    // 任何 2xx 之外的 HTTP 狀態碼，都會觸發此函數

    // 處理 401 未授權錯誤（Cookie 過期或無效）
    if (error.response?.status === 401) {
      // Cookie 由後端管理，前端不需要手動清除

      // 特殊處理：如果是 /student/verify 端點的 401，這是正常的未登入狀態
      const isVerifyEndpoint = error.config?.url?.includes("/student/verify");

      if (isVerifyEndpoint) {
        // 這是正常的未登入狀態，靜默處理
        return Promise.reject({
          handled: true,
          status: 401,
          message: "未登入（正常狀態）",
          silent: true,
        });
      }

      // 公開頁面列表（不需要重導向到登入頁）
      const publicPages = [
        "/login",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
        "/oauth-callback",
      ];
      const currentPath = window.location.pathname;
      const isPublicPage = publicPages.some((page) => currentPath.includes(page));

      // 如果不是公開頁面，則導向登入頁
      if (!isPublicPage) {
        console.log("認證已過期，導向登入頁");
        ElMessage.error("555");
        router.push({ name: "login", query: { redirect: window.location.pathname } });
        // window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname);
      }

      // 401 錯誤已處理，不再拋出到 Console
      return Promise.reject({
        handled: true,
        status: 401,
        message: "未授權，已自動處理",
      });
    }

    // 針對其他回應錯誤，做些什麼
    return Promise.reject(error);
  }
);

export default instance;
