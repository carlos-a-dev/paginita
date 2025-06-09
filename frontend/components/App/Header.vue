<template>
  <q-header
    :class="{ 'text-white': $q.dark.isActive, 'text-dark': !$q.dark.isActive }"
    v-bind="$props"
  >
    <q-toolbar>
      <q-avatar>
        <app-logo />
      </q-avatar>
      <q-toolbar-title>
        {{ globalSettings?.siteName }}
      </q-toolbar-title>

      <app-dark-btn />
    </q-toolbar>
    <app-nav-links
      class="fixed-top-left q-mt-sm"
      style="left: 50%; transform: translateX(-50%);"
    />
  </q-header>
</template>

<script setup lang="ts">
const { globalSettings } = useGlobalSettings()
</script>
