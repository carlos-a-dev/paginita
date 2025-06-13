<template>
  <q-page
    v-bind="page?.props"
    class="col-xs-12 col-md-10 col-lg-8"
  >
    <div class="q-gutter-y-xl">
      <component-renderer
        v-for="(component, index) in page?.body"
        :key="index"
        v-bind="component || {}"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['page-data'],
})

const { fetchPage, getSlug } = usePage()
const page = await fetchPage(getSlug())

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
