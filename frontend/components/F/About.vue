<template>
  <q-card class="about-card q-pa-md">
    <q-card-section class="text-center">
      <div class="text-h2 q-mb-md">
        About Us
      </div>
      <div class="text-h6">
        {{ data.text }}
      </div>
    </q-card-section>

    <q-card-section class="q-gutter-md row justify-center">
      <q-card
        v-for="story in data.stories"
        :key="story.id"
        flat
        class="col-xs-12 col-sm-6 col-md-4 about-story-card"
      >
        <q-card-section class="text-center">
          <q-avatar
            v-if="story.avatarImage"
            size="100px"
            class="q-mb-md"
          >
            <img v-bind="useStrapiImage(story.avatarImage, { sizes: '100px' })">
          </q-avatar>
          <div class="text-h4">
            {{ story.name }}
          </div>
          <div class="text-body1 q-mt-sm">
            {{ story.text }}
          </div>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { MediaImage } from '~/types/strapi/strapi'

defineProps<{
  data: {
    text: string
    stories: {
      id: number
      avatarImage: MediaImage
      name: string
      text: string
    }[]
  }
}>()
</script>
