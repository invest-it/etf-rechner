<script setup>
import katex from "katex";
import "katex/dist/katex.min.css";
import { computed } from "vue";

const props = defineProps({
  tex: { type: String, required: true },
  inline: { type: Boolean, default: false },
});
const html = computed(() => katex.renderToString(props.tex, { throwOnError: false, output: "html", displayMode: !props.inline }));
</script>

<template>
  <span class="badge badge-accent text-black my-2 py-7">
    <div class="text-[14px]" v-html="html" />
  </span>
</template>
