<template>
  <q-layout view="hhh lpr fff">
    <app-header
      class="transparent"
    />

    <q-page-container
      class="row justify-center"
      :class="{ 'apply-xs-page-padding': $q.screen.xs }"
    >
      <slot />

      <!-- For Larger formats -->
      <app-nav-links
        class="gt-sm fixed-top-left q-mt-md z-top"
        style="left: 50%; transform: translateX(-50%);"
      />
      <!-- For Smaller formats -->
      <q-page-sticky
        position="bottom"
        class="lt-md"
      >
        <app-nav-links
          class="q-mb-lg"
        />
      </q-page-sticky>
    </q-page-container>

    <app-footer />
  </q-layout>
</template>

<style>
.q-page-container.apply-xs-page-padding > main.q-page {
  padding-bottom: 100px;
}
</style>
