// ====================================
// Student Router Configuration
// 使用 LazyLoad 方式載入所有頁面組件
// ====================================

const studentRoutes = [
  // ====================================
  // 主要佈局路由 (MainLayout)
  // ====================================
  {
    path: "/",
    component: () => import("@/views/student/layout/MainLayout.vue"),
    children: [
      // 首頁
      {
        path: "",
        name: "home",
        component: () => import("@/views/student/Home/HomePage.vue"),
      },

      // ====================================
      // 課程相關路由
      // ====================================
      // 課程探索頁面
      {
        path: "explore",
        name: "courseExplore",
        component: () => import("@/views/student/ExplorePage/CourseExplorePage.vue"),
      },
      // 課程詳情頁面
      {
        path: "courses/:id",
        name: "courseDetail",
        component: () => import("@/views/student/CourseDetail/courseDetail.vue"),
      },

      // ====================================
      // 老師相關路由
      // ====================================
      // 老師詳情頁面
      {
        path: "teacherdetail/:id",
        name: "teacherDetail",
        component: () => import("@/views/student/TeacherDetail/teacherDetail.vue"),
      },
      // 成為講師申請頁面
      {
        path: "instructor/apply",
        name: "becomeInstructor",
        component: () => import("@/views/student/instructorApply/BecomeInstructorPage.vue"),
      },
      // 講師介紹頁面
      {
        path: "instructor/landing",
        name: "instructorLanding",
        component: () => import("@/views/student/instructorApply/InstructorLanding.vue"),
      },

      // ====================================
      // 購物車與結帳路由
      // ====================================
      {
        path: "checkout",
        name: "checkout",
        component: () => import("@/views/student/Checkout/Checkout.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "checkout/success",
        name: "checkoutSuccess",
        component: () => import("@/views/student/Checkout/Success.vue"),
        meta: { requiresAuth: true },
      },

      // ====================================
      // 其他頁面路由
      // ====================================
      {
        path: "about",
        name: "about",
        component: () => import("@/views/student/Others/About.vue"),
      },
      {
        path: "contact",
        name: "contact",
        component: () => import("@/views/student/Others/contact.vue"),
      },
      {
        path: "privacy",
        name: "privacy",
        component: () => import("@/views/student/Others/Privacy.vue"),
      },
      // ====================================
      // 學生中心佈局路由 (StudentCenterLayout)
      // ====================================
      {
        path: "/student",
        component: () => import("@/views/student/layout/StudentCenterLayout.vue"),
        meta: { requiresAuth: true, role: "student" },
        children: [
          // 我的學習
          {
            path: "my-learning",
            name: "MyLearning",
            component: () => import("@/views/student/StudentCenter/MyLearning/MyLearningPage.vue"),
          },
          // 願望清單
          {
            path: "wishlist",
            name: "Wishlist",
            component: () => import("@/views/student/StudentCenter/WishListPage/WishlistPage.vue"),
          },
          // 訂單記錄
          {
            path: "orders",
            name: "Orders",
            component: () => import("@/views/student/StudentCenter/Orders/OrdersPage.vue"),
          },
          // 通知中心
          {
            path: "notifications",
            name: "Notifications",
            component: () =>
              import("@/views/student/StudentCenter/Notifications/NotificationsPage.vue"),
          },
          // 重設密碼
          {
            path: "reset-password",
            name: "ResetPassword",
            component: () => import("@/views/student/StudentCenter/Profile/ResetPassword.vue"),
          },
        ],
      },
    ],
  },

  // ====================================
  // 學習佈局路由 (LearningLayout)
  // 用於課程播放頁面
  // ====================================
  {
    path: "/learning",
    component: () => import("@/views/student/layout/LearningLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      // 課程學習頁面
      {
        path: "course/:id",
        name: "courseLearning",
        component: () => import("@/views/student/CourseLearning/CourseLearningPage.vue"),
        meta: { requiresAuth: true },
      },
      // 課程播放章節頁面
      {
        path: "course/:id/section/:sectionId",
        name: "coursePlaySection",
        component: () => import("@/views/student/CoursePlaySection/coursePlaySection.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  // ====================================
  // 認證相關路由 (獨立頁面，無佈局)
  // ====================================
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/student/Auth&Register/LoginPage.vue"),
  },
  {
    path: "/oauth-callback",
    name: "authCallback",
    component: () => import("@/views/student/Auth&Register/AuthCallback.vue"),
  },
  {
    path: "/forgot-password",
    name: "forgotPassword",
    component: () => import("@/views/student/Auth&Register/ForgotPassword.vue"),
  },
  {
    path: "/verify-email",
    name: "verifyEmail",
    component: () => import("@/views/student/Auth&Register/VerifyEmail.vue"),
  },

  // ====================================
  // 404 錯誤頁面 (必須放在最後)
  // ====================================
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: () => import("@/views/student/NotFound/NotFound.vue"),
  },
];

export default studentRoutes;
