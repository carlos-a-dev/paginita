<template>
  <nav
    aria-label="Main navigation"
    class="site-navigation"
  >
    <q-btn
      v-for="link in links?.slice(0, primary)"
      :key="link.id"
      :label="link.label"
      :to="link.url"
      :class="{ 'navigation-active': $route.path === link.url }"
      flat
      no-caps
      :aria-current="$route.path === link.url ? 'page' : undefined"
    />

    <q-btn-dropdown
      v-if="links && links?.length > primary"
      auto-close
      flat
      aria-label="More pages"
      label="More"
    >
      <q-list
        padding
      >
        <q-item
          v-for="link in links?.slice(primary)"
          :key="link.id"
          clickable
          :active="$route.path === link.url"
          :aria-current="$route.path === link.url ? 'page' : undefined"
          :to="link.url"
        >
          <q-item-section>
            <q-item-label>{{ link.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </nav>
</template>

<script setup lang="ts">
import type { NavigationLink } from '~/types/strapi/navigationLink'

// Links shown before the More menu; the narrow mobile bar fits three.
withDefaults(defineProps<{ primary?: number }>(), { primary: 3 })

const { data: links } = useAsyncData('nav-links', async () => {
  return (await useStrapi().findOne<NavigationLink>('navigation-link', '', {
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
