<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Logo from "../assets/logo.svg";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const languageDropdown = ref(null);
const languageOpen = ref(false);

const languages = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
];

const selectLanguage = (code) => {
  locale.value = code;
  languageOpen.value = false;
};

const closeOnOutsideClick = (event) => {
  if (!languageOpen.value || languageDropdown.value?.contains(event.target)) return;
  languageOpen.value = false;
};

onMounted(() => document.addEventListener("mousedown", closeOnOutsideClick));
onBeforeUnmount(() => document.removeEventListener("mousedown", closeOnOutsideClick));
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
    <div ref="languageDropdown" class="dropdown dropdown-end ml-auto">
      <button
        type="button"
        class="btn btn-sm bg-primary text-white min-w-24 transition-none"
        aria-haspopup="listbox"
        :aria-expanded="languageOpen.toString()"
        aria-label="Sprache auswählen"
        @click="languageOpen = !languageOpen">
        <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3.6 9h16.8M3.6 15h16.8M12 3c2 2.2 3 5.2 3 9s-1 6.8-3 9M12 3c-2 2.2-3 5.2-3 9s1 6.8 3 9" />
        </svg>
        {{ locale.toUpperCase() }}
        <svg
          class="h-4 w-4 shrink-0 transition-transform"
          :class="{ 'rotate-180': languageOpen }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <ul
        v-show="languageOpen"
        class="dropdown-content z-50 mt-2 w-40 rounded-box bg-base-100 p-2 text-primary shadow-custom"
        role="listbox"
        aria-label="Sprache">
        <li v-for="language in languages" :key="language.code" role="option" :aria-selected="locale === language.code">
          <button
            type="button"
            class="flex w-full items-center justify-between rounded-md p-2 text-left font-semibold hover:bg-base-200"
            :class="{ 'bg-base-200': locale === language.code }"
            @click="selectLanguage(language.code)">
            <span>{{ language.label }}</span>
            <svg v-if="locale === language.code" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 13 4 4L19 7" />
            </svg>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>
