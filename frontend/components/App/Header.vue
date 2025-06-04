<template>
  <q-header
    class="text-white"
    v-bind="$props"
    reveal
  >
    <q-toolbar>
      <q-avatar style="background-color: rgba(255, 255, 255, 0.8);">
        <app-logo />
      </q-avatar>
      <q-toolbar-title>
        {{ globalSettings?.siteName }}
      </q-toolbar-title>

      <app-nav-links />

      <q-space />

      <app-dark-btn />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
const { globalSettings } = useGlobalSettings()
</script>
