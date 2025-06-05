<template>
  <q-img
    :src="src"
    :alt="props.alt"
    :width="props.width"
    :height="props.height"
  />
</template>

<script setup lang="ts">
const props = defineProps({
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
    default: undefined,
  },
  height: {
    type: [String],
    default: undefined,
  },
})
</script>
