<template>
  <img
    v-if="globalSettings?.siteLogo"
    :src="logoSrc"
    :alt="globalSettings?.siteName"
    width="60"
    height="60"
    class="fit site-logo"
  >
</template>

<script setup lang="ts">
const { globalSettings } = useGlobalSettings()
const logoSrc = computed(() => useStrapiMedia(globalSettings.value.siteLogo.replace(/^\/strapi/, '')))
</script>
