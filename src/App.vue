<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import EtfCalculator from "./components/EtfCalculator.vue";
</script>

<template>
  <Navbar />
  <main class="min-h-screen px-4 sm:px-10 w-full pt-10 sm:pt-20 pb-12 2xl:max-w-3/4 mx-auto overflow-hidden">
    <div class="flex justify-center pb-10 sm:pb-20">
      <h1 class="text-4xl sm:text-5xl font-semibold overflow-hidden flex">
        <span class="bg-accent text-primary rounded-md px-3 py-1">ETF</span>
        <span class="bg-white text-black py-1">-{{ $t("rechner") }}</span>
      </h1>
    </div>
    <EtfCalculator />
  </main>
  <Footer />
</template>
