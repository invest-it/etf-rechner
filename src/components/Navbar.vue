<script setup>
import Logo from "../assets/logo.svg";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const toggleLanguage = () => {
  locale.value = locale.value === "en" ? "de" : "en";
};
</script>

<template>
  <nav class="navbar bg-base-100 shadow-custom h-[87px] px-10 flex justify-between" aria-label="Main navigation">
    <a href="/" class="flex items-center">
      <img :src="Logo" alt="Invest It" class="w-[166px]" />
    </a>
    <button
      class="ml-auto btn btn-sm bg-primary text-white"
      :aria-label="`Switch language to ${locale.value === 'en' ? 'German' : 'English'}`"
      @click="toggleLanguage">
      {{ locale.toUpperCase() }}
    </button>
  </nav>
</template>
