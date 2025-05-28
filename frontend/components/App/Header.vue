<template>
  <q-header class="transparent text-white">
    <q-toolbar>
      <q-avatar v-if="logoSrc" class="bg-white">
        <img :src="logoSrc" :alt="globalSettings?.siteName" />
      </q-avatar>
      <q-toolbar-title>
        {{ globalSettings?.siteName }}
      </q-toolbar-title>

      <q-btn round flat icon="brightness_6" @click="$q.dark.toggle()" aria-label="Toggle dark mode"
        title="Toggle dark mode" />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
const { globalSettings } = useGlobalSettings()

const logoSrc = computed(() => {
  return globalSettings.value?.siteLogo ? useStrapiMedia(globalSettings.value?.siteLogo) : ''
})
</script>