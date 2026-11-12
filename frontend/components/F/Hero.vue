<template>
  <!-- Text beside an image (home), or a tinted page intro without one. -->
  <section
    v-if="variant !== 'overlay'"
    class="site-section"
    :class="variant === 'intro' ? 'tone-muted hero-intro' : 'tone-default hero-split'"
  >
    <div class="section-inner hero-split-inner">
      <div class="hero-split-text">
        <p
          v-if="data.eyebrow"
          :class="variant === 'split' ? 'hero-eyebrow' : 'eyebrow'"
        >
          {{ data.eyebrow }}
        </p>
        <h1
          v-if="data.title"
          class="hero-split-title"
        >
          {{ data.title }}
        </h1>
        <p
          v-if="data.message"
          class="hero-split-message"
        >
          {{ data.message }}
        </p>
        <div
          v-if="hasPrimary || hasSecondary"
          class="hero-actions"
        >
          <NuxtLink
            v-if="hasPrimary"
            :to="data.link"
            class="site-btn site-btn-primary"
          >
            {{ data.callToAction }}
            <q-icon
              name="arrow_forward"
              aria-hidden="true"
            />
          </NuxtLink>
          <NuxtLink
            v-if="hasSecondary"
            :to="data.secondaryLink!"
            class="site-btn site-btn-secondary"
          >
            {{ data.secondaryCallToAction }}
          </NuxtLink>
        </div>
        <app-highlights
          v-if="data.highlights?.length"
          :items="data.highlights"
          class="hero-highlights"
        />
      </div>
      <div
        v-if="variant === 'split' && data.background"
        class="hero-split-media"
        :class="{ 'hero-split-media-wide': wideImage }"
      >
        <img
          v-bind="splitImage"
          class="hero-split-image"
          fetchpriority="high"
          loading="eager"
          :width="data.background.width || 1200"
          :height="data.background.height || 800"
        >
      </div>
    </div>
  </section>

  <section
    v-else
    class="site-hero"
  >
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
import type { HeroData } from '~/types/strapi/blocks'

const props = defineProps<{ data: HeroData }>()

const variant = computed(() => props.data.variant || 'overlay')
const hasPrimary = computed(() => !!(props.data.callToAction && props.data.link))
const hasSecondary = computed(() => !!(props.data.secondaryCallToAction && props.data.secondaryLink))

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

// Wide images (logos, banners) are shown whole on a card instead of cropped.
const wideImage = computed(() => {
  const { width, height } = props.data.background || {}
  return !!(width && height && width / height > 1.8)
})

// Half the page width on desktop, full width on phones.
const splitImage = computed(() => {
  if (!props.data.background) return {}
  const image = useStrapiImage(props.data.background, { sizes: 'xs:100vw sm:100vw md:50vw lg:600px xl:600px' })
  return { ...image, alt: props.data.background.alternativeText || '' }
})
</script>
