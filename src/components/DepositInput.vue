<script setup>
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  amount: { type: [Number, String], default: 150 },
  depositType: { type: String, default: "monatlich" },
  label: { type: String },
  info: { type: String },
  options: { type: Array, default: () => ["monatlich", "jährlich"] },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:amount", "update:depositType", "change"]);

const open = ref(false);

const localStr = ref(String(props.amount ?? 150));
const selected = ref(props.options.includes(props.depositType) ? props.depositType : "monatlich");

const norm = (v) => {
  const s = String(v || "").toLowerCase();
  if (s.includes("jähr") || s.includes("year")) return "yearly";
  return "monthly";
};

const labelOf = (v) => t(`depositType.${norm(v)}`);
const infoText = computed(() => {
  return t(`info.${norm(selected.value)}`, {}, { default: props.info });
});

watch(
  () => props.amount,
  (v) => {
    if (String(v) !== localStr.value) localStr.value = String(v ?? "");
  },
);
watch(
  () => props.depositType,
  (v) => {
    if (v && v !== selected.value) selected.value = v;
  },
);
watch(
  () => props.disabled,
  (d) => {
    if (d) open.value = false;
  },
);

watch(localStr, (v) => {
  const num = v === "" ? "" : Number(v);
  emit("update:amount", num);
  emit("change", { amount: num, depositType: selected.value });
});
watch(selected, (v) => {
  emit("update:depositType", v);
  emit("change", { amount: Number(localStr.value), depositType: v });
});

function toggleOpen() {
  if (!props.disabled) open.value = !open.value;
}
function select(opt) {
  if (props.disabled) return;
  selected.value = opt;
  open.value = false;
}
function onInput(e) {
  localStr.value = e.target.value;
}
</script>

<template>
  <div class="form-control py-1 w-full">
    <label v-if="label" class="label pb-1 w-full">
      <span class="label-text" :class="{ 'opacity-60': disabled }">{{ label }}</span>
      <span>
        <div class="tooltip sm:tooltip-right" :data-tip="infoText">
          <button
            type="button"
            class="bg-primary w-[16px] h-[16px] font-light text-xs text-white rounded-full"
            :disabled="disabled"
            aria-disabled="true">
            ?
          </button>
        </div>
      </span>
    </label>

    <div class="join gap-2">
      <input
        type="number"
        class="input join-item rounded-md input-bordered focus:outline-none font-light focus:ring-0 w-full focus:border-primary no-spinner text-[16px] sm:text-[14px]"
        step="0.1"
        :value="localStr"
        required
        inputmode="decimal"
        :disabled="disabled"
        @input="onInput" />

      <div class="dropdown dropdown-end sm:dropdown-start">
        <button
          type="button"
          class="btn bg-base-100 [border-color:color-mix(in_oklab,#000_20%,#0000)] min-w-[120px] transition-none font-light rounded-md focus:outline-none focus:border-primary"
          :disabled="disabled"
          :aria-disabled="disabled"
          @click="toggleOpen">
          {{ labelOf(selected) }}
          <span class="ml-2">⌄</span>
        </button>

        <ul
          v-show="!disabled && open"
          class="dropdown-content menu bg-white text-primary rounded-box z-10 w-56 p-2 shadow-custom"
          role="listbox"
          :tabindex="disabled ? -1 : 0">
          <li v-for="opt in options" :key="opt">
            <a role="option" :aria-selected="selected === opt" class="flex justify-between font-semibold hover:bg-base-200" @click.prevent="select(opt)">
              <span>{{ labelOf(opt) }}</span>
              <span v-if="selected === opt">✓</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
