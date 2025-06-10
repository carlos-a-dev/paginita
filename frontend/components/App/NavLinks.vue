<template>
  <q-btn-group
    flat
    class="text-dark q-py-sm q-px-xs"
    style="backdrop-filter: blur(5px); background: hsla(0, 0%, 90%, .5);"
  >
    <q-btn
      v-for="link in links"
      :key="link.id"
      :label="link.label"
      :to="link.url"
      size="md"
      :color="$route.path === link.url ? 'info' : undefined"
      :class="{ 'btn-active': $route.path === link.url }"
      class="q-mx-sm"
    />
  </q-btn-group>
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

<style scoped>
.q-btn {
  border-radius: 2em !important;
  font-weight: bold;
}
</style>
