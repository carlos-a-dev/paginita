<template>
  <section class="site-hero">
    <q-img
      v-if="props.data.background"
      v-bind="imgProps"
      fetchpriority="high"
      loading="eager"
      class="hero-image"
      height="100%"
      no-transition
      @error="imageError = true"
    />
    <div class="hero-overlay">
      <div
        class="hero-content"
        :class="highlightClass"
      >
        <h1
          v-if="data.title"
          class="hero-title"
        >
          {{ data.title }}
        </h1>
        <p
          v-if="data.message"
          class="hero-message"
        >
          {{ data.message }}
        </p>
        <q-btn
          v-if="data.callToAction && data.link"
          unelevated
          color="primary"
          :label="data.callToAction"
          class="hero-cta"
          icon-right="arrow_forward"
          :to="data.link"
          size="md"
        />
      </div>
    </div>
  </section>
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
    highlight?: 'dark' | 'light' | 'none'
  }
}>()

const highlightClass = computed(() => {
  switch (props.data.highlight) {
    case 'dark':
      return 'transparent-dark'
    case 'light':
      return 'transparent-light'
    case 'none':
    default:
      return ''
  }
})

const imageError = ref(false)

const imgProps = computed(() => {
  if (!props.data.background) {
    return { src: undefined } // Ensure q-img doesn't complain if v-if was only on props.data.background
  }
  if (imageError.value) {
    return { src: useStrapiMedia(props.data.background.url), alt: props.data.background.alternativeText || '' }
  }
  return useStrapiImage(props.data.background, {
    sizes: 'xs:125vw sm:100vw md:100vw lg:100vw xl:100vw',
  })
})
</script>
