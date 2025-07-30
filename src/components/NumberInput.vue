<script setup>
defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },

  error: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="form-control w-full">
    <label v-if="label" class="label">
      <span class="label-text">{{ label }}</span>
    </label>
    <input
      type="number"
      :placeholder="placeholder"
      :value="modelValue"
      :class="[
        'input input-bordered focus:outline-none focus:ring-0 focus:border-primary no-spinner',
        error ? 'input-error' : '',
      ]"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p v-if="error" class="text-error text-sm mt-1">{{ error }}</p>
  </div>
</template>
