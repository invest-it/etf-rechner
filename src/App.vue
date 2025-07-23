<template>
  <div class="p-4 max-w-4xl mx-auto">
    <div class="card bg-white shadow-[2px_5px_20px_-5px_#0003] p-6 rounded-2xl">
      <div class="flex justify-between items-center mb-6">
        <span
          class="text-lg font-semibold text-[#96BC4D] bg-[#96BC4D]/20 px-3 py-1 rounded-md"
          >ETF-rechner</span
        >
        <label class="cursor-pointer flex items-center gap-2">
          <span class="label-text font-medium text-[#96BC4D]">Easy</span>
          <input
            type="checkbox"
            checked="checked"
            class="toggle checked:text-white checked:bg-[#96BC4D]"
          />
        </label>
      </div>

      <form class="flex flex-col gap-6" @submit.prevent="calculateETF">
        <fieldset class="form-control m-auto w-1/2">
          <legend class="label label-text font-medium mb-1">
            Startkapital(€)
          </legend>
          <input
            v-model.number="form.startkapital"
            type="number"
            placeholder="Value"
            class="input input-bordered"
          />
        </fieldset>
        <fieldset class="form-control m-auto w-1/2">
          <legend class="label label-text font-medium mb-1">
            Monatliche Einzahlung(€)
          </legend>
          <input
            v-model.number="form.einzahlung"
            type="number"
            placeholder="Value"
            class="input input-bordered"
          />
        </fieldset>
        <fieldset class="form-control m-auto w-1/2">
          <legend class="label label-text font-medium mb-1">
            Erwartete jährliche Rendite (%)
          </legend>
          <input
            v-model.number="form.rendite"
            type="number"
            placeholder="Value"
            class="input input-bordered"
          />
        </fieldset>
        <fieldset class="form-control m-auto w-1/2">
          <legend class="label label-text font-medium mb-1">
            Laufzeit (Jahre)
          </legend>
          <input
            v-model.number="form.laufzeit"
            type="number"
            placeholder="Value"
            class="input input-bordered"
          />
        </fieldset>
        <button
          type="submit"
          class="btn mt-4"
          style="background-color: #96bc4d; border-color: #96bc4d; color: white"
        >
          Berechnen
        </button>
      </form>
    </div>

    <div v-if="chartData.length" class="mt-8">
      <v-chart :option="chartOptions" style="height: 400px" class="w-full" />
      <table class="table table-zebra w-full mt-4">
        <thead>
          <tr>
            <th>Jahr</th>
            <th>Eingezahlt (€)</th>
            <th>Gesamtbetrag (€)</th>
            <th>Rendite (€)</th>
            <th>Rendite seit Beginn (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in chartData" :key="index">
            <td>{{ row.jahr }}</td>
            <td>{{ row.eingezahlt.toFixed(2) }}</td>
            <td>{{ row.gesamt.toFixed(2) }}</td>
            <td>{{ row.rendite.toFixed(2) }}</td>
            <td>{{ row.renditeProzent.toFixed(2) }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import VChart from "vue-echarts";
import * as echarts from "echarts/core";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
]);

const form = ref({
  startkapital: 5000,
  einzahlung: 200,
  rendite: 5,
  laufzeit: 20,
});

const chartData = ref([]);
const chartOptions = ref({});

function calculateETF() {
  const data = [];
  let kapital = form.value.startkapital;
  let eingezahlt = 0;
  const rate = form.value.rendite / 100;

  for (let jahr = 1; jahr <= form.value.laufzeit; jahr++) {
    eingezahlt += form.value.einzahlung * 12;
    kapital = (kapital + form.value.einzahlung * 12) * (1 + rate);
    const rendite = kapital - eingezahlt - form.value.startkapital;
    const renditeProzent =
      ((kapital - form.value.startkapital) / form.value.startkapital) * 100;

    data.push({
      jahr,
      eingezahlt,
      gesamt: kapital,
      rendite,
      renditeProzent,
    });
  }

  chartData.value = data;
  chartOptions.value = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Eingezahlt", "Gesamt"],
    },
    xAxis: {
      type: "category",
      data: data.map((d) => `Jahr ${d.jahr}`),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Eingezahlt",
        type: "line",
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#259e43" },
              { offset: 1, color: "#259e43" },
            ],
          },
        },
        lineStyle: {
          color: "#259e43",
        },
        itemStyle: {
          color: "#259e43",
        },
        data: data.map((d) => d.eingezahlt),
      },
      {
        name: "Gesamt",
        type: "line",
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#96BC4D" },
              { offset: 1, color: "#96BC4D" },
            ],
          },
        },
        lineStyle: {
          color: "#333",
        },
        itemStyle: {
          color: "#333",
        },
        data: data.map((d) => parseFloat(d.gesamt.toFixed(2))),
      },
    ],
  };
}
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
</style>
