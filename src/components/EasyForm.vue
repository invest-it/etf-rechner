<script setup>
import { ref } from "vue";
import NumberInput from "./NumberInput.vue";

const emit = defineEmits(["submit"]);

const capital = ref(5000);
const monthly = ref(200);
const returnRate = ref(2);
const duration = ref(10);

function handleSubmit(e) {
  e.preventDefault();
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
        {{ $t("etf-rechner") }}
      </div>
      <label class="flex items-center cursor-pointer">
        <span class="mr-2 font-medium text-primary">
          {{ $t("easy") }}
        </span>
        <input
          type="checkbox"
          class="toggle rounded-lg toggle-primary"
          checked
        />
      </label>
    </div>

    <form @submit="handleSubmit">
      <fieldset class="fieldset w-full p-6">
        <NumberInput
          v-model="capital"
          :label="`${$t('startCapital')} (€)`"
          placeholder="5000€"
          info="Das Startkapital ist der Geldbetrag, der zu Beginn eines Vorhabens bereits vorhanden ist und für erste Ausgaben verwendet wird."
        />
        <NumberInput
          v-model="monthly"
          :label="`${$t('monthlyContribution')} (€)`"
          placeholder="200€"
          info="Fester Geldbetrag, der jeden Monat zusätzlich zum Startkapital eingezahlt wird, um das Vorhaben mitzufinanzieren."
        />
        <NumberInput
          v-model="returnRate"
          :label="`${$t('expectedAnnualReturn')} %`"
          placeholder="2%"
          step="0.1"
          info="Geschätzter prozentualer Gewinn pro Jahr, den deine Einzahlungen z.B. durch Zinsen oder Wertsteigerung erwirtschaften sollen."
        />
        <NumberInput
          v-model="duration"
          :label="$t('durationYears')"
          placeholder="10 Jahre"
          info="Zeitraum in Jahren, über den das Startkapital und die monatlichen Einzahlungen angelegt oder berechnet werden."
        />

        <button
          type="submit"
          class="w-full btn btn-neutral text-white font-semibold text-lg"
        >
          {{$t("calculate")}}
        </button>
      </fieldset>
    </form>
  </div>
</template>
