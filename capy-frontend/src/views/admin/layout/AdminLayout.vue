<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppSidebar from "@/components/layout/AppSidebar.vue";
import { logout } from "@/api/oauth/oauth";
const router = useRouter();
const route = useRoute();
const scrollbarRef = ref(null);
const sidebarRef = ref(null);

watch(
  () => route.fullPath,
  () => {
    const wrap = scrollbarRef.value?.wrapRef;
    if (wrap) wrap.scrollTo({ top: 0, behavior: "smooth" });
  }
);

// 管理員選單配置
const adminMenuItems = [
  {
    type: "item",
    route: "adminWorkspace",
    icon: "House",
    label: "工作台",
  },
  {
    type: "submenu",
    key: "course",
    icon: "Edit",
    label: "課程管理",
    children: [
      { route: "course_application_list", label: "上架申請列表" },
      { route: "courseManagement", label: "課程狀態管理" },
    ],
  },
  {
    type: "submenu",
    key: "user",
    icon: "UserFilled",
    label: "用戶管理",
    children: [
      { route: "instructor_application_list", label: "教師申請列表" },
      { route: "userManagement", label: "用戶狀態管理" },
    ],
  },
  {
    type: "submenu",
    key: "platform",
    icon: "Management",
    label: "平台管理",
    children: [
      { route: "platform_announcement", label: "平台公告" },
      { route: "category_management", label: "標籤管理" },
    ],
  },
  {
    type: "item",
    route: "datastatic",
    icon: "DataAnalysis",
    label: "數據分析",
  },
  {
    type: "item",
    route: "operationrecord",
    icon: "SetUp",
    label: "操作紀錄查詢",
  },
];

const userProfile = {
  name: "Admin User",
  avatar: "https://picsum.photos/seed/capy-admin/80",
};

const handleUserCommand = async (command) => {
  if (command === "logout") {
    await logout();
    router.push("/");
  } else if (command === "switch-student") {
    router.push("/student");
    ElMessage.success("已切換至學生中心");
  }
};
</script>

<template>
  <div class="common-layout">
    <el-container>
      <AppSidebar
        ref="sidebarRef"
        :menu-items="adminMenuItems"
        logo-text="CapyCourse"
        logo-short="C"
        home-route="adminWorkspace"
      />

      <el-container class="main-wrapper" :class="{ 'is-pinned': sidebarRef?.isPinned }">
        <el-scrollbar ref="scrollbarRef" style="height: 100vh; width: 100%">
          <el-header>
            <div class="header-actions">
              <el-dropdown trigger="hover" @command="handleUserCommand">
                <span class="user-chip">
                  <el-avatar :size="40" :src="userProfile.avatar" />
                  <span class="user-name">{{ userProfile.name }}</span>
                  <el-icon class="arrow"><ArrowDown /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu style="width: 200px">
                    <el-dropdown-item command="switch-student">切換至學生端</el-dropdown-item>
                    <el-dropdown-item divided command="logout">
                      <span>
                        <el-icon size="large" style="vertical-align: middle"
                          ><SwitchButton
                        /></el-icon>
                        退出登入
                      </span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </el-header>
          <el-main>
            <div class="main-container">
              <RouterView></RouterView>
            </div>
          </el-main>
          <el-footer>Copyright © 2025 CapyCourse. All rights reserved.</el-footer>
        </el-scrollbar>
      </el-container>
    </el-container>
  </div>
</template>

<style src="@/styles/element-plus-override.css"></style>
<style src="@/styles/admin-dashboard.css"></style>

<style scoped>
/* ==================== Main Wrapper ==================== */
.main-wrapper {
  margin-left: 64px;
  transition: margin-left 0.2s ease;
}

.main-wrapper.is-pinned {
  margin-left: 200px;
}

/* ==================== Header ==================== */
:deep(.el-header) {
  border-bottom: 1px solid #e5e7eb;
  background-color: #ffffff;
  height: auto;
  padding: 12px 28px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

/* ==================== Main Content ==================== */
.el-main {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding: 24px 32px;
}

.main-container {
  max-width: 1320px;
  margin: 0 auto;
}

/* ==================== Footer ==================== */
.el-footer {
  text-align: center;
  color: #6b7280;
  font-size: 13px;
  font-weight: 400;
  background-color: #f5f7fa;
  padding: 24px;
}

/* ==================== User Header Actions ==================== */
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 16px;
  border-radius: 50px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
}

.user-chip:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.user-name {
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arrow {
  font-size: 14px;
  color: #6b7280;
}

/* ==================== Dropdown Menu ==================== */
:deep(.el-dropdown-menu__item) {
  padding: 14px 20px;
  font-size: 15px;
  letter-spacing: 0.3px;
  justify-content: center;
  font-weight: 500;
  transition: all 0.15s ease;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: #eef2ff;
  color: #4f46e5;
}
</style>
