<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
const scrollbarRef = ref(null); // 指向 el-scrollbar
watch(
  () => route.fullPath,
  () => {
    const wrap = scrollbarRef.value?.wrapRef;
    if (wrap) wrap.scrollTo({ top: 0, behavior: "smooth" });
  }
);
const isCollapse = ref(true);

const userProfile = {
  name: "Admin User",
  avatar: "https://picsum.photos/seed/capy-admin/80",
};

const handleUserCommand = (command) => {
  if (command === "logout") {
    ElMessage.info("已登出（待串接 API）");
    return;
  }
  if (command === "switch-teacher") {
    ElMessage.info("切換至講師端（待串接路由）");
    return;
  }
  if (command === "switch-student") {
    ElMessage.info("切換至學生端（待串接路由）");
  }
};
</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-aside :style="{ width: isCollapse ? '200px' : '64px' }">
        <el-menu background-color="#545c64" :collapse="!isCollapse" class="aaa">
          <router-link :to="{ name: 'adminWorkspace' }">
            <el-menu-item index="adminWorkspace">
              <el-icon><House /></el-icon>
              <template #title>工作台</template>
            </el-menu-item>
          </router-link>
          <el-sub-menu index="course">
            <template #title>
              <el-icon><Edit /></el-icon>
              <span>課程管理</span>
            </template>
            <RouterLink :to="{ name: 'course_application_list' }">
              <el-menu-item index="course_application_list">
                <!-- <el-icon><Collection /></el-icon> -->
                <template #title>上架申請列表</template>
              </el-menu-item>
            </RouterLink>
            <RouterLink :to="{ name: 'courseManagement' }">
              <el-menu-item index="courseManagement">
                <!-- <el-icon><Operation /></el-icon> -->
                <template #title>課程狀態管理</template>
              </el-menu-item>
            </RouterLink>
          </el-sub-menu>
          <el-sub-menu index="user">
            <template #title>
              <el-icon><UserFilled /></el-icon>
              <span>用戶管理</span>
            </template>
            <RouterLink :to="{ name: 'instructor_application_list' }">
              <el-menu-item index="instructor_application_list">
                <!-- <el-icon><List /></el-icon> -->
                <template #title>教師申請列表</template>
              </el-menu-item>
            </RouterLink>
            <RouterLink :to="{ name: 'userManagement' }">
              <el-menu-item index="userManagement">
                <!-- <el-icon><SetUp /></el-icon> -->
                <template #title>用戶狀態管理</template>
              </el-menu-item>
            </RouterLink>
          </el-sub-menu>
          <el-sub-menu index="platform">
            <template #title>
              <el-icon><Management /></el-icon>
              <span>平台管理</span>
            </template>
            <RouterLink :to="{ name: 'platform_announcement' }">
              <el-menu-item index="platform_announcement">
                <!-- <el-icon><Document /></el-icon> -->
                <template #title>平台公告</template>
              </el-menu-item>
            </RouterLink>
            <RouterLink :to="{ name: 'category_management' }">
              <el-menu-item index="category_management">
                <!-- <el-icon><FolderAdd /></el-icon> -->
                <template #title>分類管理</template>
              </el-menu-item>
            </RouterLink>
          </el-sub-menu>
          <RouterLink :to="{ name: 'datastatic' }">
            <el-menu-item index="datastatic">
              <el-icon><DataAnalysis /></el-icon>
              <template #title>數據分析</template>
            </el-menu-item>
          </RouterLink>
          <RouterLink :to="{ name: 'operationrecord' }">
            <el-menu-item index="operationrecord">
              <el-icon><SetUp /></el-icon>
              <template #title>操作紀錄查詢</template>
            </el-menu-item>
          </RouterLink>
        </el-menu>
        <div>
          <el-switch v-model="isCollapse" active-action-icon="View" inactive-action-icon="Hide">
            <template #active-action>
              <el-icon><Right /></el-icon>
            </template>
            <template #inactive-action>
              <el-icon><Back /></el-icon>
            </template>
          </el-switch>
          <p style="text-align: center; color: #fff; width: 60px; font-size: 12px">
            {{ isCollapse ? "展開" : "收合" }}
          </p>
        </div>
      </el-aside>
      <el-container
        style="transition: margin 0.5s"
        :style="{ 'margin-left': isCollapse ? '200px' : '64px' }"
      >
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
                    <el-dropdown-item command="switch-teacher">切換至講師端</el-dropdown-item>
                    <el-dropdown-item command="switch-student">切換至學生端</el-dropdown-item>
                    <el-dropdown-item divided command="logout"
                      ><span
                        ><el-icon size="large" style="vertical-align: middle"
                          ><SwitchButton /></el-icon
                        >退出登入</span
                      ></el-dropdown-item
                    >
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
<style scoped>
:deep(.el-menu-item) {
  color: inherit;
}
:deep(.el-sub-menu__title) {
  color: inherit;
}
:deep(.el-sub-menu:has(.router-link-active) > .el-sub-menu__title) {
  color: #6cf;
}
.router-link-active {
  color: #6cf;
}
.el-menu--popup li {
  color: #fff;
}
.el-menu--popup .router-link-active .el-menu-item {
  color: #6cf;
}
:deep(.el-header) {
  border-bottom: 1px solid #d1d9e1;
  background-color: #6cf;
  /* padding: 24px 24px !important; */
  /* height: 80px; */
  height: auto;
  padding: 8px 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.el-aside {
  overflow: hidden;
  transition: width 0.5s;
  height: 100vh;
  position: fixed;
  background-color: #545c64;
}
.el-main {
  background-color: #f0f3f5;
  min-height: 100vh;
  /* overflow-x: hidden; */
}
.main-container {
  max-width: 1296px;
  margin: 0 auto;
}
.el-footer {
  text-align: center;
  color: #667f99;
  font-size: 14px;
  font-weight: 400;
  background-color: #f0f3f5;
}
:deep(.el-menu) {
  border-right: 0;
  color: aliceblue;
}
.el-switch {
  margin-top: 50px;
  margin-left: 10px;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.user-chip {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 12px;
  border-radius: 16px;
  background-color: #f5fbff;
  color: #304455;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  /* transition: box-shadow 0.2s; */
}
/* .user-chip:hover { */
/* box-shadow: 0 2px 10px #00000015; */
/* transform: translateY(-1px); */
/* } */
.user-name {
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.arrow {
  font-size: 14px;
  color: #6c7a89;
}
:deep(.el-dropdown-menu__item) {
  padding: 12px;
  font-size: 16px;
  letter-spacing: 0.5px;
  justify-content: center;
  font-weight: 500;
}
</style>
