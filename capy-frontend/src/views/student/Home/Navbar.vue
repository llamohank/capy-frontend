<template>
  <div class="demo">
    <el-button type="primary" class="explore-left">探索</el-button>

    <el-input
      class="search-input"
      v-model="input"
      placeholder="課程搜尋"
      clearable
      :prefix-icon="Search"
    />
    <el-button type="primary" class="primary">成為老師</el-button>
    <el-button type="primary" @click="router.push('/LoginPage')">登入/註冊</el-button>
    
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const input = ref('')
const router = useRouter()
</script>

<style scoped>
.demo {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 700px;
  margin: auto;
}
.demo .search-input {
  flex-grow: 1;
  min-width: 500px;
  min-height: 40px;
  margin-right: 100px;
}
.demo .primary {
  flex-shrink: 0;
  height: 40px;
}
.demo .explore-left {
  flex-shrink: 0;
  width: 100px;
  height: 40px;
  margin-left: -100px;
}
</style>
