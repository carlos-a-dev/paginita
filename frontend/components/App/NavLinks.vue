<template>
  <q-btn-group
    class="q-py-sm q-px-xs"
  >
    <q-btn
      v-for="link in links"
      :key="link.id"
      :label="link.label"
      :to="link.url"
      size="md"
      :color="$route.path === link.url ? 'primary' : undefined"
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
.q-btn-group {
  backdrop-filter: blur(5px);
}

body.body--light .q-btn-group {
  background: hsla(0, 0%, 90%, .4);
}

body.body--dark .q-btn-group {
  background: hsla(0, 0%, 20%, .4);
}

.q-btn {
  border-radius: 28px !important;
  font-weight: bold;
}
</style>
