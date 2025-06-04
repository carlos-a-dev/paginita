<template>
  <q-btn
    v-for="link in links"
    :key="link.id"
    flat
    :label="link.label"
    :to="link.url"
  />
</template>

<script setup lang="ts">
import type { NavigationLink } from '~/types/strapi/navigationLink'

const { data: links } = useAsyncData('nav-links', async () => {
  return (await useStrapi().findOne<NavigationLink>('navigation-link', {
    populate: {
      links: {
        filters: {
          visible: {
            $eq: true,
          },
        },
      },
    },
  })).data.links
})
</script>
