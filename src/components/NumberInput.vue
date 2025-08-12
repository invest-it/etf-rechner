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

  info: {
    type: String,
    default: "info",
  }
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="form-control py-1 w-full">
    <label v-if="label" class="label pb-1">
      <span class="label-text">{{ label }}</span>    <span>
    <div class="tooltip tooltip-right" :data-tip="info">
      <button
          class="bg-primary w-[16px] h-[16px] font-light text-xs text-white rounded-full"
      >
         ?
      </button>
    </div>
    </span>
    </label>
    <input
      type="number"
      :placeholder="placeholder"
      :value="modelValue"
      :class="[
        'input input-bordered focus:outline-none focus:ring-0 focus:border-primary no-spinner',
        error ? 'input-error' : '',
      ]"
      @input="$emit('update:modelValue', Number($event.target.value))"
    />
    <p v-if="error" class="text-error text-sm mt-1">{{ error }}</p>
  </div>
</template>
