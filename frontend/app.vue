<template>
  <NuxtLayout :name="nLayout">
    <NuxtPage :key="route.path" />
  </NuxtLayout>
</template>

<script setup lang="ts">
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
  titleTemplate: (subTitle) => {
    return subTitle
      ? `${subTitle} - ${globalSettings.value?.siteName}`
      : globalSettings.value?.siteName
  },
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

const { themeStyle, darkMode } = useTheme()
if (themeStyle) {
  useHead({
    style: [
      {
        textContent: themeStyle,
        tagPosition: 'bodyOpen',
        tagPriority: 1,
      },
    ],
  })
}

if (darkMode.value !== 'auto') {
  useQuasar().dark.set(darkMode.value)
}

onMounted(() => {
  if (darkMode.value === 'auto') {
    useQuasar().dark.set('auto')
  }
})
</script>

<style>
/* .layout-enter-active {
  animation: fadeIn 0.3s;
}
.layout-leave-active {
  animation: fadeOut 0.3s;
} */

.page-enter-active {
  animation: fadeIn 0.2s;
}
.page-leave-active {
  animation: fadeOut 0.2s;
}
</style>
