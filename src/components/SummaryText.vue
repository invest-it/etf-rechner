<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

const props = defineProps({
  initialDeposit: Number,
  monthlyContribution: Number,
  annualReturnPercent: Number,
  years: Number,
  totalBalance: Number,
  totalContributions: Number,
  totalGain: Number,
  taxPercent: Number,
  totalTaxPaid: Number,
  depositType: String,
  dynamicIncrease: Number,
});

const euro = (v) =>
  Number.isFinite(v) ? v.toLocaleString(locale.value, { style: "currency", currency: "EUR", maximumFractionDigits: 2 }) : "—";

const percent = (v) => (Number.isFinite(v) ? `${v.toLocaleString(locale.value, { maximumFractionDigits: 2 })} %` : "—");

const yearsLabel = (y) => (Number.isFinite(y) ? y.toLocaleString(locale.value) : "—");

const highlight = (value) => `<span class="bg-primary text-white px-1 rounded">${value}</span>`;

const normalizeDepositType = (v) => {
  if (!v) return "monthly";
  const s = String(v).toLowerCase();
  if (s.includes("jähr") || s.includes("year")) return "yearly";
  return "monthly";
};

const summaryText = computed(() => {
  const dt = normalizeDepositType(props.depositType);

  const depositSentence = t(`summary.deposit.${dt}`, {
    monthlyContribution: highlight(euro(props.monthlyContribution)),
  });

  const base = t("summary.base", {
    initialDeposit: highlight(euro(props.initialDeposit)),
    depositSentence,
    annualReturnPercent: highlight(percent(props.annualReturnPercent)),
    years: highlight(yearsLabel(props.years)),
    totalBalance: highlight(euro(props.totalBalance)),
    totalContributions: highlight(euro(props.totalContributions)),
    totalGain: highlight(euro(props.totalGain)),
  });

  const withDynamic =
    Number(props.dynamicIncrease) > 0
      ? " " +
        t("summary.dynamicIncrease", {
          dynamicIncrease: highlight(percent(props.dynamicIncrease)),
        })
      : "";

  let taxPart = "";
  if (Number(props.taxPercent) > 0) {
    taxPart =
      " " +
      (Number.isFinite(props.totalTaxPaid)
        ? t("summary.tax.withAmount", {
            taxPercent: highlight(percent(props.taxPercent)),
            totalTaxPaid: highlight(euro(props.totalTaxPaid)),
          })
        : t("summary.tax.withoutAmount", {
            taxPercent: highlight(percent(props.taxPercent)),
          }));
  }

  return base + withDynamic + taxPart;
});
</script>

<template>
  <div class="hero bg-base-100 rounded-xl shadow-custom mt-5 min-h-[172px]">
    <div class="max-w-3xl px-6">
      <p class="py-6" v-html="summaryText"></p>
    </div>
  </div>
</template>
