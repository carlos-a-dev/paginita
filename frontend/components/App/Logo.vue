<template>
  <img
    v-if="globalSettings?.siteLogo"
    :src="logoSrc"
    :alt="alt"
    width="60"
    height="60"
    class="fit site-logo"
  >
</template>

<script setup lang="ts">
// Decorative by default: the header and footer links already name the site, so
// an alt text here would be read twice. Pass alt when the logo stands alone.
withDefaults(defineProps<{ alt?: string }>(), { alt: '' })
const { globalSettings } = useGlobalSettings()
const logoSrc = computed(() => useStrapiMedia(globalSettings.value.siteLogo.replace(/^\/strapi/, '')))
</script>
