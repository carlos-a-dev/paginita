<template>
  <q-page>
    <component-renderer
      v-for="(component, index) in page?.body"
      :key="index"
      v-bind="component || {}"
    />
  </q-page>
</template>

<script setup lang="ts">
const { page } = usePage()

definePageMeta({
  middleware: ['page-data'],
})
</script>
