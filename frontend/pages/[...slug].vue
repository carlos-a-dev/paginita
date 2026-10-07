<template>
  <q-page
    v-bind="page?.props"
    id="main-content"
    tabindex="-1"
    class="site-page"
  >
    <div class="page-sections">
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

if (page.value.seo) {
  useSeo(page.value.seo)
}
</script>
