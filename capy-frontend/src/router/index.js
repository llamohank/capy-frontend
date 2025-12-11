import { createRouter, createWebHistory } from "vue-router";
import { CheckIsAdmin, CheckIsTeacher } from "@/api/oauth/oauth";
import { useUserStore } from "@/stores/user";
import teacherRouter from "./teacherRouter";
import adminRouter from "./adminRouter";
import studentRouter from "./studentRouter";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（例如使用瀏覽器的前進/後退按鈕）
    if (savedPosition) {
      return savedPosition;
    } else {
      // 新的導航，滾動到頂部
      return { top: 0, behavior: "smooth" };
    }
  },
});

/**
 * 路由守衛 - 全域前置守衛
 * 用於保護需要認證的路由
 */
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  // 公開路由列表（不需要認證即可訪問）
  const publicRoutes = [
    "login",
    "register",
    "authCallback",
    "forgotPassword",
    "verifyEmail",
    "resetPassword",
    "home",
    "courseExplore",
    "courseDetail",
    "teacherDetail",
    "instructorLanding",
    "about",
    "contact",
    "privacy",
    "notFound",
  ];

  // 檢查是否為公開路由
  const isPublicRoute = publicRoutes.includes(to.name);

  // 如果用戶未初始化，先初始化用戶資訊
  if (!userStore.userInfo.userId) {
    try {
      await userStore.init();
    } catch (error) {
      console.error("初始化用戶資訊失敗:", error);
    }
  }

  // 檢查路由是否需要認證
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth) {
    // 需要認證的路由
    if (!userStore.isAuthenticated) {
      // 未登入，重導向到登入頁面
      console.log("未登入，重導向到登入頁面");
      next({
        name: "login",
        query: { redirect: to.fullPath }, // 保存原始目標路徑
      });
    } else {
      // 已登入，檢查角色權限（如果有設定）
      const requiredRole = to.meta.role;
      if (requiredRole) {
        // 檢查 roles 是否存在
        if (!userStore.userInfo.roles || !Array.isArray(userStore.userInfo.roles)) {
          console.log("使用者沒有角色資訊，允許訪問");
          next();
          return;
        }

        // 將角色統一轉換為大寫進行比較
        const normalizedRequiredRole = requiredRole.toUpperCase();
        const userRoles = userStore.userInfo.roles.map((role) => role.toUpperCase());
        const hasRole = userRoles.includes(normalizedRequiredRole);

        console.log("角色檢查:", {
          requiredRole: normalizedRequiredRole,
          userRoles,
          hasRole,
        });

        if (hasRole) {
          next();
        } else {
          // 沒有權限，重導向到首頁
          console.log("沒有權限訪問該頁面");
          next({ name: "home" });
        }
      } else {
        next();
      }
    }
  } else {
    // 不需要認證的路由
    // 如果已登入且訪問登入頁面，重導向到首頁
    if (userStore.isAuthenticated && to.name === "login") {
      next({ name: "home" });
    } else {
      next();
    }
  }
});

/**
 * 路由守衛 - 全域後置鉤子
 * 用於頁面載入完成後的處理
 */
router.afterEach((to, from) => {
  // 設置頁面標題
  document.title = to.meta.title || "Capy 線上學習平台";
});

router.beforeEach(async (to, from, next) => {
  if (to.path.startsWith("/admin")) {
    try {
      await CheckIsAdmin();
    } catch (e) {
      ElMessage.error("無權訪問此頁面");

      if (!from.name) {
        next("/"); // 導去指定頁
      } else {
        next(from.fullPath);
      }

      return;
    }
  }
  if (to.path.startsWith("/teacher")) {
    try {
      await CheckIsTeacher();
    } catch (e) {
      ElMessage.error("無權訪問此頁面");
      if (!from.name) {
        next("/"); // 導去指定頁
      } else {
        next(from.fullPath);
      }
      return;
    }
  }

  next();
});
export default router;
