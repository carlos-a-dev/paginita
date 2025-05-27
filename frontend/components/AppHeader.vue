<template>
  <q-header class="transparent text-white">
    <q-toolbar>
      <q-avatar v-if="logoSrc" class="bg-white">
        <img :src="logoSrc" :alt="global?.siteName" />
      </q-avatar>
      <q-toolbar-title>
        {{ global?.siteName }}
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
const { global } = useGlobalSettings()

const logoSrc = computed(() => {
  return global.value?.siteLogo?.url ? useStrapiMedia(global.value.siteLogo.url + '?' + global.value.siteName) : ''
})
</script>