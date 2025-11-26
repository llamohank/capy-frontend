<script setup>
const isCollapse = ref(true);
</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-aside :style="{ width: isCollapse ? '200px' : '64px' }">
        <el-menu
          active-text-color="#ffd04b"
          background-color="#545c64"
          text-color="#fff"
          :collapse="!isCollapse"
          router
          class="el-menu-vertical-demo"
        >
          <el-menu-item index="/teacher/workspace">
            <el-icon><House /></el-icon>
            <template #title>工作台</template>
          </el-menu-item>
          <el-menu-item index="/teacher/mycourse">
            <el-icon><Menu /></el-icon>
            <template #title>我的課程</template>
          </el-menu-item>
          <el-menu-item index="/teacher/notification">
            <el-icon><Bell /></el-icon>
            <template #title>消息中心</template>
          </el-menu-item>
          <el-menu-item index="/teacher/coursecomment">
            <el-icon><ChatLineRound /></el-icon>
            <template #title>課程留言</template>
          </el-menu-item>
          <el-menu-item index="/teacher/announcement">
            <el-icon><Document /></el-icon>
            <template #title>發布公告</template>
          </el-menu-item>
          <el-menu-item index="/teacher/coursedata">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>數據分析</template>
          </el-menu-item>
          <el-menu-item index="/teacher/teacherprofile">
            <el-icon><Avatar /></el-icon>
            <template #title>教師個人詳情</template>
          </el-menu-item>
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
/* .common-layout {
  overflow-y: hidden;
} */
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
.el-menu {
  border-right: 0;
}
.el-switch {
  margin-top: 50px;
  margin-left: 10px;
}
</style>
