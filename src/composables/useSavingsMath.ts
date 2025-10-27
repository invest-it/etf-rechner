import { computed } from "vue";

export function useSavingsMath(formRef, monthlyRateRef) {
  const jahreszins = computed(() => (Number(formRef.value.returnRate) || 0) / 100);
  const steuer = computed(() => (Number(formRef.value.tax) || 0) / 100);
  const monate = computed(() => (Number(formRef.value.duration) || 0) * 12);
  const istMonatlich = computed(() => {
    const s = String(formRef.value.depositType || "").toLowerCase();
    return s.includes("monat") || s.includes("month");
  });
  const startkapital = computed(() => Number(formRef.value.capital) || 0);
  const rNetto = computed(() => (steuer.value > 0 ? monthlyRateRef.value * (1 - steuer.value) : monthlyRateRef.value));
  const zBetrag = computed(() => Math.ceil(startkapital.value * (Number(rNetto.value) || 0)));

  return { jahreszins, steuer, monate, istMonatlich, startkapital, rNetto, zBetrag };
}
