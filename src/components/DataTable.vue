<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import Dropdown from "./Dropdown.vue";

const scrolledLeft = ref(false);
const scroller = ref(null);
const canScroll = ref(false);

const updateCanScroll = () => {
  if (!scroller.value) return;
  canScroll.value = scroller.value.scrollWidth > scroller.value.clientWidth;
};

const scrollRight = () => {
  if (!scroller.value) return;
  scroller.value.scrollBy({ left: 160, behavior: "smooth" });
};
const onScroll = (e) => (scrolledLeft.value = e.target.scrollLeft > 0);

onMounted(() => {
  updateCanScroll();
  window.addEventListener("resize", updateCanScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateCanScroll);
});

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

watch(
  () => props.data,
  () => {
    updateCanScroll();
  },
  { deep: true },
);

defineExpose({ canScroll, scrolledLeft, scrollRight, updateCanScroll });
</script>

<template>
  <div ref="scroller" class="overflow-x-auto rounded-xl shadow-custom relative" @scroll="onScroll">
    <div
      v-if="canScroll && !scrolledLeft"
      class="md:hidden pointer-events-none absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-base-100 to-transparent">
    </div>

    <table class="table rounded-xl table-pin-cols min-h-[513px] table-zebra bg-accent text-center rounded-box w-full">
      <thead>
        <tr class="text-primary bg-white font-bold">
          <th>{{ $t("years") }}</th>
          <td>{{ $t("deposits") }}(€)</td>
          <td>{{ $t("interest") }}(€)</td>
          <td>{{ $t("accountBalance") }} (€)</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data" :key="row.year">
          <th class="sticky font-medium left-0" :class="index % 2 === 0 ? 'bg-accent' : 'bg-base-200'">
            {{ row.year }}
          </th>
          <td>{{ row.einzahlung }}</td>
          <td>{{ row.zinsen }}</td>
          <td>{{ row.kontostand }}</td>
        </tr>
      </tbody>
    </table>

    <div class="hidden sm:block absolute bottom-1 right-1 z-20">
      <Dropdown position="dropdown-top dropdown-end" />
    </div>
  </div>
</template>
