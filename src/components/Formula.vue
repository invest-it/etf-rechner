<script setup>
import { computed } from "vue";
import katex from "katex";
import "katex/dist/katex.min.css";

const props = defineProps({
  tex: { type: String, required: true },
  inline: { type: Boolean, default: true },
});

const html = computed(() =>
  katex.renderToString(props.tex, {
    throwOnError: false,
    output: "html",
    displayMode: !props.inline,
  }),
);
</script>

<template>
  <div class="badge badge-accent text-black my-2 p-2 h-full block">
    <span class="text-[14px] break-words overflow-wrap" v-html="html"></span>
  </div>
</template>
