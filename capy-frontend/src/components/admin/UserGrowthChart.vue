<script setup>
import * as echarts from "echarts";
import { onMounted, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const chartRef = ref(null);
let chart = null;
let resizeObserver = null;

const render = () => {
  if (!chart || !props.data?.length) return;

  const labels = props.data.map((item) => item.label);
  const counts = props.data.map((item) => item.count);

  const options = {
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: labels,
    },
    yAxis: {
      type: "value",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    series: [
      {
        data: counts,
        type: "line",
        smooth: true,
        lineStyle: { width: 3 },
        areaStyle: {
          opacity: 0.25,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#67c23a" },
            { offset: 1, color: "#95d475" },
          ]),
        },
        itemStyle: { color: "#67c23a" },
      },
    ],
  };

  chart.clear();
  chart.setOption(options);
};

onMounted(() => {
  chart = echarts.init(chartRef.value);
  render();

  resizeObserver = new ResizeObserver(() => {
    chart?.resize();
  });
  resizeObserver.observe(chartRef.value);
});

watch(
  () => props.data,
  () => {
    render();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
  if (chart) chart.dispose();
});
</script>

<template>
  <div class="chart" ref="chartRef"></div>
</template>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
