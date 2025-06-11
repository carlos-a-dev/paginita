<template>
  <q-card
    v-once
  >
    <q-card-section>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="result" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  data?: {
    body: string
  }
}>()

const result = useMarkdown().md.render(props.data?.body || '')
</script>
