<script setup>
import CourseCard from "@/components/teacher/CourseCard.vue";
import { getCourseList } from "@/api/teacher/course";
const courseList = ref([]);
const fetchCourseList = async () => {
  try {
    courseList.value = await getCourseList();
    console.log(courseList.value);
  } catch (err) {
    console.log(err);
  }
};
onMounted(async () => {
  fetchCourseList();
});
</script>
<template>
  <h2 class="section-heading">我的課程</h2>
  <div class="create-right-btn">
    <el-button round type="primary" @click="$router.push({ name: 'createcourse' })"
      ><el-icon size="large" style="margin-right: 4px"><CirclePlus /></el-icon>建立新課程</el-button
    >
  </div>
  <!-- <el-row :gutter="20">
    <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6">
      <RouterLink
        :to="{
          name: 'editcoursedetail',
          params: { courseId: 1 },
          query: { status: 'force_unpublish' },
        }"
      >
        <div class="course-card">
          <div class="course-card-img">
            <img src="https://picsum.photos/200" alt="" />
          </div>
          <div class="course-card-body">
            <h2 class="course-card-title">Github 免費架站術！輕鬆打造個人品牌</h2>
            <div>
              <el-rate v-model="ratevalue" disabled show-score size="large" />
              (51)
            </div>

            NT$3600
          </div>
        </div>
      </RouterLink>
    </el-col>
    <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6">
      <div class="course-card">
        <div class="course-card-img">
          <img src="https://picsum.photos/200" alt="" />
        </div>
        <div class="course-card-body">
          <h2 class="course-card-title">Github 免費架站術！輕鬆打造個人品牌</h2>
          <div>
            <el-rate v-model="ratevalue" disabled show-score size="large" />
            (51)
          </div>

          NT$3600
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6">
      <div class="course-card">
        <div class="course-card-img">
          <img src="https://picsum.photos/200" alt="" />
        </div>
        <div class="course-card-body">
          <h2 class="course-card-title">Github 免費架站術！輕鬆打造個人品牌</h2>
          <div>
            <el-rate v-model="ratevalue" disabled show-score size="large" />
            (51)
          </div>

          NT$3600
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6">
      <div class="course-card">
        <div class="course-card-img">
          <img src="https://picsum.photos/200" alt="" />
        </div>
        <div class="course-card-body">
          <h2 class="course-card-title">Github 免費架站術！輕鬆打造個人品牌</h2>
          <div>
            <el-rate v-model="ratevalue" disabled show-score size="large" />
            (51)
          </div>

          NT$3600
        </div>
      </div>
    </el-col>
  </el-row> -->

  <!-- Course Grid -->
  <el-row :gutter="24" class="course-grid">
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
/*** */
.course-grid {
  margin-bottom: 40px;
}

.course-col {
  margin-bottom: 24px;
}
</style>
