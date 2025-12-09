<template>
  <el-card class="course-card" shadow="hover" @click="goToCourseDetail">
    <div class="course-image" :style="{ backgroundColor: course.bgColor }">
      <div class="course-icon">{{ course.icon }}</div>
    </div>
    <div class="course-info">
      <h3 class="course-title">{{ course.title }}</h3>
      <p class="course-description">{{ course.description }}</p>
    </div>
  </el-card>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const goToCourseDetail = () => {
  // 如果課程有 id，則跳轉到詳情頁
  if (props.course.id) {
    router.push(`/courses/${props.course.id}`)
  }
}
</script>

<style scoped>
.course-card {
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s;
  cursor: pointer;
}

.course-card:hover {
  transform: translateY(-5px);
}

.course-image {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-bottom: 15px;
}

.course-icon {
  font-size: 80px;
}

.course-info {
  padding: 10px 0;
}

.course-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.course-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}
</style>
