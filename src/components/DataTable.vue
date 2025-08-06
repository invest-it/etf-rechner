<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="overflow-x-auto rounded-lg">
    <table class="table table-zebra bg-accent text-center rounded-box w-full">
      <thead>
        <tr class="text-primary bg-white font-bold">
          <th>Jahre</th>
          <th>Einzahlungen (€)</th>
          <th>Gewinn (€)</th>
          <th>Kontostand (€)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="row.year">
          <td>{{ row.year }}</td>
          <td>{{ row.einzahlung }}</td>
          <td>{{ row.zinsen }}</td>
          <td>{{ row.kontostand }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
