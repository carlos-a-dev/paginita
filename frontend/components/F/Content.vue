<template>
  <q-card
    v-once
    class="q-pa-xl"
  >
    <MDC
      :value="data.body"
    />
  </q-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    data?: {
      body: string
    }
  }>(),
  {
    data: () => ({
      body: '',
    }),
  },
)
</script>
