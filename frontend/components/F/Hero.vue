<template>
  <q-card>
    <q-img
      v-if="props.data.background"
      :src="responsiveImage.src.value"
      :srcset="responsiveImage.srcset.value"
      :sizes="responsiveImage.sizes.value"
      :alt="responsiveImage.alt.value"
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

const responsiveImage = useResponsiveImage({
  image: computed(() => props.data.background),
  sizes: '100vw', // Hero images typically span the full viewport width
})
</script>
