<template>
  <component v-for="(ccomponent, index) in homePage?.body" :key="index"
    :is="resolveComponent(ccomponent.__component.replace('.', '-'))" :strapi-data="ccomponent" />
</template>

<script lang="ts" setup>
const { findOne } = useStrapi()

const { data: homePage } = await useAsyncData(
  'home-page',
  async () => (await findOne('home-page', {
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