<template>
  <q-card style="border-radius: 2em;">
    <q-img
      v-if="props.data.background && imgProps.src"
      v-bind="imgProps"
      fetchpriority="high"
      loading="eager"
      fit="cover"
      height="80vh"
    >
      <div class="fit flex flex-center text-center transparent">
        <div
          class="q-pa-xs-none q-pa-sm-lg q-pa-md-xl"
        >
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
  return props.data.background
    ? useStrapiImage(props.data.background, {
        sizes: 'xs:125vw sm:100vw md:100vw lg:100vw xl:100vw',
      })
    : {
        src: 'notFound.jpg',
        alt: 'not found',
      }
})
</script>
