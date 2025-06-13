<template>
  <q-header
    :class="$q.dark.isActive ? 'text-white' : 'text-dark'"
    class="q-px-md-lg"
    v-bind="$props"
    height-hint="90px"
    style="height: 90px;"
  >
    <q-toolbar class="full-height">
      <q-avatar size="60px">
        <NuxtLink to="/">
          <app-logo />
        </NuxtLink>
      </q-avatar>

      <q-toolbar-title>
        <h2>
          {{ globalSettings?.siteName }}
        </h2>
      </q-toolbar-title>

      <lazy-app-dark-btn />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
const { globalSettings } = useGlobalSettings()
</script>
