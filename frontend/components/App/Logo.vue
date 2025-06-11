<template>
  <img
    v-bind="imgProps"
    class="fit"
  >
</template>

<script setup lang="ts">
import type { QImgProps } from 'quasar'

const { globalSettings } = useGlobalSettings()

const props = defineProps<QImgProps>()

const imgProps = computed(() => {
  if (!globalSettings.value?.siteLogo) {
    return { src: undefined } // Ensure q-img doesn't complain if v-if was only on props.data.background
  }
  return useResponsiveImage(globalSettings.value?.siteLogo, globalSettings?.value.siteName, {
    sizes: props.width ? `xs:${props.width}` : 'xs:60px',
  })
})
</script>
