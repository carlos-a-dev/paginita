<template>
  <q-footer class="site-footer">
    <div class="site-footer-inner">
      <NuxtLink
        to="/"
        class="site-brand"
        :aria-label="`${globalSettings?.siteName} home`"
      >
        <q-avatar
          v-if="globalSettings?.siteLogo"
          size="38px"
        ><app-logo /></q-avatar>
        <span class="site-footer-brand">{{ globalSettings?.siteName }}</span>
      </NuxtLink>
      <social-networks />
      <p class="site-copyright">
        &copy; {{ new Date().getFullYear() }} {{ globalSettings?.siteName }}. All rights reserved.
      </p>
    </div>
  </q-footer>
</template>

<script setup lang="ts">
const { globalSettings } = useGlobalSettings()
</script>
