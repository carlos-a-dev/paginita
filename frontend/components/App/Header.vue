<template>
  <q-header
    :class="{ 'text-white': $q.dark.isActive, 'text-dark': !$q.dark.isActive }"
    v-bind="$props"
    height-hint="70px"
    style="height: 70px;"
  >
    <q-toolbar
      class="fit q-px-lg"
    >
      <q-avatar
        size="60px"
      >
        <NuxtLink to="/">
          <app-logo to="/" />
        </NuxtLink>
      </q-avatar>
      <q-toolbar-title class="text-h2">
        {{ globalSettings?.siteName }}
      </q-toolbar-title>

      <lazy-app-dark-btn />
    </q-toolbar>
    <ClientOnly>
      <transition
        appear
        mode="out-in"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        :duration="100"
      >
        <app-nav-links
          class="q-mb-sm q-mt-md"
          :class="[$q.screen.gt.sm ? 'fixed-top-left' : 'fixed-bottom-left']"
          style="left: 50%; transform: translateX(-50%);"
        />
      </transition>
    </ClientOnly>
  </q-header>
</template>

<script setup lang="ts">
const { globalSettings } = useGlobalSettings()
</script>
