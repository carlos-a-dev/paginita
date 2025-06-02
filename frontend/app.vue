<template>
  <NuxtLayout :name="nLayout">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { QuasarTheme } from '~/types/globalSettings'

const { globalSettings } = useGlobalSettings()
const { layout } = usePage()
const route = useRoute()

const nLayout = computed(() => {
  if (route.params.slug === undefined) {
    return route.meta.layout || 'default'
  }

  return layout.value
})

useHead({
  title: globalSettings.value?.siteName,
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: globalSettings.value?.favicon ? useStrapiMedia(globalSettings.value?.favicon ?? '') : '/favicon.ico',
    },
  ],
  meta: [
    {
      name: 'description',
      content: globalSettings.value?.siteDescription,
    },
    {
      property: 'og:title',
      content: globalSettings.value?.metaTitle,
    },
    {
      property: 'og:description',
      content: globalSettings.value?.metaDescription,
    },
    {
      property: 'og:image',
      content: useStrapiMedia(globalSettings.value?.shareImage ?? ''),
    },
  ],
})

if (globalSettings.value?.quasarTheme) {
  useHead({
    style: [
      {
        textContent: getThemeStyle(globalSettings.value?.quasarTheme),
        tagPosition: 'bodyOpen',
        tagPriority: 1,
      },
    ],
  })
}

function getThemeStyle(quasarTheme: QuasarTheme | undefined) {
  if (!quasarTheme) return ''
  return `:root { ${Object.entries(quasarTheme)
    .map(([key, val]) => `--q-${key}: ${val};`)
    .join('')} }`
}

const darkMode = useCookie<boolean | 'auto'>('dark-mode', { default: () => 'auto' })

if (darkMode.value !== 'auto') {
  useNuxtApp().$q.dark.set(darkMode.value)
}

onMounted(() => {
  if (darkMode.value === 'auto') {
    useNuxtApp().$q.dark.set('auto')
  }
})
</script>

<style>
.layout-enter-active {
  animation: fadeIn 0.3s;
}
.layout-leave-active {
  animation: fadeOut 0.3s;
}

.page-enter-active {
  animation: fadeIn 0.2s;
}
.page-leave-active {
  animation: fadeOut 0.2s;
}
</style>
