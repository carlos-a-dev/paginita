<template>
  <q-card class="about-card">
    <q-card-section class="text-center">
      <h2 class="section-heading">
        About Us
      </h2>
      <div class="section-intro">
        {{ data.text }}
      </div>
    </q-card-section>

    <q-card-section class="stories-grid">
      <q-card
        v-for="story in data.stories"
        :key="story.id"
        flat
        class="about-story-card"
      >
        <q-card-section class="text-center">
          <q-avatar
            v-if="story.avatarImage"
            size="100px"
            class="q-mb-md"
          >
            <img v-bind="useStrapiImage(story.avatarImage, { sizes: '100px' })">
          </q-avatar>
          <div class="story-name">
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
