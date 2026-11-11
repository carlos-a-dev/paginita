<template>
  <q-page
    v-bind="page?.props"
    id="main-content"
    tabindex="-1"
    class="site-page"
  >
    <h1
      v-if="fallbackHeading"
      class="visually-hidden"
    >
      {{ fallbackHeading }}
    </h1>
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

useSeo(() => page.value?.seo)

// Every page needs one H1 for screen readers and search engines. CMS content
// supplies it (a hero, or a markdown "# " heading); otherwise add a hidden one
// from the page's SEO title, without the " | Site name" suffix.
const { globalSettings } = useGlobalSettings()
const markdownH1 = /^# /m
const fallbackHeading = computed(() => {
  // The page query already filters out hidden blocks.
  const hasH1 = (page.value?.body ?? []).some((block) => {
    if (block.__component === 'f.hero') return true
    const data = (block as { data?: { body?: unknown, header?: unknown } }).data
    return [data?.body, data?.header].some(text => typeof text === 'string' && markdownH1.test(text))
  })
  if (hasH1) return ''
  const title = page.value?.seo?.metaTitle || ''
  const siteName = globalSettings.value?.siteName
  return (siteName ? title.replace(new RegExp(`\\s*[|\\-–]\\s*${siteName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`), '') : title).trim()
})
</script>
