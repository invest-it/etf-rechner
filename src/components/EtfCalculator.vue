<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import EasyForm from "./EasyForm.vue";
import EChart from "./EChart.vue";
import DataTable from "./DataTable.vue";
import SummaryText from "./SummaryText.vue";
import Dropdown from "./Dropdown.vue";

const chartData = ref([]);
const tableData = ref([]);
const activeTab = ref("Diagramm");
const chartRef = ref(null);
const tableRef = ref(null);

const defaultForm = {
  capital: 2000,
  monthly: 150,
  returnRate: 3,
  duration: 10,
};

const summaryData = ref({
  initialDeposit: defaultForm.capital,
  monthlyContribution: defaultForm.monthly,
  annualReturnPercent: defaultForm.returnRate,
  years: defaultForm.duration,
  totalBalance: 0,
  totalContributions: 0,
  totalGain: 0,
});

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
      const roundedZinsen = parseFloat((roundedTotal - roundedEinzahlung).toFixed(2));

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
    einzahlung: einzahlung.toLocaleString("de-DE", { minimumFractionDigits: 2 }),
    zinsen: zinsen.toLocaleString("de-DE", { minimumFractionDigits: 2 }),
    kontostand: kontostand.toLocaleString("de-DE", { minimumFractionDigits: 2 }),
  }));

  const last = result[result.length - 1];
  if (last) {
    summaryData.value = {
      initialDeposit: capital,
      monthlyContribution: monthly,
      annualReturnPercent: returnRate,
      years: duration,
      totalBalance: last.kontostand,
      totalContributions: last.einzahlung,
      totalGain: last.zinsen,
    };
  }
}
onMounted(() => {
  calculateGrowth(defaultForm);
});

watch(activeTab, async (newTab) => {
  if (newTab === "Diagramm") {
    await nextTick();
    chartRef.value?.resizeChart();
  } else if (newTab === "Tabelle") {
    await nextTick();
    tableRef.value?.updateCanScroll?.();
  }
});
</script>

<template>
  <div class="flex flex-col xl:flex-row gap-x-8 gap-y-4 items-start h-full w-full">
    <div class="w-full mx-auto max-w-sm px-4 xl:px-0 xl:w-80">
      <EasyForm @submit="calculateGrowth" />
    </div>

    <div class="flex flex-1 flex-col md:flex-row-reverse w-full gap-4">
      <ul class="flex flex-row md:flex-col gap-2 mt-10 md:mt-0 text-sm font-medium text-black md:mb-0">
        <li class="flex-1/2 md:flex-0">
          <a
            href="#"
            class="inline-flex justify-center md:justify-start items-center px-4 py-3 rounded-lg shadow-custom w-full md:w-[124px]"
            :class="[activeTab === 'Diagramm' ? 'text-primary bg-accent' : 'hover:text-gray-900 bg-base-100 hover:bg-base-200']"
            @click.prevent="activeTab = 'Diagramm'">
            <svg class="w-4 h-4 me-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h4v18H3zM10 10h4v11h-4zM17 4h4v17h-4z" />
            </svg>
            {{ $t("chart") }}
          </a>
        </li>
        <li class="flex-1/2 md:flex-0">
          <a
            href="#"
            class="inline-flex justify-center md:justify-start items-center px-4 py-3 rounded-lg shadow-custom w-full md:w-[124px]"
            :class="[activeTab === 'Tabelle' ? 'text-primary bg-accent' : 'hover:text-gray-900 bg-base-100 hover:bg-base-200']"
            @click.prevent="activeTab = 'Tabelle'">
            <svg class="w-4 h-4 me-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h16v2H4zm0 5h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
            {{ $t("table") }}
          </a>
        </li>
      </ul>
      <div class="flex-1 bg-base-100 rounded-xl xl:min-h-[700px]">
        <EChart v-if="activeTab === 'Diagramm' && chartData.length" ref="chartRef" :data="chartData" />
        <SummaryText
          v-if="activeTab === 'Diagramm' && chartData.length"
          class="mt-4"
          :initial-deposit="summaryData.initialDeposit"
          :monthly-contribution="summaryData.monthlyContribution"
          :annual-return-percent="summaryData.annualReturnPercent"
          :years="summaryData.years"
          :total-balance="summaryData.totalBalance"
          :total-contributions="summaryData.totalContributions"
          :total-gain="summaryData.totalGain" />

        <DataTable v-if="activeTab === 'Tabelle' && tableData.length" ref="tableRef" :data="tableData" />
      </div>
    </div>
    <div class="sm:hidden w-full flex justify-between h-9">
      <Dropdown v-show="activeTab === 'Tabelle'" position="dropdown-top dropdown-start" />
      <button
        v-show="activeTab === 'Tabelle' && tableRef?.canScroll && !tableRef?.scrolledLeft"
        type="button"
        class="px-3 py-1.5 text-sm rounded-full shadow bg-primary text-primary-content"
        @click="tableRef?.scrollRight()">
        {{ $t("swap") }} →
      </button>
    </div>
  </div>
</template>
