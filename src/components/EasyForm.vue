<script setup>
import { ref, computed, watch } from "vue";
import NumberInput from "./NumberInput.vue";
import CustomInput from "./CustomInput.vue";
import DepositInput from "./DepositInput.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emit = defineEmits(["submit"]);

const capital = ref(2000);
const monthly = ref(150);
const returnRate = ref(3);
const duration = ref(10);
const isAdvanced = ref(false);
const dynamicIncrease = ref(0);
const tax = ref(25);
const depositType = ref("monatlich");

const disableTax = ref(false);
const taxIsDisabled = computed(() => !isAdvanced.value || disableTax.value);

const taxEffective = computed(() => (taxIsDisabled.value ? 0 : Number(tax.value)));
const dynamicIncreaseEffective = computed(() => (isAdvanced.value ? Number(dynamicIncrease.value) : 0));

function handleSubmit() {
  emit("submit", {
    capital: Number(capital.value),
    monthly: Number(monthly.value),
    returnRate: Number(returnRate.value),
    duration: Number(duration.value),
    isAdvanced: isAdvanced.value,
    dynamicIncrease: dynamicIncreaseEffective.value,
    tax: taxEffective.value,
    depositType: depositType.value,
  });
}

watch(isAdvanced, () => {
  disableTax.value = false;
});
</script>

<template>
  <div class="shadow-custom rounded-xl py-6 max-w-md">
    <div class="flex justify-between items-center mb-4 mx-4">
      <div class="bg-accent text-primary font-semibold px-3 py-1 rounded-md">
        {{ isAdvanced ? $t("advanced") : $t("easy") }}
      </div>
      <label class="flex items-center cursor-pointer">
        <input v-model="isAdvanced" type="checkbox" class="toggle rounded-lg toggle-primary" />
      </label>
    </div>

    <form @submit.prevent="handleSubmit">
      <fieldset class="fieldset w-full p-6">
        <NumberInput v-model="capital" :label="`${t('input.startCapital')} (€)`" :info="t('info.startCapital')" />
        <DepositInput
          v-model:amount="monthly"
          v-model:deposit-type="depositType"
          :label="`${t('input.contribution')} (€)`"
          :info="t('info.contribution')" />
        <CustomInput v-model="returnRate" :label="`${t('input.expectedAnnualReturn')} (%)`" :info="t('info.expectedAnnualReturn')" />
        <NumberInput v-model="duration" :label="t('input.durationYears')" :info="t('info.durationYears')" />
        <NumberInput v-model="tax" :label="`${t('input.tax')} (%)`" :info="t('info.tax')" :disabled="taxIsDisabled" />
        <div class="mb-2 flex items-center gap-2">
          <input
            id="disableTax"
            v-model="disableTax"
            type="checkbox"
            :disabled="!isAdvanced"
            class="checkbox rounded-xs border-primary checkbox-xs" />
          <label for="disableTax" class="text-xs select-none" :class="{ 'opacity-35': taxIsDisabled }">
            {{ t("input.disableLabel") }}
          </label>
        </div>
        <NumberInput
          v-model="dynamicIncrease"
          :label="`${t('input.dynamicIncrease')} (%)`"
          :info="t('info.dynamicIncrease')"
          :disabled="!isAdvanced" />
        <button type="submit" class="w-full btn btn-primary text-white font-semibold text-lg">
          {{ t("calculate") }}
        </button>
      </fieldset>
    </form>
  </div>
</template>
