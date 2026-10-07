<template>
  <q-layout
    view="hHh lpr fff"
    class="site-layout"
  >
    <app-header />
    <q-page-container class="site-page-container">
      <slot />
    </q-page-container>
    <div class="mobile-navigation lt-md">
      <app-nav-links />
    </div>
    <app-footer />
  </q-layout>
</template>
