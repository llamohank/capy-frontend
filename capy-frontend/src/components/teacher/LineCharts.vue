<script setup>
import * as echarts from "echarts";
const linecharts = ref(null);
let ro;
onMounted(() => {
  const chart = echarts.init(linecharts.value);
  const options = {
    xAxis: {
      type: "category",
      data: ["第一週", "第二週", "第三週", "第四週"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: "line",
        smooth: true,
      },
    ],
  };
  chart.setOption(options);
  const ro = new ResizeObserver(() => {
    chart.resize();
  });
  ro.observe(linecharts.value);
});
onBeforeUnmount(() => {
  if (ro) ro.disconnect();
});
</script>
<template>
  <div class="chart" ref="linecharts"></div>
</template>
<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
