<template>
  <div class="course-detail">
    <h1>課程詳情</h1>
    <p>課程 ID: {{ courseId }}</p>
    <!-- 在這裡添加課程詳細信息 -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const courseId = ref(route.params.id)

onMounted(() => {
  // 在這裡加載課程詳情數據
  console.log('載入課程詳情:', courseId.value)
})
</script>

<style scoped>
.course-detail {
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}
</style>