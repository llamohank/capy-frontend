import axios from "axios";
import router from "@/router";

// 建立實體時指派預設配置
const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api`,
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
    // 檢查是否有標準的後端回應格式 {success, code, data}
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      // 返回 data 欄位（可能是 null、陣列或物件）
      return response.data.data;
    }
    // 如果不是標準格式，返回原始 response.data
    return response.data ?? null;
  },
  (error) => {
    // 任何 2xx 之外的 HTTP 狀態碼，都會觸發此函數

    // 處理 401 未授權錯誤（Cookie 過期或無效）
    if (error.response?.status === 401) {
      // 特殊處理：如果是 /auth/verify 端點的 401，這是正常的未登入狀態
      const isVerifyEndpoint = error.config?.url?.includes("/auth/verify");

      if (isVerifyEndpoint) {
        // 這是正常的未登入狀態，完全靜默處理
        return Promise.reject({
          handled: true,
          status: 401,
          message: "未登入（正常狀態）",
          silent: true,
        });
      }

      // 清除前端登入狀態
      // 動態導入 userStore 以避免循環依賴
      import('@/stores/user').then(({ useUserStore }) => {
        const userStore = useUserStore();
        // 清除使用者資訊（不呼叫後端 logout API，因為 Cookie 已失效）
        userStore.userInfo = {
          userId: null,
          nickname: '',
          email: '',
          avatarUrl: '',
          roles: []
        };
        userStore.cartQuantity = 0;
        userStore.wishlistQuantity = 0;
        userStore.notifyQuantity = 0;
      }).catch(err => {
        console.warn('清除使用者狀態時發生錯誤:', err);
      });

      // 公開頁面列表（不需要重導向到登入頁）
      const publicPages = [
        '/',                    // 主頁
        '/login',               // 登入頁
        '/register',            // 註冊頁
        '/forgot-password',     // 忘記密碼
        '/reset-password',      // 重設密碼
        '/verify-email',        // 驗證信箱
        '/oauth-callback',      // OAuth 回調
        '/explore',             // 課程探索
        '/courses/',            // 課程詳情
        '/teacherdetail/',      // 老師詳情
        '/instructor/landing',  // 講師介紹頁
        '/about',               // 關於我們
        '/contact',             // 聯絡我們
        '/privacy',             // 隱私政策
        '/legal'                // 法律條款
      ];
      const currentPath = window.location.pathname;
      const isPublicPage = publicPages.some(page => currentPath.startsWith(page) || currentPath === page);

      // 如果不是公開頁面，則導向登入頁
      if (!isPublicPage) {
        console.log("🔒 認證已過期，清除登入狀態並導向登入頁");
        router.push({
          name: "login",
          query: { redirect: window.location.pathname + window.location.search },
        });
      }

      // 401 錯誤已處理
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
