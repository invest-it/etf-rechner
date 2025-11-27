<script setup>
defineProps({
  title: { type: String, required: true },
  value: { type: String, required: true },
  variant: { type: String, default: "neutral" },
});
</script>

<template>
  <div class="stat rounded-box shadow-sm" :class="variant === 'primary' ? 'bg-primary text-white' : 'bg-base-100'">
    <div class="stat-title" :class="variant === 'primary' ? 'text-white' : ''">
      {{ title }}
    </div>
    <div class="stat-value text-base" :class="variant === 'primary' ? 'text-lg' : 'text-base'">
      {{ value }}
    </div>
  </div>
</template>
