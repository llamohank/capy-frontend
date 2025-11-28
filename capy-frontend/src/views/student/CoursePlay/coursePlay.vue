<template>
  <div class="course-play">
    <h1>課程播放</h1>
    <p>課程 ID: {{ courseId }}</p>
    <div class="video-container">
      <!-- 在這裡添加視頻播放器 -->
      <p>視頻播放器區域</p>
    </div>
    <div class="course-content">
      <!-- 課程內容列表 -->
      <h2>課程章節</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const courseId = ref(route.params.id)

onMounted(() => {
  // 在這裡加載課程播放數據
  console.log('播放課程:', courseId.value)
})
</script>

<style scoped>
.course-play {
  padding: 20px;
}

.video-container {
  background: #000;
  color: #fff;
  padding: 40px;
  text-align: center;
  margin: 20px 0;
  border-radius: 8px;
}

.course-content {
  margin-top: 30px;
}

h1, h2 {
  color: #333;
  margin-bottom: 20px;
}
</style>