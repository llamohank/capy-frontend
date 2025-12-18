<script setup>
import * as echarts from "echarts";
const linecharts = ref(null);
let ro;
const props = defineProps({
  data: {
    required: true,
    type: Array,
  },
});
const xAxisLabel = computed(() => props.data.map((item) => item.monthLabel));
const xAxisAmount = computed(() => props.data.map((item) => item.amount));
onMounted(() => {
  const chart = echarts.init(linecharts.value);
  const options = {
    xAxis: {
      type: "category",
      data: xAxisLabel.value,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: xAxisAmount.value,
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
