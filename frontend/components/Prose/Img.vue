<template>
  <img
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :decoding="decoding"
  >
</template>

<script setup lang="ts">
defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
  width: {
    type: [String],
    default: '100%',
  },
  height: {
    type: [String],
    default: 'auto',
  },
  loading: {
    type: String as () => 'lazy' | 'eager',
    default: 'lazy',
  },
  decoding: {
    type: String as () => 'sync' | 'async' | 'auto',
    default: 'async',
  },
})
</script>
