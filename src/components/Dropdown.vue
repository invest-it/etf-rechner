<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  position: {
    type: String,
    default: "dropdown-top",
  },
});
</script>

<template>
  <div :class="['dropdown', props.position, 'dropdown-hover']">
    <div tabindex="0" role="button" class="btn btn-circle bg-primary text-white h-9 w-9">?</div>
    <div tabindex="0" class="card card-sm dropdown-content bg-base-100 rounded-box z-1 w-64 shadow-custom">
      <div tabindex="0" class="card-body">
        <ul class="gap-8">
          <li class="p-2">
            <h2 class="card-title text-primary">{{ t("tableInfo.deposits.title") }}</h2>
            <p>{{ t("tableInfo.deposits.description") }}</p>
          </li>
          <li class="p-2">
            <h2 class="card-title text-primary">{{ t("tableInfo.interest.title") }}</h2>
            <p>{{ t("tableInfo.interest.description") }}</p>
          </li>
          <li class="p-2">
            <h2 class="card-title text-primary">{{ t("tableInfo.balance.title") }}</h2>
            <p>{{ t("tableInfo.balance.description") }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
