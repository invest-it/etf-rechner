<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";

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
  async () => {
    await nextTick();
    updateCanScroll();
  },
  { deep: true },
);

defineExpose({ canScroll, scrolledLeft, scrollRight, updateCanScroll });
</script>

<template>
  <div class="space-y-4">
    <div ref="scroller" class="max-h-[320px] overflow-auto rounded-xl shadow-custom relative [scrollbar-gutter:stable] sm:max-h-[340px]" @scroll="onScroll">
      <div
        v-if="canScroll && !scrolledLeft"
        class="md:hidden pointer-events-none absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-base-100 to-transparent"></div>

      <table class="table table-pin-cols table-zebra bg-accent text-center w-full min-w-[640px]">
        <thead class="sticky top-0 z-20">
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
    </div>

    <section class="rounded-xl bg-base-100 shadow-custom p-4">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span class="inline-flex bg-primary text-white font-semibold text-sm px-3 py-1 rounded-md mb-2">{{ $t("tableInfo.kicker") }}</span>
          <h2 class="text-xl font-semibold">{{ $t("tableInfo.title") }}</h2>
        </div>
        <p class="text-sm leading-5 opacity-75 sm:max-w-sm">{{ $t("tableInfo.description") }}</p>
      </div>

      <div class="mt-4 grid gap-2 md:grid-cols-3">
        <article class="rounded-md bg-accent/60 p-3">
          <div class="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v12m6-6H6" />
            </svg>
          </div>
          <h3 class="font-semibold text-primary">{{ $t("tableInfo.deposits.title") }}</h3>
          <p class="mt-1.5 text-sm leading-5">{{ $t("tableInfo.deposits.description") }}</p>
        </article>

        <article class="rounded-md bg-accent/60 p-3">
          <div class="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 16 5-5 4 4 7-7" />
            </svg>
          </div>
          <h3 class="font-semibold text-primary">{{ $t("tableInfo.interest.title") }}</h3>
          <p class="mt-1.5 text-sm leading-5">{{ $t("tableInfo.interest.description") }}</p>
        </article>

        <article class="rounded-md bg-accent/60 p-3">
          <div class="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16v10H4zM8 11h4" />
            </svg>
          </div>
          <h3 class="font-semibold text-primary">{{ $t("tableInfo.balance.title") }}</h3>
          <p class="mt-1.5 text-sm leading-5">{{ $t("tableInfo.balance.description") }}</p>
        </article>
      </div>
    </section>
  </div>
</template>
