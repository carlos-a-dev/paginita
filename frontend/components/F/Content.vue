<template>
  <q-card class="q-pa-xl">
    <MDC
      :value="body"
    />
  </q-card>
</template>

<script setup lang="ts">
import type { Component } from '~/types/strapi/strapi'

const { body } = defineProps<Component & {
  body: string
}>()
</script>
