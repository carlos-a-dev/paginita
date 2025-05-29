<template>
  <q-page>
    <component-renderer v-for="(ccomponent, index) in homePage?.body" :key="index" v-bind="ccomponent" />
  </q-page>
</template>

<script lang="ts" setup>
import type { HomePageResponse } from '~/types/strapi/homePage';

const { findOne } = useStrapi()

const { data: homePage } = await useAsyncData<HomePageResponse>(
  'home-page',
  async () => (await findOne<HomePageResponse>('home-page', {
    populate: {
      body: {
        populate: '*'
      }
    }
  })).data
)
</script>