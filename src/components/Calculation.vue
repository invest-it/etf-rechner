<script setup lang="ts">
import { toRefs, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useFormat } from "../composables/useFormat";
import { useSavingsMath } from "../composables/useSavingsMath";

import StatBox from "./StatBox.vue";
import StepCard from "./StepCard.vue";
import Formula from "./Formula.vue";

const { t } = useI18n();

const props = defineProps<{
  form: Record<string, any>;
  summary: Record<string, any>;
  monthlyRate: number;
}>();
const { form, summary, monthlyRate } = toRefs(props);

const { euro, pct, localeCode } = useFormat();
const { jahreszins, monate, istMonatlich, startkapital, rNetto, zBetrag } = useSavingsMath(form, monthlyRate);

const contributionLabel = computed(() => (istMonatlich.value ? t("ui.contributionPerMonth") : t("ui.contributionPerYear")));

const fMonatszinsEinfach = computed(
  () => String.raw`\text{${t("calc.monthlyRateSimple")}} \approx \frac{\text{${t("calc.annualRate")}}}{12}`,
);

const fMonatszinsEinfachNumbers = computed(() => {
  const a = (jahreszins.value * 100).toLocaleString(localeCode.value, { maximumFractionDigits: 2 });
  const m = ((jahreszins.value * 100) / 12).toLocaleString(localeCode.value, { maximumFractionDigits: 2 });
  return String.raw`\text{${t("calc.monthlyRateSimple")}} \approx \frac{${a}\%}{12} = ${m}\%`;
});

const fZinsGewinn = computed(
  () => String.raw`\text{${t("calc.interestGain")}} = \text{${t("calc.balance")}} \times \text{${t("calc.monthlyRate")}}`,
);

const fMonatsschritt = computed(
  () => String.raw`\text{${t("calc.newBalance")}} = \text{${t("calc.oldBalance")}} + \text{${t("calc.interestGain")}}`,
);

const fZKPValues = computed(() => String.raw`Z = ${euro(form.value.capital)} \times ${pct(rNetto.value)}`);

const fKneuValues = computed(() => String.raw`\text{${t("calc.kNew")}} = ${euro(startkapital.value)} + ${euro(zBetrag.value)}`);
</script>

<template>
  <div class="card shadow-custom h-full">
    <div class="mx-auto w-full max-w-5xl">
      <div class="card-body space-y-6">
        <h2 class="card-title text-2xl">{{ $t("ui.title") }}</h2>

        <section class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <StatBox :title="$t('labels.startCapital')" :value="euro(form.capital)" />
          <StatBox :title="contributionLabel" :value="euro(form.monthly)" />
          <StatBox :title="$t('labels.annualRate')" :value="form.returnRate.toLocaleString(localeCode) + '%'" />
          <StatBox :title="$t('labels.duration')" :value="`${form.duration} ${$t('ui.years')} (${monate})`" />
          <StatBox :title="$t('labels.tax')" :value="form.tax.toLocaleString(localeCode) + '%'" />
          <StatBox :title="$t('labels.dynamicPerYear')" :value="form.dynamicIncrease.toLocaleString(localeCode) + '%'" />
        </section>

        <section class="bg-primary p-4 rounded-box shadow-sm">
          <p class="font-bold text-white text-xl text-center">{{ $t("ui.methodIntro") }}</p>
        </section>

        <StepCard :step="1" :title="$t('ui.monthlyRate')" :desc="$t('ui.monthlyRateDesc')">
          <Formula :tex="fMonatszinsEinfach" />
          <p class="p-1">{{ $t("ui.approxValueNote") }}</p>
          <p class="p-1">{{ $t("ui.inputsSummaryIntro") }}</p>
          <Formula :tex="fMonatszinsEinfachNumbers" />
        </StepCard>

        <StepCard :step="2" :title="$t('ui.interestGain')" :desc="$t('ui.interestGainDesc')">
          <Formula :tex="fZinsGewinn" />
          <p class="p-1">{{ $t("ui.inputsSummaryIntro") }}</p>
          <Formula :tex="fZKPValues" />
        </StepCard>

        <StepCard :step="3" :title="$t('ui.monthStep')" :desc="$t('ui.monthStepDesc')">
          <Formula :tex="fMonatsschritt" />
          <p class="p-1">{{ $t("ui.inputsSummaryIntro") }}</p>
          <Formula :tex="fKneuValues" />
        </StepCard>

        <StepCard :step="4" :title="$t('ui.dynamic')" :desc="$t('ui.dynamicDesc')" />

        <section>
          <h3 class="text-xl font-semibold mb-2">{{ $t("ui.result") }}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatBox variant="primary" :title="$t('ui.totalContributions')" :value="euro(summary.totalContributions)" />
            <StatBox variant="primary" :title="$t('ui.interestGainShort')" :value="euro(summary.totalGain)" />
            <StatBox variant="primary" :title="$t('ui.totalBalance')" :value="euro(summary.totalBalance)" />
          </div>
          <p class="text-xs opacity-70 mt-2">{{ $t("ui.roundingNote") }}</p>
        </section>
      </div>
    </div>
  </div>
</template>
