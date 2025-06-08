<template>
  <q-page v-bind="page?.props">
    <component-renderer
      v-for="(component, index) in page?.body"
      :key="index"
      v-bind="component || {}"
    />
  </q-page>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['page-data'],
})

const { page } = usePage()

useHead({
  title: page?.value?.title,
  meta: [
    {
      name: 'description',
      content: page?.value?.description,
    },
  ],
})
</script>
