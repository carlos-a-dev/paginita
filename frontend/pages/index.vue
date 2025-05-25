<template>
  <component-carousel v-for="(carousel, index) in homePage?.body" :key="index" :strapi-data="carousel" />
</template>

<script lang="ts" setup>

const { data: homePage } = await useAsyncData(
  'home-page',
  async () => (await useStrapi().single('home-page').find({
    populate: {
      body: {
        on: {
          'shared.rich-text': {
            populate: '*'
          },
          'component.carousel': {
            populate: '*'
          }
        }
      },
    }
  })).data
)
</script>