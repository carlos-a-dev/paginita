<template>
  <q-layout view="hhh lpr fff">
    <app-header
      class="transparent"
    />

    <q-page-container style="min-height: 120vh;">
      <slot />
    </q-page-container>

    <app-footer />
  </q-layout>
</template>
