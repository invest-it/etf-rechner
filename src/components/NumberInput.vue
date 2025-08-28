<script setup>
defineProps({
  modelValue: {
    type: [Number, null],
    default: null,
  },
  label: {
    type: String,
    default: "",
  },
  info: {
    type: String,
    default: "info",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="form-control py-1 w-full">
    <label v-if="label" class="label pb-1">
      <span class="label-text" :class="{ 'opacity-60': disabled }">
        {{ label }}
      </span>
      <span>
        <div class="tooltip sm:tooltip-right" :data-tip="info">
          <button class="bg-primary w-[16px] h-[16px] font-light text-xs text-white rounded-full">?</button>
        </div>
      </span>
    </label>
    <input
      type="number"
      inputmode="decimal"
      step="any"
      min="0"
      :disabled="disabled"
      required
      :value="modelValue ?? ''"
      :class="[
        'input input-bordered focus:outline-none font-light focus:ring-0 w-full focus:border-primary no-spinner text-[16px] sm:text-[14px]',
        error ? 'input-error' : '',
        disabled ? 'opacity-60 ' : '',
      ]"
      @input="
        ($event) => {
          const v = $event.target.value;
          $emit('update:modelValue', v === '' ? null : Number(v));
        }
      " />
  </div>
</template>
