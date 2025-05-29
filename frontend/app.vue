<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Dark } from 'quasar'
import type { QuasarTheme } from './types/globalSettings'

const { globalSettings } = useGlobalSettings()

useHead({
  title: globalSettings.value?.siteName,
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: globalSettings.value?.favicon ? useStrapiMedia(globalSettings.value?.favicon ?? '') : '/favicon.ico'
    },
  ],
  meta: [
    {
      name: 'description',
      content: globalSettings.value?.siteDescription
    },
    {
      property: 'og:title',
      content: globalSettings.value?.metaTitle
    },
    {
      property: 'og:description',
      content: globalSettings.value?.metaDescription
    },
    {
      property: 'og:image',
      content: useStrapiMedia(globalSettings.value?.shareImage ?? '')
    }
  ]
})

if (globalSettings.value?.quasarTheme) {
  useHead({
    style: [
      {
        textContent: getThemeStyle(globalSettings.value?.quasarTheme),
        tagPosition: 'bodyOpen',
        tagPriority: 1
      }
    ]
  })
}

function getThemeStyle(quasarTheme: QuasarTheme | undefined) {
  if (!quasarTheme) return ''
  return `:root { ${Object.entries(quasarTheme)
    .map(([key, val]) => `--q-${key}: ${val};`)
    .join('')} }`
}

onMounted(async () => {
  const darkModeStorage = localStorage.getItem('dark-mode')
  if (darkModeStorage) {
    Dark.set(darkModeStorage === 'true')
  } else {
    // Fallback to system preference if no storage value
    Dark.set(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  }
})
</script>
