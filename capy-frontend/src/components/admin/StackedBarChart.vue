<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from "echarts";
import { getWeeklyCoursePublished } from "@/api/admin/dashboard";

const stackedBarCharts = ref(null);
const range = ref("ALL");
const loading = ref(false);

const rangeOptions = [
  { label: "全部", value: "ALL" },
  { label: "近7日", value: "LAST_7_DAYS" },
  { label: "最近30日", value: "LAST_30_DAYS" },
  { label: "近半年", value: "LAST_HALF_YEAR" },
];

const weekDayLabels = ref([]);
const rawSeries = ref([]);

const chartSeries = computed(() =>
  rawSeries.value.map((item) => ({
    name: item.name,
    data: item.data,
    type: "bar",
    stack: "total",
    label: { show: true },
    emphasis: { focus: "series" },
  }))
);

const config = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  legend: {},
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "value",
  },
  yAxis: {
    type: "category",
  },
  series: null,
};

let resizeObserver;
let chart;

const render = () => {
  config.yAxis.data = weekDayLabels.value;
  config.series = chartSeries.value;
  if (chart) {
    chart.clear();
    chart.setOption(config);
  }
};

const getTimestamps = () => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return todayStart.getTime();
};

const fetchData = async () => {
  try {
    loading.value = true;
    const todayStartEpochMillis = getTimestamps();
    const zoneId = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const result = await getWeeklyCoursePublished(todayStartEpochMillis, zoneId, range.value);
    if (result) {
      weekDayLabels.value = result.weekDayLabels || [];
      rawSeries.value = result.series || [];
      render();
    }
  } catch (error) {
    console.error("Failed to fetch weekly course published:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  chart = echarts.init(stackedBarCharts.value);
  fetchData();

  resizeObserver = new ResizeObserver(() => {
    chart?.resize();
  });
  resizeObserver.observe(stackedBarCharts.value);
});

watch(range, () => {
  fetchData();
});

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
  if (chart) chart.dispose();
});
</script>

<template>
  <div class="chart-header">
    <div class="section-title" style="margin-bottom: 0">各分類課程上架數</div>
    <el-radio-group v-model="range" size="large">
      <el-radio-button v-for="item in rangeOptions" :key="item.value" :value="item.value">
        {{ item.label }}
      </el-radio-button>
    </el-radio-group>
  </div>
  <div class="chart-wrapper" v-loading="loading">
    <div class="chart" ref="stackedBarCharts"></div>
  </div>
</template>

<style scoped>
.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.chart {
  width: 100%;
  height: 100%;
}

.chart-wrapper {
  height: 500px;
}
</style>
