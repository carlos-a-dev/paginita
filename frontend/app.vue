<template>
  <NuxtLayout :name="nLayout">
    <NuxtPage />
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
      href: useStrapiMedia(globalSettings.value?.favicon) ?? '/favicon.ico',
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

useQuasar().dark.set(darkMode.value)
if (import.meta.server && darkMode.value) {
  useHead({
    script: [
      { innerHTML: '(function() { document.body.classList.add(\'prevent-flash\'); } ())', type: 'text/javascript', tagPosition: 'bodyOpen', tagPriority: 1 },
    ],
  })
}
if (!import.meta.server && darkMode.value) {
  document.body.classList.remove('prevent-flash')
}
</script>

<style lang="scss">
/* .layout-enter-active {
  animation: fadeIn 0.3s;
}
.layout-leave-active {
  animation: fadeOut 0.3s;
} */

.page-enter-active {
  animation: fadeIn 0.3s;
}
.page-leave-active {
  animation: fadeOut 0.1s;
}

body.prevent-flash {
  background-color: $dark-page !important;
}
</style>
