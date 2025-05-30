<template>
  <q-img
    v-bind="$props"
    :src="logoSrc"
    :alt="globalSettings?.siteName"
  />
</template>

<script setup lang="ts">
import type { QImgProps } from 'quasar'

const { globalSettings } = useGlobalSettings()

withDefaults(
  defineProps<QImgProps>(),
  {
    ratio: '1',
    noSpinner: true,
    loading: 'eager',
    fetchpriority: 'high',
    loadingShowDelay: 0,
  },
)

const logoSrc = computed(() => {
  return globalSettings.value?.siteLogo ? useStrapiMedia(globalSettings.value?.siteLogo) : ''
})
</script>
