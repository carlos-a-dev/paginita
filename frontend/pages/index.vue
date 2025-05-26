<template>
  <q-page>
    <component-renderer v-for="(ccomponent, index) in homePage?.body" :key="index" v-bind="ccomponent" />
  </q-page>
</template>

<script lang="ts" setup>
import type { HomePage } from '~/types/homePage';

const { findOne } = useStrapi()

const { data: homePage } = await useAsyncData<HomePage>(
  'home-page',
  async () => (await findOne<HomePage>('home-page', {
    populate: {
      body: {
        populate: '*'
      }
    }
  })).data
)
</script>