<template>
  <q-header class="bg-grey text-white">
    <q-toolbar>
      <q-toolbar-title>
        <q-avatar>
          <img :src="useStrapiMedia(global?.siteLogo.formats.thumbnail?.url ?? global?.siteLogo.url ?? '')"
            :alt="global?.siteLogo.alternativeText ?? ''" />
        </q-avatar>
        {{ global?.siteName }}
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
const { global } = useGlobalSettings()
</script>