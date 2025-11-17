<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import EasyForm from "./EasyForm.vue";
import EChart from "./Echart.vue";
import DataTable from "./DataTable.vue";
import SummaryText from "./SummaryText.vue";
import Dropdown from "./Dropdown.vue";
import Calculation from "./Calculation.vue";

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
  dynamicIncrease: 0,
  depositType: "monatlich",
  tax: 0,
};

const inputValues = ref({ ...defaultForm });
const monthlyRateValue = ref(0);
const summaryData = ref({
  initialDeposit: defaultForm.capital,
  monthlyContribution: defaultForm.monthly,
  annualReturnPercent: defaultForm.returnRate,
  years: defaultForm.duration,
  totalBalance: 0,
  totalContributions: 0,
  totalGain: 0,
  depositType: defaultForm.depositType,
});

function calculateGrowth({ capital, monthly, returnRate, duration, depositType, dynamicIncrease, tax }) {
  inputValues.value = { capital, monthly, returnRate, duration, depositType, dynamicIncrease, tax };

  const monthlyRate = Math.pow(1 + returnRate / 100, 1 / 12) - 1;
  monthlyRateValue.value = monthlyRate;
  const months = duration * 12;

  let total = capital;
  let totalEinzahlung = capital;
  let yearTax = 0;
  const result = [];
  let totalTax = 0;

  for (let month = 1; month <= months; month++) {
    if (tax) {
      const interest = total * monthlyRate;
      const taxAmount = interest * (tax / 100);
      total += interest - taxAmount;
      yearTax += taxAmount;
      totalTax += taxAmount; // accumulate tax
    } else {
      total *= 1 + monthlyRate;
    }

    if (depositType === "monatlich") {
      total += monthly;
      totalEinzahlung += monthly;
    } else if (depositType === "jährlich") {
      if (month % 12 === 0) {
        total += monthly;
        totalEinzahlung += monthly;
      }
    }

    if (month % 12 === 0) {
      const year = month / 12;

      const roundedTotal = parseFloat(total.toFixed(2));
      const roundedEinzahlung = parseFloat(totalEinzahlung.toFixed(2));
      const roundedZinsen = parseFloat((roundedTotal - roundedEinzahlung).toFixed(2));

      result.push({
        year,
        einzahlung: roundedEinzahlung,
        zinsen: roundedZinsen,
        kontostand: roundedTotal,
      });

      if (dynamicIncrease && month % 12 === 0) {
        monthly *= 1 + dynamicIncrease / 100;
      }
    }
  }

  chartData.value = result.map(({ year, einzahlung, zinsen }) => ({ year, einzahlung, zinsen }));
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
      monthlyContribution: inputValues.value.monthly,
      annualReturnPercent: returnRate,
      years: duration,
      totalBalance: last.kontostand,
      totalContributions: last.einzahlung,
      totalGain: last.zinsen,
      depositType,
      taxPercent: tax,
      totalTaxPaid: parseFloat(totalTax.toFixed(2)),
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
      <ul class="grid grid-cols-2 gap-2 mt-10 md:mt-0 text-sm font-medium text-black md:mb-0 md:flex md:flex-col">
        <li class="col-span-1">
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

        <li class="col-span-1">
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

        <li class="col-span-1">
          <a
            href="#"
            class="inline-flex justify-center md:justify-start items-center px-4 py-3 rounded-lg shadow-custom w-full md:w-[124px]"
            :class="[activeTab === 'Rechenweg' ? 'text-primary bg-accent' : 'hover:text-gray-900 bg-base-100 hover:bg-base-200']"
            @click.prevent="activeTab = 'Rechenweg'">
            <svg class="w-4 h-4 me-2" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M6 2C4.9 2 4 2.9 4 4v16c0
          1.1.9 2 2 2h12c1.1 0 2-.9
          2-2V4c0-1.1-.9-2-2-2H6zm0
          2h12v4H6V4zm0 6h12v10H6V10zm2
          2v2h2v-2H8zm4 0v2h2v-2h-2zm4
          0v2h2v-2h-2zM8 16v2h2v-2H8zm4
          0v2h2v-2h-2z" />
            </svg>
            {{ $t("calculationMethod") }}
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
          :total-gain="summaryData.totalGain"
          :tax-percent="summaryData.taxPercent"
          :total-tax-paid="summaryData.totalTaxPaid"
          :deposit-type="summaryData.depositType"
          :dynamic-increase="inputValues.dynamicIncrease" />

        <DataTable v-if="activeTab === 'Tabelle' && tableData.length" ref="tableRef" :data="tableData" />
        <Calculation
          v-if="activeTab === 'Rechenweg'"
          :form="inputValues"
          :summary="{
            totalBalance: summaryData.totalBalance,
            totalContributions: summaryData.totalContributions,
            totalGain: summaryData.totalGain,
          }"
          :monthly-rate="monthlyRateValue" />
      </div>
    </div>
    <div class="sm:hidden w-full flex justify-between h-9">
      <Dropdown v-show="activeTab === 'Tabelle'" position="dropdown-top dropdown-start" />
      <button
        v-show="activeTab === 'Tabelle' && tableRef?.canScroll && !tableRef?.scrolledLeft"
        type="button"
        class="px-3 py-1.5 text-sm rounded-full shadow bg-primary text-white"
        @click="tableRef?.scrollRight()">
        {{ $t("swap") }} →
      </button>
    </div>
  </div>
</template>
