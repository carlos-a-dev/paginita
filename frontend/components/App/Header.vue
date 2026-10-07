<template>
  <q-header
    class="site-header"
    :class="$q.dark.isActive ? 'text-white' : 'text-dark'"
    height-hint="88"
  >
    <a
      href="#main-content"
      class="skip-link"
    >Skip to content</a>
    <q-toolbar class="site-toolbar">
      <NuxtLink
        to="/"
        class="site-brand"
        :aria-label="`${globalSettings?.siteName} home`"
      >
        <q-avatar size="46px"><app-logo /></q-avatar>
        <!-- eslint-disable vue/no-v-html -->
        <span
          class="site-brand-name"
          v-html="globalSettings?.siteNameStyled"
        />
        <!-- eslint-enable vue/no-v-html -->
      </NuxtLink>

      <app-nav-links class="desktop-navigation gt-sm" />

      <div class="site-header-actions">
        <social-networks class="gt-sm" />
        <app-dark-btn />
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
const { globalSettings } = useGlobalSettings()
</script>
