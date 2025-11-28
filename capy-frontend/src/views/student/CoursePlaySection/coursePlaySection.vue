<template>
  <div class="course-play-section">
    <h1>課程章節播放</h1>
    <p>課程 ID: {{ courseId }}</p>
    <p>章節 ID: {{ sectionId }}</p>
    <div class="video-container">
      <!-- 在這裡添加視頻播放器 -->
      <p>章節視頻播放器區域</p>
    </div>
    <div class="section-info">
      <h2>章節資訊</h2>
      <!-- 章節詳細信息 -->
    </div>
    <div class="navigation">
      <button @click="previousSection">上一章節</button>
      <button @click="nextSection">下一章節</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const courseId = ref(route.params.id)
const sectionId = ref(route.params.sectionId)

const previousSection = () => {
  // 實現上一章節邏輯
  console.log('上一章節')
}

const nextSection = () => {
  // 實現下一章節邏輯
  console.log('下一章節')
}

onMounted(() => {
  // 在這裡加載章節數據
  console.log('播放章節:', courseId.value, sectionId.value)
})
</script>

<style scoped>
.course-play-section {
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

.section-info {
  margin: 30px 0;
}

.navigation {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.navigation button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.navigation button:hover {
  background: #0056b3;
}

h1, h2 {
  color: #333;
  margin-bottom: 20px;
}
</style>