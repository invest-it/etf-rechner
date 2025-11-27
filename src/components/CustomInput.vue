<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed, nextTick } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

const props = defineProps({
  modelValue: { type: [Number, String], default: null },
  label: { type: String, default: "" },
  info: { type: String, default: "info" },
  options: {
    type: Array,
    default: () => [
      {
        header: "MSCI World (durchschnittlich 6,3%)",
        description: "Breit angelegter Index entwickelter Märkte (Europa, Amerika, Asien).",
        value: 6.3,
      },
      {
        header: "S&P 500 (durchschnittlich 8,1%)",
        description: "Abbild der Wertentwicklung von ca. 500 großen US-Unternehmen.",
        value: 8.1,
      },
      {
        header: "DAX (durchschnittlich 7%)",
        description: "Index der 40 größten und liquidesten deutschen Unternehmen.",
        value: 7.0,
      },
    ],
  },
});

const emit = defineEmits(["update:modelValue"]);

const localStr = ref(props.modelValue ?? "");
const selectedIndex = ref(-1);
const isOpen = ref(false);
const activeIndex = ref(0);
const dropdownRef = ref(null);
const listRef = ref(null);
const buttonRef = ref(null);
const optRefs = ref([]);
const listboxId = "preset-listbox";

watch(
  () => props.modelValue,
  (v) => (localStr.value = v ?? ""),
);

function toNumber(raw) {
  const n = Number.parseFloat(String(raw).replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

function onInput(e) {
  const raw = e.target.value;
  localStr.value = raw;

  if (raw === "") {
    selectedIndex.value = -1;
    emit("update:modelValue", null);
    return;
  }
  const num = toNumber(raw);
  if (!Number.isNaN(num)) {
    selectedIndex.value = -1;
    emit("update:modelValue", num);
  }
}

function applyPreset(idx) {
  const opt = viewOptions.value[idx];
  if (!opt) return;
  selectedIndex.value = idx;
  localStr.value = String(opt.value);
  emit("update:modelValue", Number(opt.value));
  closeDropdown();
}

function openDropdown() {
  isOpen.value = true;
  activeIndex.value = selectedIndex.value >= 0 ? selectedIndex.value : 0;
  nextTick(() => {
    listRef.value?.focus();
    ensureVisible();
  });
}

function closeDropdown() {
  isOpen.value = false;
  nextTick(() => buttonRef.value?.focus());
}

function handleClickOutside(event) {
  if (!isOpen.value) return;
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown();
  }
}

onMounted(() => document.addEventListener("mousedown", handleClickOutside));
onBeforeUnmount(() => document.removeEventListener("mousedown", handleClickOutside));

const fallbackKeys = ["msciWorld", "sp500", "dax"];
const formatPercent = (v) => (Number.isFinite(v) ? v.toLocaleString(locale.value, { maximumFractionDigits: 1 }) : v);

const viewOptions = computed(() =>
  props.options.map((opt, i) => {
    const key = opt.i18nKey || opt.key || (i < fallbackKeys.length ? fallbackKeys[i] : `preset${i}`);
    const name = t(`presets.${key}.name`, opt.header || "");
    const description = t(`presets.${key}.description`, opt.description || "");
    const header = t("presets.header", { name, avg: formatPercent(opt.value) });
    return { ...opt, header, description, __i18nKey: key };
  }),
);

function onInputKeydown(e) {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (!isOpen.value) openDropdown();
  } else if (e.key === "Escape") {
    e.preventDefault();
    closeDropdown();
  }
}

function onToggleKeydown(e) {
  const k = e.key;
  if (k === "Enter" || k === " " || k === "ArrowDown" || k === "ArrowUp") {
    e.preventDefault();
    isOpen.value ? closeDropdown() : openDropdown();
  } else if (k === "Escape") {
    e.preventDefault();
    closeDropdown();
  }
}

function onListKeydown(e) {
  if (!isOpen.value) return;
  const max = viewOptions.value.length - 1;
  const k = e.key;

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
    applyPreset(activeIndex.value);
  } else if (k === "Escape") {
    e.preventDefault();
    closeDropdown();
  } else if (k === "Tab") {
    // close and let focus move naturally
    closeDropdown();
  }
}

function ensureVisible() {
  const itemBtn = optRefs.value[activeIndex.value];
  itemBtn?.scrollIntoView?.({ block: "nearest" });
}
</script>

<template>
  <div ref="dropdownRef" class="form-control py-1 w-full">
    <label v-if="label" class="label pb-1">
      <span class="label-text">{{ label }}</span>
      <span>
        <div class="tooltip sm:tooltip-right" :data-tip="info">
          <button type="button" class="bg-primary w-[16px] h-[16px] font-light text-xs text-white rounded-full" aria-label="Mehr Info">
            ?
          </button>
        </div>
      </span>
    </label>

    <div class="join w-full">
      <input
        type="number"
        class="input join-item input-bordered focus:outline-none font-light focus:ring-0 w-full focus:border-primary no-spinner text-[16px] sm:text-[14px]"
        step="0.1"
        :value="localStr"
        required
        inputmode="decimal"
        :aria-expanded="isOpen.toString()"
        aria-haspopup="listbox"
        @input="onInput"
        @keydown="onInputKeydown" />

      <div class="dropdown dropdown-bottom dropdown-end md:dropdown-center lg:dropdown-start">
        <button
          ref="buttonRef"
          type="button"
          class="join-item text-black h-full w-12 bg-base-100 border [border-color:color-mix(in_oklab,#000_20%,#0000)] border-l-0 rounded-l-none rounded-r-md focus:outline-none focus:border-l-1 focus:ring-0 focus:border-primary"
          :aria-expanded="isOpen.toString()"
          aria-haspopup="listbox"
          :aria-controls="isOpen ? listboxId : undefined"
          @click.stop="isOpen ? closeDropdown() : openDropdown()"
          @keydown="onToggleKeydown">
          ⌄
        </button>

        <div v-show="isOpen" class="card dropdown-content bg-base-100 rounded-box shadow-custom w-[280px]">
          <div class="card-body">
            <ul
              :id="listboxId"
              ref="listRef"
              role="listbox"
              class="flex flex-col gap-5 outline-none"
              tabindex="0"
              :aria-activedescendant="`opt-${activeIndex}`"
              @keydown="onListKeydown">
              <li
                v-for="(opt, i) in viewOptions"
                :id="`opt-${i}`"
                :key="opt.__i18nKey || opt.header || i"
                ref="optRefs"
                role="option"
                :aria-selected="activeIndex === i"
                class="cursor-pointer rounded p-2"
                :class="{
                  'bg-base-200': activeIndex === i,
                  'hover:bg-base-200': activeIndex !== i,
                }"
                @mouseenter="activeIndex = i"
                @click="applyPreset(i)">
                <h3 class="text-sm font-semibold text-primary leading-snug whitespace-normal break-words">
                  {{ opt.header }}
                </h3>
                <p v-if="opt.description" class="text-xs text-black mt-1 whitespace-normal break-words">
                  {{ opt.description }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
