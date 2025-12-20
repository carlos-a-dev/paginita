<template>
  <q-btn-group
    class="q-py-sm q-px-xs"
  >
    <q-btn
      v-for="link in $q.screen.lt.sm ? links?.slice(0, 3) : links?.slice(0, 5)"
      :key="link.id"
      :label="link.label"
      :to="link.url"
      size="md"
      :color="$route.path === link.url ? 'primary' : undefined"
      :class="{ 'btn-active': $route.path === link.url }"
      class="q-mx-sm"
    />

    <q-btn-dropdown
      v-if="($q.screen.lt.sm && links && links?.length > 3) || (links && links?.length > 5)"
      auto-close
      size="md"
    >
      <q-list
        padding
      >
        <q-item
          v-for="link in $q.screen.lt.sm ? links?.slice(3) : links?.slice(5)"
          :key="link.id"
          clickable
          :to="link.url"
        >
          <q-item-section>
            <q-item-label>{{ link.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
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
