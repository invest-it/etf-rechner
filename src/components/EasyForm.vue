<script setup>
import { ref } from "vue";
import NumberInput from "./NumberInput.vue";
import CustomInput from "./CustomInput.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emit = defineEmits(["submit"]);

const capital = ref(2000);
const monthly = ref(150);
const returnRate = ref(3);
const duration = ref(10);

function handleSubmit() {
  emit("submit", {
    capital: Number(capital.value),
    monthly: Number(monthly.value),
    returnRate: Number(returnRate.value),
    duration: Number(duration.value),
  });
}
</script>

<template>
  <div class="shadow-custom rounded-xl py-6 max-w-md">
    <div class="flex justify-between items-center mb-4 mx-4">
      <div class="bg-accent text-primary font-semibold px-3 py-1 rounded-md">
        {{ t("easy") }}
      </div>
      <label class="flex items-center cursor-pointer">
        <span class="mr-2 font-medium text-primary"></span>
        <input type="checkbox" class="toggle rounded-lg toggle-primary" checked />
      </label>
    </div>

    <form @submit.prevent="handleSubmit">
      <fieldset class="fieldset w-full p-6">
        <NumberInput
            v-model="capital"
            :label="`${t('labels.startCapital')} (€)`"
            :info="t('info.startCapital')"
        />
        <NumberInput
            v-model="monthly"
            :label="`${t('labels.monthlyContribution')} (€)`"
            :info="t('info.monthlyContribution')"
        />
        <CustomInput
            v-model="returnRate"
            :label="`${t('labels.expectedAnnualReturn')} (%)`"
            :info="t('info.expectedAnnualReturn')"
        />
        <NumberInput
            v-model="duration"
            :label="t('labels.durationYears')"
            :info="t('info.durationYears')"
        />

        <button type="submit" class="w-full btn btn-neutral text-white font-semibold text-lg">
          {{ t("calculate") }}
        </button>
      </fieldset>
    </form>
  </div>
</template>
