<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  initialDeposit: Number,
  monthlyContribution: Number,
  annualReturnPercent: Number,
  years: Number,
  totalBalance: Number,
  totalContributions: Number,
  totalGain: Number,
});

const euro = (v) =>
  Number.isFinite(v)
    ? v.toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
      })
    : "—";

const percent = (v) => (Number.isFinite(v) ? `${v.toLocaleString("de-DE", { maximumFractionDigits: 2 })} %` : "—");

const yearsLabel = (y) => (Number.isFinite(y) ? y.toLocaleString("de-DE") : "—");

const highlight = (value) => `<span class="bg-accent text-primary px-1 rounded">${value}</span>`;

const summary = computed(() =>
  t("summary", {
    initialDeposit: highlight(euro(props.initialDeposit)),
    monthlyContribution: highlight(euro(props.monthlyContribution)),
    annualReturnPercent: highlight(percent(props.annualReturnPercent)),
    years: highlight(yearsLabel(props.years)),
    totalBalance: highlight(euro(props.totalBalance)),
    totalContributions: highlight(euro(props.totalContributions)),
    totalGain: highlight(euro(props.totalGain)),
  }),
);
</script>
<template>
  <div class="hero bg-base-100 rounded-xl shadow-custom mt-5">
    <div class="max-w-3xl px-6">
      <p class="py-6" v-html="summary"></p>
    </div>
  </div>
</template>
