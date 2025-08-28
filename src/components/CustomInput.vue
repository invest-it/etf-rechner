<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue";
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
const dropdownRef = ref(null);

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
  isOpen.value = false;
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const fallbackKeys = ["msciWorld", "sp500", "dax"];

const formatPercent = (v) => (Number.isFinite(v) ? v.toLocaleString(locale.value, { maximumFractionDigits: 1 }) : v);

const viewOptions = computed(() =>
  props.options.map((opt, i) => {
    const key = opt.i18nKey || opt.key || (i < fallbackKeys.length ? fallbackKeys[i] : `preset${i}`);

    const name = t(`presets.${key}.name`, opt.header || "");
    const description = t(`presets.${key}.description`, opt.description || "");

    const header = t("presets.header", {
      name,
      avg: formatPercent(opt.value),
    });

    return {
      ...opt,
      header,
      description,
      __i18nKey: key,
    };
  }),
);
</script>

<template>
  <div ref="dropdownRef" class="form-control py-1 w-full">
    <label v-if="label" class="label pb-1">
      <span class="label-text">{{ label }}</span>
      <span>
        <div class="tooltip sm:tooltip-right" :data-tip="info">
          <button type="button" class="bg-primary w-[16px] h-[16px] font-light text-xs text-white rounded-full" aria-label="More info">
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
        @input="onInput" />

      <div class="dropdown dropdown-bottom dropdown-end md:dropdown-center lg:dropdown-start" :class="{ 'dropdown-open': isOpen }">
        <button
          type="button"
          class="join-item text-black h-full w-12 bg-base-100 border [border-color:color-mix(in_oklab,#000_20%,#0000)] border-l-0 rounded-l-none rounded-r-md focus:outline-none focus:border-l-1 focus:ring-0 focus:border-primary"
          :aria-expanded="isOpen.toString()"
          aria-haspopup="listbox"
          @click.stop="isOpen = !isOpen">
          ⌄
        </button>

        <div class="card dropdown-content bg-base-100 rounded-box shadow-custom w-[280px]">
          <div class="card-body">
            <ul role="listbox" class="flex flex-col gap-5">
              <li
                v-for="(opt, i) in viewOptions"
                :key="opt.__i18nKey || opt.header || i"
                class="cursor-pointer hover:bg-base-200 rounded p-2"
                role="option"
                :aria-selected="selectedIndex === i"
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
