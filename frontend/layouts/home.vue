<template>
  <q-layout view="hHh lpR fff">
    <app-header class="transparent" />

    <q-page-container style="padding-top: 0!important;">
      <slot />
    </q-page-container>

    <app-footer />
  </q-layout>
</template>
