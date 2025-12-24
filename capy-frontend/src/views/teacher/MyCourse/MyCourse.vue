<script setup>
import { CirclePlus } from "@element-plus/icons-vue";
import CourseCard from "@/components/teacher/CourseCard.vue";
import { getCourseList } from "@/api/teacher/course";
const courseList = ref([]);
const isLoading = ref(true);
const fetchCourseList = async () => {
  try {
    isLoading.value = true;
    courseList.value = await getCourseList();
    // console.log(courseList.value);
  } catch (err) {
    console.log(err);
  } finally {
    isLoading.value = false;
  }
};
onMounted(async () => {
  await fetchCourseList();
});
</script>
<template>
  <h2 class="section-heading">我的課程</h2>
  <div class="create-right-btn">
    <el-button round type="primary" @click="$router.push({ name: 'createcourse' })"
      ><el-icon size="large" style="margin-right: 4px"><CirclePlus /></el-icon>建立新課程</el-button
    >
  </div>
  <div v-if="isLoading">
    <!-- <p style="text-align: center">加載中...</p> -->

    <el-row :gutter="24">
      <el-col v-for="i in 4" :xs="24" :sm="8" :md="6" :lg="6" :xl="6" class="course-col">
        <el-skeleton animated>
          <template #template>
            <el-skeleton-item variant="image" style="height: 240px" />
            <div style="padding: 14px">
              <el-skeleton-item variant="p" style="width: 50%" />
              <div style="display: flex; align-items: center; justify-items: space-between">
                <el-skeleton-item variant="text" style="margin-right: 16px" />
                <el-skeleton-item variant="text" style="width: 30%" />
              </div>
            </div>
          </template>
        </el-skeleton>
      </el-col>
    </el-row>
  </div>
  <!-- Course Grid -->
  <div v-else>
    <el-row v-if="courseList.length > 0" :gutter="24" class="course-grid">
      <el-col
        @click="
          $router.push({
            name: 'editcoursedetail',
            params: { courseId: course.id },
            query: { status: course.status },
          })
        "
        v-for="course in courseList"
        :key="course.id"
        :xs="24"
        :sm="8"
        :md="6"
        :lg="6"
        :xl="6"
        class="course-col"
      >
        <CourseCard :course="course" />
      </el-col>
    </el-row>
    <el-empty v-else description="還沒有課程喔..." />
  </div>
</template>
<style scoped>
.create-right-btn {
  display: flex;
  justify-content: end;
  margin-bottom: 32px;
}
.create-right-btn button {
  padding: 20px 24px;
}
.course-card {
  background-color: #fcfcfd;
  box-shadow: 0 0 4px #0000001f;
  /* padding: 24px; */
  border-radius: 8px;
}
.course-card:hover .course-card-img img {
  transform: scale(1.1);
}
.course-card-img {
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  height: 155px;
}

.course-card-img img {
  transition: transform 0.3s ease-in-out;
  width: 100%;
}
.course-card-body {
  padding: 12px;
}
.course-card-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 12px;
}
.course-card-footer {
  display: flex;
}
.el-col {
  margin-bottom: 30px;
}

.course-grid {
  margin-bottom: 40px;
}

.course-col {
  margin-bottom: 24px;
}
</style>
