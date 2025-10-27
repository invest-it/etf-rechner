<script setup>
defineProps({
  step: { type: Number, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
});
</script>

<template>
  <section class="p-4 rounded-box shadow-sm">
    <h3 class="text-lg font-semibold">
      <span class="badge badge-lg mb-1 badge-primary">{{ $t("ui.step") }} {{ step }}</span>
      {{ title }}
    </h3>
    <p v-if="desc" class="p-1">{{ desc }}</p>
    <slot />
  </section>
</template>
