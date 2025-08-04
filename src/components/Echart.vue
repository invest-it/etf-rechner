<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  data: Array, // Format: [{ year: '1', einzahlung: 5000, zinsen: 300 }]
});

const chartRef = ref(null);
let chartInstance = null;

const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

defineExpose({ resizeChart });

const drawChart = () => {
  if (!chartRef.value || !props.data) return;

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value);
  }

  const years = props.data.map((item) => item.year);
  const einzahlungen = props.data.map((item) => item.einzahlung);
  const zinsen = props.data.map((item) => item.zinsen);

  const option = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "#fff",
      borderColor: "#ccc",
      borderWidth: 1,
      textStyle: { color: "#000" },
      formatter: (params) => {
        const year = params[0].axisValue;
        const ein =
          params.find((p) => p.seriesName === "Einzahlungen")?.value || 0;
        const zin = params.find((p) => p.seriesName === "Zinsen")?.value || 0;
        const total = ein + zin;

        return `
          <strong>Jahr ${year}</strong><br/>
          Einzahlungen: ${ein.toLocaleString("de-DE")} €<br/>
          Zinsen: ${zin.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €<br/>
          <strong>Gesamtkapital: ${total.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</strong>
        `;
      },
    },
    legend: {
      data: ["Einzahlungen", "Zinsen"],
      top: 10,
    },
    xAxis: {
      type: "category",
      data: years,
      name: "Jahre",
      nameLocation: "middle",
      nameGap: 30,
      nameTextStyle: {
        fontWeight: "bold",
      },
      axisLine: { lineStyle: { color: "#1e1e1e" } },
    },
    yAxis: {
      type: "value",
      nameLocation: "end",
      nameRotate: 0,
      nameGap: 30,
      nameTextStyle: {
        fontWeight: "bold",
        align: "right",
        padding: [0, 0, 0, 0],
      },
      axisLine: { lineStyle: { color: "#1e1e1e" } },
      splitLine: { lineStyle: { color: "#eee" } },
      axisLabel: {
        formatter: (value) => `${value.toLocaleString("de-DE")} €`,
      },
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "12%",
      top: "20%",
      containLabel: true,
    },
    series: [
      {
        name: "Einzahlungen",
        type: "line",
        stack: "total",
        smooth: true,
        data: einzahlungen,
        symbol: "circle",
        symbolSize: 10,
        areaStyle: {},

        itemStyle: {
          color: "#97bc4e",
          borderColor: "#fff",
          borderWidth: 1,
        },
        lineStyle: {
          color: "#97bc4e",
          width: 3,
          shadowColor: "rgba(170,255,67,0.3)",
          shadowBlur: 6,
        },
        emphasis: {
          focus: "series",
        },
      },
      {
        name: "Zinsen",
        type: "line",
        stack: "total",
        smooth: true,
        data: zinsen,
        areaStyle: {},

        symbol: "circle",
        symbolSize: 10,
        itemStyle: {
          color: "#269e43",
          borderColor: "#fff",
          borderWidth: 1,
        },
        lineStyle: {
          color: "#269e43",
          width: 3,
          shadowColor: "rgba(102, 194, 165, 0.3)",
          shadowBlur: 6,
        },
        emphasis: {
          focus: "series",
        },
      },
    ],
  };

  chartInstance.setOption(option);
  chartInstance.resize();
};

watch(() => props.data, drawChart, { deep: true });

onMounted(() => {
  drawChart();
  window.addEventListener("resize", resizeChart);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
});
</script>

<template>
  <div
    ref="chartRef"
    class="shadow-custom rounded-2xl p-5 bg-white"
    style="width: 100%; height: 500px"
  ></div>
</template>
