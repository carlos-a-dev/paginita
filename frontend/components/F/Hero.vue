<template>
  <q-card style="border-radius: 2em;">
    <q-img
      v-if="props.data.background && imgProps.src"
      v-bind="imgProps"
      fetchpriority="high"
      loading="eager"
      class="hero-img"
      fit="cover"
      :ratio="$q.screen.width / $q.screen.height"
      :height="$q.screen.height - 80 + 'px'"
    >
      <div class="fit flex flex-center text-center transparent">
        <div :class="[$q.screen.gt.xs ? 'q-pa-xl' : 'q-pa-none']">
          <h1
            v-if="data.title"
            class="text-h2 text-bold"
          >
            {{ data.title }}
          </h1>
          <p
            v-if="data.message"
            class="text-h4 q-mt-md"
          >
            {{ data.message }}
          </p>
          <q-btn
            v-if="data.callToAction && data.link"
            unelevated
            color="secondary"
            :label="data.callToAction"
            class="q-mt-lg"
            :to="data.link"
            size="lg"
          />
        </div>
      </div>
    </q-img>
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
