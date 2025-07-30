<script setup>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import EtfCalculator from "./components/EtfCalculator.vue";
</script>

<template>
  <Navbar />
  <main
    class="min-h-screen px-4 sm:px-10 w-full pt-10 sm:pt-20 pb-12 max-w-full overflow-hidden"
  >
    <EtfCalculator />
  </main>

  <Footer />
</template>
