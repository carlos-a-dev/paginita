<template>
  <q-card
    v-bind="$props"
    flat
  >
    <q-card-section>
      <MDC
        :value="body"
        tag="article"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { Component } from '~/types/strapi/strapi'

const { body } = defineProps<Component & {
  body: string
}>()
</script>
