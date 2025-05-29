<template>
  <q-header
    class="text-white"
    v-bind="$props"
    reveal
  >
    <q-toolbar>
      <q-avatar
        v-if="logoSrc"
        class="bg-white"
      >
        <img
          :src="logoSrc"
          :alt="globalSettings?.siteName"
        >
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
        to="About"
      />
      <q-btn
        flat
        label="Contact"
        to="/contact"
      />

      <q-space />

      <q-btn
        round
        flat
        icon="brightness_6"
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
        @click="toggleDarkMode()"
      />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { Dark } from 'quasar'

const { globalSettings } = useGlobalSettings()

const logoSrc = computed(() => {
  return globalSettings.value?.siteLogo ? useStrapiMedia(globalSettings.value?.siteLogo) : ''
})

const toggleDarkMode = () => {
  Dark.toggle()
  localStorage.setItem('dark-mode', Dark.isActive ? 'true' : 'false')
}
</script>
