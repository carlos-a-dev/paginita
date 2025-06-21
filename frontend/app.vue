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
      ? `${globalSettings.value?.siteName} - ${subTitle}`
      : globalSettings.value?.siteName
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: useStrapiMedia(globalSettings.value?.favicon) ?? '/favicon.ico',
    },
    {
      rel: 'canonical',
      href: useRequestURL().href,
    },
  ],
  meta: [
    {
      name: 'description',
      content: globalSettings.value?.siteDescription,
    },
    // Facebook
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
      content: globalSettings.value?.shareImage ? useStrapiMedia(globalSettings.value?.shareImage ?? '') : '',
    },
    {
      property: 'og:url',
      content: useRequestURL().href,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    // Twitter (X)
    {
      property: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      property: 'twitter:title',
      content: globalSettings.value?.metaTitle,
    },
    {
      property: 'twitter:description',
      content: globalSettings.value?.metaDescription,
    },
    {
      property: 'twitter:image',
      content: globalSettings.value?.shareImage ? useStrapiMedia(globalSettings.value?.shareImage ?? '') : '',
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        'name': globalSettings.value?.siteName,
        'url': useRequestURL().href,
        'description': globalSettings.value?.metaDescription,
        // "sameAs": [
        //   "https://www.instagram.com/yourprofile",
        //   "https://www.linkedin.com/company/yourcompany"
        // ],
        // "founders": [
        //   { "@type": "Person", "name": "John Doe" },
        //   { "@type": "Person", "name": "Jane Doe" }
        // ]
      }),
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
