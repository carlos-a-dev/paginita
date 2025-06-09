<template>
  <q-card
    v-once
    class="q-pa-xl text-white flex flex-center window-height hero"
    style="border-radius: 2em;"
    :style="style"
    :class="classes"
    flat
  >
    <div class="text-center">
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
  </q-card>
</template>

<script setup lang="ts">
import type { MediaImage } from '~/types/strapi/strapi'

const { data } = defineProps<{
  data: {
    title?: string
    message?: string
    callToAction?: string
    link?: string
    background?: MediaImage
  }
}>()

const classes = computed(() => {
  return {
    'bg-primary': !data.background?.url,
  }
})

const style = computed(() => {
  return data.background?.url
    ? {
        backgroundImage: `url('${useStrapiMedia(data.background?.url)}')`,
      }
    : null
})
</script>

<style scoped>
.hero {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
</style>
