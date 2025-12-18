<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import AppSidebar from "@/components/layout/AppSidebar.vue";
import { logout } from "@/api/oauth/oauth";

const userStore = useUserStore();
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

// 老師端選單配置
const teacherMenuItems = [
  {
    type: "item",
    route: "teacherWorkspace",
    icon: "House",
    label: "工作台",
  },
  {
    type: "item",
    route: "mycourse",
    icon: "Menu",
    label: "我的課程",
    activeRoutes: ["createcourse", "editcoursedetail", "coursedetail"],
  },
  {
    type: "item",
    route: "notification",
    icon: "Bell",
    label: "消息中心",
  },
  {
    type: "item",
    route: "coursecomment",
    icon: "ChatLineRound",
    label: "課程留言",
  },
  {
    type: "item",
    route: "announcement",
    icon: "Document",
    label: "發布公告",
  },
  {
    type: "item",
    route: "teacherprofile",
    icon: "Avatar",
    label: "教師個人詳情",
  },
];

const handleUserCommand = async (command) => {
  if (command === "logout") {
    await logout();
    router.push("/");
    return;
  }

  if (command === "switch-student") {
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
        :menu-items="teacherMenuItems"
        logo-text="CapyCourse"
        logo-short="C"
        home-route="teacherWorkspace"
      />

      <el-container class="main-wrapper" :class="{ 'is-pinned': sidebarRef?.isPinned }">
        <el-scrollbar ref="scrollbarRef" style="height: 100vh; width: 100%">
          <el-header>
            <div class="header-actions">
              <el-dropdown trigger="hover" @command="handleUserCommand">
                <span class="user-chip">
                  <el-avatar :size="32" :src="userStore.userInfo.avatarUrl" />
                  <span class="user-name">{{ userStore.userInfo.nickname }}</span>
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
  border-bottom: 1px solid #E5E7EB;
  background-color: #FFFFFF;
  height: 60px;
  padding: 6px 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

/* ==================== Main Content ==================== */
.el-main {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding: 20px 24px;
}

.main-container {
  max-width: 1200px;
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
  height: 48px;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 10px;
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
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arrow {
  font-size: 12px;
  color: #6B7280;
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
