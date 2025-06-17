<template>
  <q-card class="about-card q-pa-md">
    <q-card-section class="text-center">
      <div class="text-h4 text-weight-bold q-mb-md">
        About Us
      </div>
      <div class="text-body1 text-weight-light">
        A description
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
            size="80px"
            class="q-mb-md"
          >
            <img :src="story.avatarImage.url">
          </q-avatar>
          <div class="text-h6 text-weight-medium">
            {{ story.name }}
          </div>
          <div class="text-body2 text-weight-light q-mt-sm">
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
    stories: {
      id: number
      avatarImage: MediaImage
      name: string
      text: string
    }[]
  }
}>()
</script>
