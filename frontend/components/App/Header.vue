<template>
  <q-header
    class="text-white"
    v-bind="$props"
    reveal
  >
    <q-toolbar>
      <q-avatar
        class="bg-white"
      >
        <app-logo />
      </q-avatar>
      <q-toolbar-title>
        {{ globalSettings?.siteName }}
      </q-toolbar-title>

      <q-btn
        flat
        label="Home"
        to="/"
      />
      <q-btn
        flat
        label="About"
        to="/about"
      />
      <q-btn
        flat
        label="Contact"
        to="/contact"
      />

      <q-space />

      <app-dark-btn />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
const { globalSettings } = useGlobalSettings()
</script>
