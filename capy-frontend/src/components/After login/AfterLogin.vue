<script setup>
const abc = ref(3);
import demo1 from '@/views/student/Home/Navbar.vue';
import demo2 from '@/views/student/Home/Carousel.vue';
import GoldenTeachers from '@/views/student/Home/GoldenTeachers.vue';
import LatestCourses from '@/views/student/Home/LatestCourses.vue';
import tags from '@/views/student/Home/tags.vue';
import TopCourses from '@/views/student/Home/TopCourses.vue';
import ContinueLearning from '@/views/student/Home/ContinueLearning.vue';

</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <demo1/>
      </el-header>
      <el-main>
        <div><demo2/></div>
        <h1></h1>
         <h1 style="margin-left: 580px;">Continue Learning</h1>
         <div><ContinueLearning /></div>
      <h1 style="margin-left: 650px;">Top Courses</h1>
        <div><TopCourses /></div>
        <h1 style="margin-left: 700px;">Tags</h1>
        <div><tags /></div>
        <h1 style="margin-left: 600px;"> Latest Courses</h1>
        <div> <LatestCourses /> </div>
        <h1 style="margin-left: 600px;">Golden Teachers</h1>
        <div><GoldenTeachers/></div>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>
<style scoped>

</style>
