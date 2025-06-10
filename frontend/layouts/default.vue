<template>
  <q-layout view="hhh lpR fff">
    <app-header
      class="transparent"
    />

    <q-page-container>
      <slot />
    </q-page-container>

    <app-footer />
  </q-layout>
</template>
