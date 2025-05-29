<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Transparent Floating Header -->
    <app-header />

    <!-- Page Content -->
    <q-page-container style="padding-top: 0;">
      <slot />
    </q-page-container>
  </q-layout>
</template>
