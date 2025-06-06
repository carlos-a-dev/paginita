<template>
  <q-card class="q-pa-xl">
    <MDC
      :value="body"
    />
  </q-card>
</template>

<script setup lang="ts">
const { body } = defineProps<{
  body: string
}>()
</script>
