<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import EasyForm from "./EasyForm.vue";
import EChart from "./EChart.vue";
import DataTable from "./DataTable.vue";

const chartData = ref([]);
const tableData = ref([]);
const activeTab = ref("Diagramm");
const chartRef = ref(null);

const defaultForm = {
  capital: 5000,
  monthly: 200,
  returnRate: 2,
  duration: 10,
};

function calculateGrowth({ capital, monthly, returnRate, duration }) {
  const monthlyRate = returnRate / 100 / 12;
  const months = duration * 12;

  let total = capital;
  let totalEinzahlung = capital;
  const result = [];

  for (let month = 1; month <= months; month++) {
    total *= 1 + monthlyRate;
    total += monthly;
    totalEinzahlung += monthly;

    if (month % 12 === 0) {
      const year = month / 12;

      const roundedTotal = parseFloat(total.toFixed(2));
      const roundedEinzahlung = parseFloat(totalEinzahlung.toFixed(2));
      const roundedZinsen = parseFloat((roundedTotal - roundedEinzahlung).toFixed(2),);

      result.push({
        year: `${year}`,
        einzahlung: roundedEinzahlung,
        zinsen: roundedZinsen,
        kontostand: roundedTotal,
      });

      console.log(`Year ${year}:`, {
        total: roundedTotal,
        totalEinzahlung: roundedEinzahlung,
        zinsen: roundedZinsen,
      });
    }
  }

  chartData.value = result.map(({ year, einzahlung, zinsen }) => ({
    year,
    einzahlung,
    zinsen,
  }));

  tableData.value = result.map(({ year, einzahlung, zinsen, kontostand }) => ({
    year,
    einzahlung: einzahlung.toLocaleString("de-DE", {minimumFractionDigits: 2,}),
    zinsen: zinsen.toLocaleString("de-DE", { minimumFractionDigits: 2 }),
    kontostand: kontostand.toLocaleString("de-DE", {minimumFractionDigits: 2,}),
  }));
}

onMounted(() => {
  calculateGrowth(defaultForm);
});

watch(activeTab, async (newTab) => {
  if (newTab === "Diagramm") {
    await nextTick();
    chartRef.value?.resizeChart();
  }
});
</script>

<template>
  <div
    class="flex flex-col lg:flex-row gap-6 items-center lg:items-start h-full"
  >
    <div class="w-full max-w-sm px-4 lg:px-0 lg:w-80">
      <EasyForm @submit="calculateGrowth" />
    </div>
    <div class="flex-1 min-w-[300px] w-full">
      <div class="tabs tabs-lift">
        <input
          type="radio"
          name="display_tab"
          class="tab"
          style="--tab-border-color: #96c73736"
          aria-label="Diagramm"
          :checked="activeTab === 'Diagramm'"
          @change="activeTab = 'Diagramm'"
        />
        <div class="tab-content bg-base-100 border-accent py-4 shadow-custom">
          <EChart v-if="chartData.length" ref="chartRef" :data="chartData" />
        </div>
        <input
          type="radio"
          name="display_tab"
          class="tab"
          style="--tab-border-color: #96c73736"
          aria-label="Tabelle"
          :checked="activeTab === 'Tabelle'"
          @change="activeTab = 'Tabelle'"
        />
        <div class="tab-content bg-base-100 border-accent shadow-custom">
          <DataTable v-if="tableData.length" :data="tableData" />
        </div>
      </div>
    </div>
  </div>
</template>
