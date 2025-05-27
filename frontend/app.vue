<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { global, fetchGlobal } = useGlobalSettings()
await fetchGlobal()

useHead({
  title: global.value?.siteName ?? '',
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: global.value?.favicon?.url ? useStrapiMedia(global.value?.favicon?.url) : '/favicon.ico'
    },
  ],
  meta: [
    {
      name: 'description',
      content: global.value?.siteDescription ?? ''
    },
    {
      property: 'og:title',
      content: global.value?.defaultSeo.metaTitle ?? ''
    },
    {
      property: 'og:description',
      content: global.value?.defaultSeo.metaDescription ?? ''
    },
    {
      property: 'og:image',
      content: useStrapiMedia(global.value?.defaultSeo.shareImage.url ?? '')
    }
  ],
  style: [
    {
      textContent: `:root {
        ${Object.entries(global.value?.quasarTheme || {}).filter(([key, val]) => key != 'id' && val)
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
