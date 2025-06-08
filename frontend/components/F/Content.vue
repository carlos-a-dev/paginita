<template>
  <q-card
    v-once
  >
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="result" />
  </q-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  data?: {
    body: string
  }
}>()

const { md } = useMarkdown()

const result = md.render(props.data?.body || '')
</script>
