<script lang="ts" setup>
import {
  ref,
  watch,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { useI18n } from "vue-i18n";
import { DepositType } from "../types/deposit-type";

const { t } = useI18n();

interface DepositInputProps {
  amount?: number | string;
  depositType?: DepositType;
  label: string;
  info: string;
  options?: DepositType[];
  disabled?: boolean;
}

const props = withDefaults(defineProps<DepositInputProps>(), {
  amount: 150,
  depositType: DepositType.Monthly,
  options: () => [DepositType.Monthly, DepositType.Yearly],
  disabled: false,
});

const emit = defineEmits<{
  "update:amount": [value: number | string];
  "update:depositType": [value: DepositType];
  change: [payload: { amount: number | string; depositType: DepositType }];
}>();

const open = ref(false);
const localStr = ref(String(props.amount ?? 150));
const selected = ref<DepositType>(
  props.options.includes(props.depositType)
    ? props.depositType
    : DepositType.Monthly,
);

const buttonRef = ref<HTMLButtonElement | null>(null);
const listRef = ref<HTMLUListElement | null>(null);
const optRefs = ref<HTMLLIElement[]>([]);
const activeIndex = ref(0);
const listboxId = "deposit-type-listbox";

const labelOf = (v: DepositType) => t(`depositType.${v}`);
const infoText = computed(() =>
  t(`info.${selected.value}`, {}, { default: props.info }),
);

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

function toggleOpen(force: unknown) {
  if (props.disabled) return;
  const next = typeof force === "boolean" ? force : !open.value;
  console.log(next);
  console.log(force);
  if (next === open.value) return;
  open.value = next;

  if (open.value) {
    const idx = Math.max(0, props.options.indexOf(selected.value));
    activeIndex.value = idx === -1 ? 0 : idx;
    nextTick(() => {
      listRef.value?.focus();
      ensureVisible();
    });
  } else {
    nextTick(() => buttonRef.value?.focus());
  }
}

function select(opt: DepositType) {
  if (props.disabled) return;
  selected.value = opt;
  toggleOpen(false);
}

function onInput(e: Event) {
  localStr.value = (e.target as HTMLInputElement).value;
}

function onButtonKeydown(e: KeyboardEvent) {
  if (props.disabled) return;
  const k = e.key;
  if (k === "Enter" || k === " ") {
    e.preventDefault();
    toggleOpen(true);
  } else if (k === "ArrowDown") {
    e.preventDefault();
    toggleOpen(true);
  } else if (k === "ArrowUp") {
    e.preventDefault();
    toggleOpen(true);
  } else if (k === "Escape") {
    e.preventDefault();
    toggleOpen(false);
  }
}

function onListKeydown(e: KeyboardEvent) {
  if (!open.value) return;
  const k = e.key;
  const max = props.options.length - 1;

  if (k === "ArrowDown") {
    e.preventDefault();
    activeIndex.value = Math.min(max, activeIndex.value + 1);
    ensureVisible();
  } else if (k === "ArrowUp") {
    e.preventDefault();
    activeIndex.value = Math.max(0, activeIndex.value - 1);
    ensureVisible();
  } else if (k === "Home") {
    e.preventDefault();
    activeIndex.value = 0;
    ensureVisible();
  } else if (k === "End") {
    e.preventDefault();
    activeIndex.value = max;
    ensureVisible();
  } else if (k === "Enter" || k === " ") {
    e.preventDefault();
    const opt = props.options[activeIndex.value];
    if (opt) select(opt);
  } else if (k === "Escape") {
    e.preventDefault();
    toggleOpen(false);
  } else if (k === "Tab") {
    // allow natural tabbing but close the popup
    toggleOpen(false);
  }
}

function ensureVisible() {
  const el = optRefs.value[activeIndex.value];
  el?.scrollIntoView({ block: "nearest" });
}

function onDocClick(ev: MouseEvent) {
  if (!open.value) return;
  const target = ev.target as HTMLInputElement;
  if (
    buttonRef.value &&
    !buttonRef.value.contains(target) &&
    listRef.value &&
    !listRef.value.contains(target)
  ) {
    toggleOpen(false);
  }
}
onMounted(() => document.addEventListener("click", onDocClick));
onBeforeUnmount(() => document.removeEventListener("click", onDocClick));
</script>

<template>
  <div class="form-control py-1 w-full">
    <label v-if="label" class="label pb-1 w-full">
      <span class="label-text" :class="{ 'opacity-60': disabled }">{{
        label
      }}</span>
      <span>
        <div class="tooltip sm:tooltip-right" :data-tip="infoText">
          <button
            type="button"
            class="bg-primary w-[16px] h-[16px] font-light text-xs text-white rounded-full"
            :disabled="disabled"
            :aria-disabled="disabled ? 'true' : 'false'"
          >
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
        @input="onInput"
      />

      <div :class="['dropdown dropdown-end sm:dropdown-start', { 'dropdown-open': !disabled && open }]">
        <button
          ref="buttonRef"
          type="button"
          class="btn bg-base-100 [border-color:color-mix(in_oklab,#000_20%,#0000)] min-w-[120px] transition-none font-light rounded-md focus:outline-none focus:border-primary"
          :disabled="disabled"
          :aria-disabled="disabled ? 'true' : 'false'"
          :aria-haspopup="'listbox'"
          :aria-expanded="!disabled && open"
          :aria-controls="open ? listboxId : undefined"
          @click="toggleOpen"
          @keydown="onButtonKeydown"
        >
          {{ labelOf(selected) }}
          <span class="ml-2">⌄</span>
        </button>

        <ul
          v-show="!disabled && open"
          :id="listboxId"
          ref="listRef"
          class="dropdown-content bg-white text-primary rounded-box z-10 w-56 p-2 shadow-custom max-h-64 overflow-auto"
          role="listbox"
          tabindex="0"
          :aria-activedescendant="`opt-${activeIndex}`"
          @keydown="onListKeydown"
        >
          <li
            v-for="(opt, i) in options"
            :id="`opt-${i}`"
            :key="opt"
            ref="optRefs"
            role="option"
            :aria-selected="selected === opt"
            class="w-full text-left font-semibold rounded p-2 flex justify-between cursor-pointer"
            :class="{
              'bg-base-200': i === activeIndex,
              'hover:bg-base-200': i !== activeIndex,
            }"
            @mouseenter="activeIndex = i"
            @click="select(opt)"
          >
            <span>{{ labelOf(opt) }}</span>
            <span v-if="selected === opt">✓</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
