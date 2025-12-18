<script setup>
import { ref, onMounted } from "vue";
import OderRecordTable from "./OrderRecordTable.vue";
import GradientLineChart from "@/components/admin/GradientLineChart.vue";
import RevenuePieChart from "@/components/admin/RevenuePieChart.vue";
import UserGrowthChart from "@/components/admin/UserGrowthChart.vue";
import StackedBarChart from "@/components/admin/StackedBarChart.vue";
import { getWeeklyUserTrend } from "@/api/admin/dashboard";

const weeklyUserTrend = ref([]);

const getTimestamps = () => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return monthStart.getTime();
};

const fetchWeeklyUserTrend = async () => {
  try {
    const monthStartEpochMillis = getTimestamps();
    const data = await getWeeklyUserTrend(monthStartEpochMillis);
    if (data) {
      weeklyUserTrend.value = data;
    }
  } catch (error) {
    console.error("Failed to fetch weekly user trend:", error);
  }
};

onMounted(() => {
  fetchWeeklyUserTrend();
});
</script>

<template>
  <h2 class="section-heading">數據統計</h2>
  <div class="chart-container">
    <div class="wrapper">
      <GradientLineChart />
    </div>
    <el-row :gutter="24">
      <el-col :span="11">
        <div class="wrapper">
          <div class="section-title">各分類課程營收占比</div>
          <div style="height: 300px">
            <RevenuePieChart />
          </div>
        </div>
      </el-col>
      <el-col :span="13">
        <div class="wrapper">
          <div class="section-title">使用者成長趨勢圖</div>
          <div style="height: 300px">
            <UserGrowthChart :data="weeklyUserTrend" />
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="wrapper">
      <StackedBarChart />
    </div>
    <OderRecordTable />
  </div>
</template>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
</style>
