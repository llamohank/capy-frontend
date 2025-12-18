<script setup>
import { getDashboardData } from "@/api/teacher/profile";
const dashboardData = ref(null);
onMounted(async () => {
  const res = await getDashboardData(Date.now());
  dashboardData.value = res;
  console.log(res);
});
const topCoursesCount = computed(
  () => dashboardData.value?.top5Courses.filter((item) => item.value).length
);
</script>
<template>
  <h2 class="section-heading">教師工作台</h2>
  <div
    v-if="dashboardData"
    style="padding-top: 24px; display: flex; flex-direction: column; gap: 36px"
  >
    <div>
      <h3 class="section-title">課程資訊</h3>
      <el-row :gutter="20">
        <el-col :span="6"
          ><div class="data-wrapper">
            總學生數<span class="data">{{ dashboardData.totalStudents }}</span>
          </div></el-col
        >
        <el-col :span="6"
          ><div class="data-wrapper">
            總課程數<span class="data">{{ dashboardData.totalCourses }}</span>
          </div></el-col
        >
        <el-col :span="6"
          ><div class="data-wrapper">
            平均評分<span class="data">{{ dashboardData.averageRating.toFixed(2) }}</span>
          </div></el-col
        >
        <el-col :span="6"
          ><div class="data-wrapper">
            本月收益
            <span class="data"
              ><el-text class="data" truncated>NT${{ dashboardData.monthlyRevenue }}</el-text></span
            >
          </div></el-col
        >
      </el-row>
    </div>
    <div>
      <h3 class="section-title">通知與留言</h3>
      <el-row :gutter="20">
        <el-col :span="6"
          ><div class="data-wrapper">
            未讀通知數<span class="data">{{ dashboardData.unreadNotifications }}</span>
          </div></el-col
        >
        <el-col :span="6"
          ><div class="data-wrapper">
            未回覆留言<span class="data"
              >{{ dashboardData.unansweredQuestions
              }}<el-icon style="margin-left: 4px; font-size: 30px"><ChatLineRound /></el-icon
            ></span></div
        ></el-col>
        <el-col :span="6"
          ><div class="data-wrapper">
            今日新增留言<span class="data">{{ dashboardData.newQuestionsToday }}</span>
          </div></el-col
        >
        <el-col :span="6"
          ><div class="data-wrapper">
            今日新增評論
            <span class="data">{{ dashboardData.newReviewsToday }}</span>
          </div></el-col
        >
      </el-row>
    </div>
    <div>
      <h3 class="section-title">課程數據一覽</h3>
      <el-row :gutter="20">
        <el-col :span="13"
          ><div class="wrapper">
            <p style="font-size: 20px; color: rgb(84, 80, 80); display: flex">
              近半年營收成長<span style="margin-left: auto; font-weight: 700">56人</span>
            </p>
            <div class="chart-container">
              <LineCharts :data="dashboardData.lastSixMonthRevenue"></LineCharts>
            </div></div
        ></el-col>
        <el-col :span="11"
          ><div class="wrapper">
            <p style="font-size: 20px; color: rgb(84, 80, 80)">
              課程營收占比Top{{ topCoursesCount }}
            </p>
            <div class="chart-container">
              <PieCharts :data="dashboardData.top5Courses"></PieCharts>
            </div></div
        ></el-col>
      </el-row>
    </div>
  </div>
</template>
<style scoped>
.data-wrapper {
  font-size: 14px;
  color: rgb(84, 80, 80);
  background-color: #fcfcfd;
  box-shadow: 0 0 8px #0000001f;
  padding: 24px;
  border-radius: 16px;
}
.data {
  margin-top: 24px;
  font-weight: 700;
  font-size: 24px;
  display: block;
}
.chart-container {
  height: 300px;
  width: 100%;
}
</style>
