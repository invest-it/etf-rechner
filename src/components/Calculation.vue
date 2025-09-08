<script setup>
import { toRefs, computed } from "vue";
import { useI18n } from "vue-i18n";
import katex from "katex";
import "katex/dist/katex.min.css";

const { t, locale } = useI18n();

const props = defineProps({
  form: { type: Object, required: true },
  summary: { type: Object, required: true },
  monthlyRate: { type: Number, required: true },
});
const { form, summary, monthlyRate } = toRefs(props);

const euro = (n) => (Number(n) || 0).toLocaleString(locale.value, { style: "currency", currency: "EUR", maximumFractionDigits: 2 });

const pct = (x, d = 2) => (Number(x) * 100).toLocaleString(locale.value, { maximumFractionDigits: d }) + "%";

const num = (x, d = 6) => (Number(x) || 0).toLocaleString(locale.value, { maximumFractionDigits: d });

const tex = (s) => katex.renderToString(s, { throwOnError: false, output: "html" });

const jahreszins = computed(() => (Number(form.value.returnRate) || 0) / 100);
const steuer = computed(() => (Number(form.value.tax) || 0) / 100);
const dynamik = computed(() => (Number(form.value.dynamicIncrease) || 0) / 100);
const monate = computed(() => (Number(form.value.duration) || 0) * 12);
const jahre = computed(() => Number(form.value.duration) || 0);

const istMonatlich = computed(() => {
  const s = String(form.value.depositType || "").toLowerCase();
  return s.includes("monat") || s.includes("month");
});

const startkapital = computed(() => Number(form.value.capital) || 0);
const einzahlungStart = computed(() => Number(form.value.monthly) || 0);

const r = monthlyRate;
const rNetto = computed(() => (steuer.value > 0 ? r.value * (1 - steuer.value) : r.value));

const exampleYears = computed(() => Array.from({ length: Math.min(jahre.value, 3) }, (_, i) => i + 1));
const depositForYear = (y) => einzahlungStart.value * Math.pow(1 + dynamik.value, y - 1);

const fMonatszinsEinfach = computed(() =>
  tex(String.raw`\text{${t("calc.monthlyRateSimple")}} \approx \frac{\text{${t("calc.annualRate")}}}{12}`),
);

const fMonatszinsEinfachNumbers = computed(() =>
  tex(String.raw`\text{${t("calc.monthlyRateSimple")}} \approx \frac{${(jahreszins.value * 100).toLocaleString(locale.value, { maximumFractionDigits: 2 })}\%}{12}
  = ${((jahreszins.value * 100) / 12).toLocaleString(locale.value, { maximumFractionDigits: 2 })}\%`),
);

const fZinsGewinn = computed(() => {
  return steuer.value > 0
    ? tex(
        String.raw`\text{${t("calc.interestGain")}} = \text{${t("calc.balance")}} \times \text{${t("calc.monthlyRate")}} \times (1-\tfrac{\text{${t("labels.taxShort")}}}{100})`,
      )
    : tex(String.raw`\text{${t("calc.interestGain")}} = \text{${t("calc.balance")}} \times \text{${t("calc.monthlyRate")}}`);
});

const fMonatsschritt = computed(() =>
  tex(
    String.raw`\text{${t("calc.newBalance")}} = \text{${t("calc.oldBalance")}} + \text{${t("calc.interestGain")}} + \text{${t("calc.contribution")}}`,
  ),
);

const fDynamik = computed(() =>
  tex(
    String.raw`\text{${t("calc.nextYearContribution")}} = \text{${t("calc.currentContribution")}} \times (1+\tfrac{\text{${t("labels.dynamicShort")}}}{100})`,
  ),
);

const contributionLabel = computed(() => (istMonatlich.value ? t("ui.contributionPerMonth") : t("ui.contributionPerYear")));
</script>

<template>
  <div class="card bg-base-100 shadow-custom h-full">
    <div class="mx-auto w-full max-w-5xl">
      <div class="card-body space-y-6">
        <h2 class="card-title text-2xl">{{ $t("ui.title") }}</h2>

        <section class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div class="stat bg-base-200 rounded-box shadow-sm">
            <div class="stat-title">{{ $t("labels.startCapital") }}</div>
            <div class="stat-value text-base">{{ euro(form.capital) }}</div>
          </div>

          <div class="stat bg-base-200 px-0 sm:px-6 rounded-box shadow-sm">
            <div class="stat-title px-3 sm:px-0">{{ contributionLabel }}</div>
            <div class="stat-value text-base px-6 sm:px-0">{{ euro(form.monthly) }}</div>
          </div>

          <div class="stat bg-base-200 rounded-box shadow-sm">
            <div class="stat-title">{{ $t("labels.annualRate") }}</div>
            <div class="stat-value text-base">{{ form.returnRate.toLocaleString(locale) }}%</div>
          </div>

          <div class="stat bg-base-200 rounded-box shadow-sm">
            <div class="stat-title">{{ $t("labels.duration") }}</div>
            <div class="stat-value text-base">{{ form.duration }} {{ $t("ui.years") }} ({{ monate }})</div>
          </div>

          <div class="stat bg-base-200 rounded-box shadow-sm">
            <div class="stat-title">{{ $t("labels.tax") }}</div>
            <div class="stat-value text-base">{{ form.tax.toLocaleString(locale) }}%</div>
          </div>

          <div class="stat bg-base-200 rounded-box shadow-sm">
            <div class="stat-title">{{ $t("labels.dynamicPerYear") }}</div>
            <div class="stat-value text-base">{{ form.dynamicIncrease.toLocaleString(locale) }}%</div>
          </div>
        </section>

        <section class="bg-accent p-4 rounded-box shadow-sm">
          <p class="opacity-80">
            {{ $t("ui.methodIntro") }}
          </p>
        </section>

        <section class="bg-base-200 p-4 rounded-box shadow-sm flex flex-col">
          <h3 class="text-lg font-semibold">1) {{ $t("ui.monthlyRate") }}</h3>
          <p>{{ $t("ui.monthlyRateDesc") }}</p>
          <span class="badge badge-accent text-black h-full mt-4 p-2">
            <div v-html="fMonatszinsEinfach" />
          </span>
          <span class="badge badge-accent text-black h-full mt-4 p-2">
            <div v-html="fMonatszinsEinfachNumbers" />
          </span>
        </section>

        <section class="bg-base-200 p-4 rounded-box shadow-sm">
          <h3 class="text-lg font-semibold">2) {{ $t("ui.interestGain") }}</h3>
          <p>{{ $t("ui.interestGainDesc") }}</p>
          <span class="badge badge-accent text-black h-full my-2 p-2">
            <div v-html="fZinsGewinn" />
          </span>
          <p class="mt-2 space-y-1">
            {{ $t("ui.examplePrefix") }}
            <span class="badge badge-primary">{{ euro(form.capital) }}</span>
            {{ $t("ui.exampleMiddle") }}
            <strong>
              <span class="badge badge-primary">{{ pct(steuer > 0 ? r * (1 - steuer) : r) }}</span>
            </strong>
            {{ $t("ui.exampleSuffix") }}
          </p>
        </section>

        <section class="bg-base-200 p-4 rounded-box shadow-sm">
          <h3 class="text-lg font-semibold">3) {{ $t("ui.monthStep") }}</h3>
          <p>
            {{ $t("ui.monthStepDesc") }}
          </p>
          <span class="badge badge-accent text-black h-full my-2 p-2">
            <div v-html="fMonatsschritt" />
          </span>
        </section>

        <section v-if="form.dynamicIncrease > 0" class="bg-base-200 p-4 rounded-box shadow-sm">
          <h3 class="text-lg font-semibold">4) {{ $t("ui.dynamic") }}</h3>
          <p>{{ $t("ui.dynamicDesc") }}</p>
          <span class="badge badge-accent text-black h-full my-2 p-2">
            <div v-html="fDynamik" />
          </span>
          <ul class="list-disc ml-6 mt-3 text-sm opacity-80">
            <li v-for="y in exampleYears" :key="y">
              {{ $t("ui.year") }} {{ y }}: {{ istMonatlich ? $t("ui.contributionPerMonth") : $t("ui.contributionPerYear") }} ≈
              <strong>{{ euro(depositForYear(y)) }}</strong>
            </li>
          </ul>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-2">{{ $t("ui.result") }}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="stat bg-base-200 rounded-box shadow-sm">
              <div class="stat-title">{{ $t("ui.totalContributions") }}</div>
              <div class="stat-value text-lg">{{ euro(summary.totalContributions) }}</div>
            </div>
            <div class="stat bg-base-200 rounded-box shadow-sm">
              <div class="stat-title">{{ $t("ui.interestGainShort") }}</div>
              <div class="stat-value text-lg">{{ euro(summary.totalGain) }}</div>
            </div>
            <div class="stat bg-base-200 rounded-box shadow-sm">
              <div class="stat-title">{{ $t("ui.totalBalance") }}</div>
              <div class="stat-value text-lg">{{ euro(summary.totalBalance) }}</div>
            </div>
          </div>
          <p class="text-xs opacity-70 mt-2">{{ $t("ui.roundingNote") }}</p>
        </section>
      </div>
    </div>
  </div>
</template>
