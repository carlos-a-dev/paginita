<template>
  <q-card>
    <q-img
      v-if="props.data.background && imgProps.src"
      v-bind="imgProps"
      fetchpriority="high"
      loading="eager"
    />
  </q-card>
</template>

<script setup lang="ts">
import type { MediaImage } from '~/types/strapi/strapi'

const props = defineProps<{
  data: {
    title?: string
    message?: string
    callToAction?: string
    link?: string
    background?: MediaImage
  }
}>()

const imgProps = computed(() => {
  return useResponsiveImage({
    image: props.data.background,
    sizes: '100vw', // Hero images typically span the full viewport width
  })
})
</script>
