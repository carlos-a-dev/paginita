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
  ]
})
</script>
