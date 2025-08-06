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
  <div class="flex flex-col lg:flex-row gap-8 items-start h-full w-full">
    <div class="w-full mx-auto max-w-sm px-4 lg:px-0 lg:w-80">
      <EasyForm @submit="calculateGrowth" />
    </div>

    <div class="flex flex-1 flex-col md:flex-row-reverse w-full gap-4">
      <ul
        class="flex flex-row-reverse md:flex-col gap-2 space-y-2 text-sm font-medium text-black md:mb-0"
      >
        <li>
          <a
            href="#"
            class="inline-flex items-center px-4 py-3 rounded-lg w-[124px] shadow-custom"
            :class="[
              activeTab === 'Diagramm'
                ? 'text-primary bg-accent'
                : 'hover:text-gray-900 bg-base-100 hover:bg-base-200 ',
            ]"
            @click.prevent="activeTab = 'Diagramm'"
          >
            <svg class="w-4 h-4 me-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h4v18H3zM10 10h4v11h-4zM17 4h4v17h-4z" />
            </svg>
            Diagramm
          </a>
        </li>
        <li>
          <a
            href="#"
            class="inline-flex items-center px-4 py-3 shadow-custom rounded-lg w-[124px]"
            :class="[
              activeTab === 'Tabelle'
                ? 'text-primary bg-accent'
                : 'hover:text-gray-900 bg-base-100 hover:bg-base-200 ',
            ]"
            @click.prevent="activeTab = 'Tabelle'"
          >
            <svg class="w-4 h-4 me-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h16v2H4zm0 5h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
            Tabelle
          </a>
        </li>
      </ul>

      <div class="flex-1 bg-base-100 rounded-xl shadow-custom">
        <EChart
          v-if="activeTab === 'Diagramm' && chartData.length"
          ref="chartRef"
          :data="chartData"
        />
        <DataTable
          v-if="activeTab === 'Tabelle' && tableData.length"
          :data="tableData"
        />
      </div>
    </div>
  </div>
</template>
