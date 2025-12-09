<template>
  <div class="related-courses">
    <h2 class="section-title-student">Related Courses</h2>
    <el-row :gutter="24">
      <el-col
        v-for="course in courses"
        :key="course.id"
        :xs="24"
        :sm="12"
        :md="8"
        class="course-col"
      >
        <el-card class="course-card" shadow="hover" @click="goToCourse(course.id)">
          <div class="course-cover">
            <img :src="course.cover" :alt="course.title" />
          </div>
          <div class="course-info">
            <h4 class="course-title">{{ course.title }}</h4>
            <p class="course-teacher">{{ course.teacher }}</p>
            <div class="course-meta">
              <el-rate
                v-model="course.rating"
                disabled
                size="small"
                show-score
                text-color="#ff9900"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  courses: {
    type: Array,
    required: true
  }
})

const router = useRouter()

const goToCourse = (courseId) => {
  router.push(`/courses/${courseId}`)
}
</script>

<style scoped>
.related-courses {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
}

.section-title-student {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 24px 0;
}

.course-col {
  margin-bottom: 24px;
}

.course-card {
  cursor: pointer;
  transition: transform 0.3s;
  border-radius: 8px;
  overflow: hidden;
}

.course-card:hover {
  transform: translateY(-4px);
}

.course-card :deep(.el-card__body) {
  padding: 0;
}

.course-cover {
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.course-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-info {
  padding: 16px;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-teacher {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 768px) {
  .course-col {
    margin-bottom: 16px;
  }
}
</style>
