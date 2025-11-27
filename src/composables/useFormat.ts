import { computed } from "vue";
import { useI18n } from "vue-i18n";

export function useFormat() {
  const { locale } = useI18n();

  const euro = (n: unknown) =>
    (Number(n) || 0).toLocaleString(locale.value, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    });

  const pct = (x: unknown, digits = 2) => (Number(x) * 100).toLocaleString(locale.value, { maximumFractionDigits: digits }) + "%";

  const localeCode = computed(() => locale.value);

  return { euro, pct, localeCode };
}
