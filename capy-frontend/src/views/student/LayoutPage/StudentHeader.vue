<template>
  <el-header class="header">
    <div class="header-content">
      <router-link to="/" class="logo">
        <el-icon :size="24" color="#fff"><Reading /></el-icon>
        <span class="logo-text">CopyCourse</span>
      </router-link>
      <div class="explore">
        <router-link :to="{ name: 'exploreCourses' }">
        <el-button type="success" plain>explore</el-button>
        </router-link>
      </div>
      <div class="header-center">
        <el-input
          v-model="searchText"
          placeholder="Search..."
          :prefix-icon="Search"
          class="search-input"
          size="large"
        />
      </div>
      <div class="header-actions">
        <router-link to="/teacher/apply">
        <el-button type="success" plain>Become a Teacher</el-button>
        </router-link>
        <el-button type="warning">Log In</el-button>
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { ref } from 'vue'
import { Search, Reading } from '@element-plus/icons-vue'

const searchText = ref('')
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
  height: 70px;
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.logo-text {
  white-space: nowrap;
}

.header-center {
  flex: 1;
  max-width: 500px;
}

.search-input {
  width: 100%;
}

.header-actions {
  display: flex;
  gap: 10px;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
  }

  .header-center {
    order: 3;
    width: 100%;
    max-width: 100%;
  }
}
</style>