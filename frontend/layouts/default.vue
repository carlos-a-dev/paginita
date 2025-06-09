<template>
  <q-layout view="hhh lpR fff">
    <app-header
      class="transparent"
    />

    <q-page-container style="padding-top: 0!important;">
      <slot />
    </q-page-container>

    <app-footer />
  </q-layout>
</template>
