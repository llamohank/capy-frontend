<template>
  <div class="teacher-detail">
    <h1>教師詳情</h1>
    <p>教師 ID: {{ teacherId }}</p>
    <div class="teacher-profile">
      <div class="teacher-avatar">
        <!-- 教師頭像 -->
        <div class="avatar-placeholder">教師頭像</div>
      </div>
      <div class="teacher-info">
        <h2>教師姓名</h2>
        <p class="teacher-title">專業領域</p>
        <p class="teacher-bio">教師簡介...</p>
      </div>
    </div>
    <div class="teacher-courses">
      <h2>教師課程</h2>
      <!-- 課程列表 -->
      <p>課程列表將顯示在這裡</p>
    </div>
    <div class="teacher-stats">
      <h2>教學統計</h2>
      <!-- 統計信息 -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const teacherId = ref(route.params.id)

onMounted(() => {
  // 在這裡加載教師詳情數據
  console.log('載入教師詳情:', teacherId.value)
})
</script>

<style scoped>
.teacher-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.teacher-profile {
  display: flex;
  gap: 30px;
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.teacher-avatar .avatar-placeholder {
  width: 150px;
  height: 150px;
  background: #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.teacher-info {
  flex: 1;
}

.teacher-title {
  color: #666;
  margin: 10px 0;
}

.teacher-bio {
  line-height: 1.6;
  color: #333;
}

.teacher-courses,
.teacher-stats {
  margin: 30px 0;
  padding: 20px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

h1, h2 {
  color: #333;
  margin-bottom: 20px;
}
</style>