<script setup>
import * as echarts from "echarts";
const piecharts = ref(null);
let ro;
onMounted(() => {
  const chart = echarts.init(piecharts.value);
  const options = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "-2%",
      left: "center",
    },
    series: [
      {
        // name: 'Access From',
        type: "pie",
        radius: ["40%", "70%"],
        // avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          // position: 'center'
        },
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: 40,
        //     fontWeight: 'bold'
        //   }
        // },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
      },
    ],
  };
  chart.setOption(options);
  const ro = new ResizeObserver(() => {
    chart.resize();
  });
  ro.observe(piecharts.value);
});
onBeforeUnmount(() => {
  if (ro) ro.disconnect();
});
</script>
<template>
  <div class="www" ref="piecharts"></div>
</template>
<style scoped>
.www {
  width: 100%;
  height: 100%;
}
</style>
