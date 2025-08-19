<script setup>
import Logo from "../assets/logo.svg";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const toggleLanguage = () => {
  locale.value = locale.value === "en" ? "de" : "en";
};
</script>
<template>
  <div class="navbar bg-base-100 shadow-custom h-[87px] px-10 flex justify-between">
    <img :src="Logo" alt="Invest It" class="w-[166px]" />
    <button class="ml-auto btn btn-sm bg-primary text-white" @click="toggleLanguage">
      {{ locale.toUpperCase() }}
    </button>
  </div>
</template>
