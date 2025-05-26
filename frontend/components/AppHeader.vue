<template>
  <q-header class="transparent text-white">
    <q-toolbar>
      <q-avatar class="bg-white">
        <img :src="useStrapiMedia(global?.siteLogo.formats.thumbnail?.url ?? global?.siteLogo.url ?? '')"
          :alt="global?.siteLogo.alternativeText ?? ''" />
      </q-avatar>
      <q-toolbar-title>
        {{ global?.siteName }}
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
const { global } = useGlobalSettings()
</script>