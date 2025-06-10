<template>
  <q-card>
    <q-img
      :src="data.background ? useStrapiMedia(data.background.url) : undefined"
      :srcset="imageSrcset"
      :sizes="imageSizes"
      :alt="data.background?.alternativeText ?? ''"
    />
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MediaImage } from '~/types/strapi/strapi'
// Assuming useStrapiMedia is auto-imported or globally available

const { data } = defineProps<{
  data: {
    title?: string
    message?: string
    callToAction?: string
    link?: string
    background?: MediaImage
  }
}>()

const imageSrcset = computed<string | undefined>(() => {
  if (!data.background) {
    return undefined
  }

  const sources: string[] = []
  const addedUrls = new Set<string>() // To prevent duplicate URLs

  // Add formatted images
  if (data.background.formats) {
    for (const key in data.background.formats) {
      const format = data.background.formats[key as keyof typeof data.background.formats]
      if (format && format.url && typeof format.width === 'number') {
        const fullUrl = useStrapiMedia(format.url)
        if (!addedUrls.has(fullUrl)) {
          sources.push(`${fullUrl} ${format.width}w`)
          addedUrls.add(fullUrl)
        }
      }
    }
  }

  // Add the original image itself if it has a width and URL, and is not already added
  if (data.background.url && typeof data.background.width === 'number') {
    const originalFullUrl = useStrapiMedia(data.background.url)
    if (!addedUrls.has(originalFullUrl)) {
      sources.push(`${originalFullUrl} ${data.background.width}w`)
    }
  }
  return sources.length > 0 ? sources.join(', ') : undefined
})

const imageSizes = computed<string | undefined>(() => {
  // For a hero image, "100vw" (100% of viewport width) is a common and effective value.
  // Provide sizes if there's an image source available.
  if (data.background?.url || (data.background?.formats && Object.keys(data.background.formats).length > 0)) {
    return '100vw'
  }
  return undefined
})
</script>
