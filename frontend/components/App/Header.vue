<template>
  <q-header
    :class="{ 'text-white': $q.dark.isActive, 'text-dark': !$q.dark.isActive }"
    v-bind="$props"
    height-hint="70px"
    style="height: 70px;"
  >
    <q-toolbar
      class="fit q-px-lg"
    >
      <q-avatar
        size="60px"
      >
        <NuxtLink to="/">
          <app-logo to="/" />
        </NuxtLink>
      </q-avatar>
      <q-toolbar-title class="text-h2">
        {{ globalSettings?.siteName }}
      </q-toolbar-title>

      <app-dark-btn />
    </q-toolbar>
    <app-nav-links
      class="fixed-top-left q-mt-md gt-sm"
      style="left: 50%; transform: translateX(-50%);"
    />
  </q-header>
</template>

<script setup lang="ts">
const { globalSettings } = useGlobalSettings()
</script>
