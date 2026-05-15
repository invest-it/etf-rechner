<script lang="ts" setup>
import { ref, onMounted, watch, nextTick } from "vue";
import EasyForm from "./EasyForm.vue";
import EChart, { type EChartProps } from "./Echart.vue";
import DataTable, { type TableRow } from "./DataTable.vue";
import SummaryText from "./SummaryText.vue";
import Dropdown from "./Dropdown.vue";
import Calculation from "./Calculation.vue";
import { DepositType } from "../types/deposit-type";
import {
  calculateGrowthFunction,
  type SimParams,
} from "../calculations/growth";

const chartData = ref<EChartProps["data"]>([]);
const tableData = ref<TableRow[]>([]);
const activeTab = ref("Diagramm");
const chartRef = ref<InstanceType<typeof EChart> | null>(null);
const tableRef = ref<InstanceType<typeof DataTable> | null>(null);

const defaultForm: SimParams = {
  capital: 2000,
  monthlyAmount: 150,
  annualRate: 3,
  duration: 10,
  dynamicIncrease: 0,
  depositType: DepositType.Monthly,
  tax: 0,
};

const inputValues = ref({ ...defaultForm });
const monthlyRateValue = ref(0);
const summaryData = ref({
  initialDeposit: defaultForm.capital,
  monthlyContribution: defaultForm.monthlyAmount,
  annualReturnPercent: defaultForm.annualRate,
  years: defaultForm.duration,
  totalBalance: 0,
  totalContributions: 0,
  totalGain: 0,
  taxPercent: 0,
  totalTaxPaid: 0,
  depositType: defaultForm.depositType,
});

function updateCalculation(formData: SimParams) {
  inputValues.value = formData;

  const result = calculateGrowthFunction(formData);

  monthlyRateValue.value = result.monthlyRate;

  chartData.value = result.points.map(({ year, einzahlung, zinsen }) => ({
    year,
    einzahlung,
    zinsen,
  }));
  tableData.value = result.points.map(
    ({ year, einzahlung, zinsen, kontostand }) => ({
      year,
      einzahlung: einzahlung.toLocaleString("de-DE", {
        minimumFractionDigits: 2,
      }),
      zinsen: zinsen.toLocaleString("de-DE", { minimumFractionDigits: 2 }),
      kontostand: kontostand.toLocaleString("de-DE", {
        minimumFractionDigits: 2,
      }),
    }),
  );

  if (result.final) {
    summaryData.value = {
      initialDeposit: formData.capital,
      monthlyContribution: inputValues.value.monthlyAmount,
      annualReturnPercent: formData.annualRate,
      years: formData.duration,
      totalBalance: result.final.kontostand,
      totalContributions: result.final.einzahlung,
      totalGain: result.final.zinsen,
      depositType: formData.depositType,
      taxPercent: formData.tax,
      totalTaxPaid: parseFloat(result.totalTax.toFixed(2)),
    };
  }
}

onMounted(() => {
  updateCalculation(defaultForm);
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
  <div
    class="flex flex-col xl:flex-row gap-x-8 gap-y-4 items-start h-full w-full"
  >
    <div class="w-full mx-auto max-w-sm px-4 xl:px-0 xl:w-80">
      <EasyForm @submit="updateCalculation" />
    </div>

    <div class="flex flex-1 flex-col md:flex-row-reverse w-full gap-4">
      <ul
        class="grid grid-cols-2 gap-2 mt-10 md:mt-0 text-sm font-medium text-black md:mb-0 md:flex md:flex-col"
      >
        <li class="col-span-1">
          <a
            href="#"
            class="inline-flex justify-center md:justify-start items-center px-4 py-3 rounded-lg shadow-custom w-full md:w-[124px]"
            :class="[
              activeTab === 'Diagramm'
                ? 'text-white bg-primary'
                : 'hover:text-gray-900 bg-base-100 hover:bg-base-200',
            ]"
            @click.prevent="activeTab = 'Diagramm'"
          >
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
            :class="[
              activeTab === 'Tabelle'
                ? 'text-white bg-primary'
                : 'hover:text-gray-900 bg-base-100 hover:bg-base-200',
            ]"
            @click.prevent="activeTab = 'Tabelle'"
          >
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
            :class="[
              activeTab === 'Rechenweg'
                ? 'text-white bg-primary'
                : 'hover:text-gray-900 bg-base-100 hover:bg-base-200',
            ]"
            @click.prevent="activeTab = 'Rechenweg'"
          >
            <svg class="w-4 h-4 me-2" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M6 2C4.9 2 4 2.9 4 4v16c0
          1.1.9 2 2 2h12c1.1 0 2-.9
          2-2V4c0-1.1-.9-2-2-2H6zm0
          2h12v4H6V4zm0 6h12v10H6V10zm2
          2v2h2v-2H8zm4 0v2h2v-2h-2zm4
          0v2h2v-2h-2zM8 16v2h2v-2H8zm4
          0v2h2v-2h-2z"
              />
            </svg>
            {{ $t("calculationMethod") }}
          </a>
        </li>
      </ul>
      <div class="flex-1 bg-base-100 rounded-xl xl:min-h-[700px]">
        <EChart
          v-if="activeTab === 'Diagramm' && chartData?.length"
          ref="chartRef"
          :data="chartData"
        />
        <SummaryText
          v-if="activeTab === 'Diagramm' && chartData?.length"
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
          :dynamic-increase="inputValues.dynamicIncrease"
        />

        <DataTable
          v-if="activeTab === 'Tabelle' && tableData.length"
          ref="tableRef"
          :data="tableData"
        />
        <Calculation
          v-if="activeTab === 'Rechenweg'"
          :form="inputValues"
          :summary="{
            totalBalance: summaryData.totalBalance,
            totalContributions: summaryData.totalContributions,
            totalGain: summaryData.totalGain,
          }"
          :monthly-rate="monthlyRateValue"
        />
      </div>
    </div>
    <div class="sm:hidden w-full flex justify-between h-9">
      <Dropdown
        v-show="activeTab === 'Tabelle'"
        position="dropdown-top dropdown-start"
      />
      <button
        v-show="
          activeTab === 'Tabelle' &&
          tableRef?.canScroll &&
          !tableRef?.scrolledLeft
        "
        type="button"
        class="px-3 py-1.5 text-sm rounded-full shadow bg-primary text-white"
        @click="tableRef?.scrollRight()"
      >
        {{ $t("swap") }} →
      </button>
    </div>
  </div>
</template>
