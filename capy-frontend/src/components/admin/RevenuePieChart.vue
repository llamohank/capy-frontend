<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from "echarts";
import { getRevenuePie } from "@/api/admin/dashboard";

const chartRef = ref(null);
const data = ref([]);
const loading = ref(false);

let chart = null;
let resizeObserver = null;

const render = () => {
  if (!chart || !data.value?.length) return;

  const options = {
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        return `${params.name}<br/>營收: NT$${Number(params.value).toLocaleString()} (${params.percent}%)`;
      },
    },
    legend: {
      bottom: "0%",
      left: "center",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "45%"],
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        data: data.value.map((item) => ({
          value: item.value,
          name: item.name,
        })),
      },
    ],
  };

  chart.clear();
  chart.setOption(options);
};

const fetchData = async () => {
  try {
    loading.value = true;
    const result = await getRevenuePie();
    if (result) {
      data.value = result;
      render();
    }
  } catch (error) {
    console.error("Failed to fetch revenue pie:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  chart = echarts.init(chartRef.value);
  fetchData();

  resizeObserver = new ResizeObserver(() => {
    chart?.resize();
  });
  resizeObserver.observe(chartRef.value);
});

watch(data, () => {
  render();
}, { deep: true });

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
  if (chart) chart.dispose();
});
</script>

<template>
  <div class="chart" ref="chartRef" v-loading="loading"></div>
</template>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
