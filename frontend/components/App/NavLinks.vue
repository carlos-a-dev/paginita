<template>
  <q-btn-group
    flat
    class="text-dark"
    style="backdrop-filter: blur(8px); background: hsla(0, 0%, 100%, .7);"
  >
    <q-btn
      v-for="link in links"
      :key="link.id"
      :label="link.label"
      :to="link.url"
      :color="$route.path === link.url ? 'info' : undefined"
      :class="{ 'btn-active': $route.path === link.url }"
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
.btn-active {
  background: linear-gradient(90deg, #42a5f5 0%, #478ed1 100%);
  color: #fff !important;
  font-weight: bold;
}
</style>
