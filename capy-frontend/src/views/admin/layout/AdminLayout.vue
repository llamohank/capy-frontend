<script setup>
const isCollapse = ref(true);
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
        <el-scrollbar style="height: 100vh; width: 100%">
          <el-header><el-button><</el-button>hello,user123</el-header>
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
.el-header {
  border-bottom: 1px solid #d1d9e1;
  background-color: #6cf;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
</style>
