<template>
  <q-card>
    <q-img
      v-if="props.data.background"
      v-bind="imgProps"
      fetchpriority="high"
      loading="eager"
      height="80vh"
      no-transition
    >
      <div class="fit flex flex-center text-center transparent">
        <div
          class="q-px-xs-md q-py-xs-lg q-pa-sm-lg q-pa-md-xl rounded-borders"
          :class="highlightClass"
        >
          <h1
            v-if="data.title"
            :class="$q.screen.gt.xs ? 'text-h2' : 'text-h3'"
            class="q-my-none"
          >
            {{ data.title }}
          </h1>
          <p
            v-if="data.message"
            class="q-mt-md"
            :class="$q.screen.gt.xs ? 'text-h4' : 'text-h5'"
          >
            {{ data.message }}
          </p>
          <q-btn
            v-if="data.callToAction && data.link"
            unelevated
            color="primary"
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

const imgProps = computed(() => {
  if (!props.data.background) {
    return { src: undefined } // Ensure q-img doesn't complain if v-if was only on props.data.background
  }
  return useStrapiImage(props.data.background, {
    sizes: 'xs:125vw sm:100vw md:100vw lg:100vw xl:100vw',
  })
})
</script>
