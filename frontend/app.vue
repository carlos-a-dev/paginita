<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { globalSettings, fetchGlobal } = useGlobalSettings()
await fetchGlobal()

useHead({
  title: globalSettings.value.siteName,
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: globalSettings.value.favicon ? useStrapiMedia(globalSettings.value.favicon) : '/favicon.ico'
    },
  ],
  meta: [
    {
      name: 'description',
      content: globalSettings.value.siteDescription
    },
    {
      property: 'og:title',
      content: globalSettings.value.metaTitle
    },
    {
      property: 'og:description',
      content: globalSettings.value.metaDescription
    },
    {
      property: 'og:image',
      content: useStrapiMedia(globalSettings.value.shareImage)
    }
  ],
  style: [
    {
      textContent: `:root {
        ${Object.entries(globalSettings.value.quasarTheme || {}).filter(([key, val]) => key != 'id' && val)
          .map(([key, val]) => `--q-${key}: ${val};`)
          .join('')}
        }`,
      // type: 'text/css',
      tagPosition: 'bodyOpen',
      tagPriority: 1
    }
  ]
})
</script>
