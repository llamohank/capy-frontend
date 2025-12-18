<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import * as echarts from "echarts";
import { getRevenueTrend } from "@/api/admin/dashboard";

const data = ref([]);

const valueList = computed(() => data.value.map((item) => item.amount));
const dateList = computed(() => data.value.map((item) => item.date));

const gradientLineCharts = ref(null);
const range = ref("ALL");
const loading = ref(false);

const rangeOptions = [
  { label: "全部", value: "ALL" },
  { label: "近7日", value: "LAST_7_DAYS" },
  { label: "最近30日", value: "LAST_30_DAYS" },
  { label: "近半年", value: "LAST_HALF_YEAR" },
];

const config = {
  visualMap: { show: false },
  tooltip: {
    trigger: "axis",
    formatter: (params) => {
      const point = params[0];
      return `${point.axisValue}<br/>營收: NT$${Number(point.value).toLocaleString()}`;
    },
  },
  xAxis: { data: null },
  yAxis: {
    axisLabel: {
      formatter: (value) => `NT$${value.toLocaleString()}`,
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  series: {
    type: "line",
    showSymbol: false,
    data: null,
    smooth: true,
    lineStyle: { width: 3 },
    areaStyle: {
      opacity: 0.25,
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "#409eff" },
        { offset: 1, color: "#66ccff" },
      ]),
    },
    itemStyle: { color: "#409eff" },
    animationDuration: 1500,
    animationEasing: "cubicOut",
  },
  animationDuration: 1200,
  animationEasing: "cubicOut",
};

let resizeObserver;
let chart;

const render = () => {
  config.xAxis.data = dateList.value;
  config.series.data = valueList.value;
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

const fetchRevenueTrend = async () => {
  try {
    loading.value = true;
    const todayStartEpochMillis = getTimestamps();
    const zoneId = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const result = await getRevenueTrend(todayStartEpochMillis, zoneId, range.value);
    if (result?.points) {
      data.value = result.points;
      render();
    }
  } catch (error) {
    console.error("Failed to fetch revenue trend:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  chart = echarts.init(gradientLineCharts.value);
  fetchRevenueTrend();

  resizeObserver = new ResizeObserver(() => {
    chart?.resize();
  });
  resizeObserver.observe(gradientLineCharts.value);
});

watch(range, () => {
  fetchRevenueTrend();
});

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
  if (chart) chart.dispose();
});
</script>

<template>
  <div class="chart-header">
    <div class="section-title" style="margin-bottom: 0">營收成長趨勢圖</div>
    <el-radio-group v-model="range">
      <el-radio-button v-for="item in rangeOptions" :key="item.value" :value="item.value">
        {{ item.label }}
      </el-radio-button>
    </el-radio-group>
  </div>
  <div class="chart-wrapper" v-loading="loading">
    <div class="chart" ref="gradientLineCharts"></div>
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
