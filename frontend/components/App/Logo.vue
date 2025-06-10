<template>
  <img
    v-once
    :src="logoSrc"
    :alt="globalSettings?.siteName"
    class="fit"
  >
</template>

<script setup lang="ts">
const { globalSettings } = useGlobalSettings()
const logoSrc = computed(() => {
  return globalSettings.value?.siteLogo ? useStrapiMedia(globalSettings.value?.siteLogo) : ''
})
</script>
