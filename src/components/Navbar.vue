<script setup>
import Logo from "../assets/logo.svg";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const toggleLanguage = () => {
  locale.value = locale.value === "en" ? "de" : "en";
};
</script>

<template>
  <nav class="navbar sticky top-0 z-50 bg-base-100 shadow-custom h-[87px] px-10 flex justify-between relative" aria-label="Main navigation">
    <a href="/" class="flex items-center">
      <img :src="Logo" alt="Invest It" class="w-[166px]" />
    </a>
    <h1 class="hidden lg:flex items-center text-2xl xl:text-3xl font-semibold absolute left-1/2 -translate-x-1/2">
      <span class="bg-primary text-white rounded-md px-2.5 py-1">ETF</span>
      <span class="text-black py-1">-{{ $t("rechner") }}</span>
    </h1>
    <button
      class="ml-auto btn btn-sm bg-primary text-white"
      :aria-label="`Switch language to ${locale.value === 'en' ? 'German' : 'English'}`"
      @click="toggleLanguage">
      {{ locale.toUpperCase() }}
    </button>
  </nav>
</template>
