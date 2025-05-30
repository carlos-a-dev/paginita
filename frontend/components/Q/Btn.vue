<template>
  <quasar-btn
    v-bind="$props"
    :color="to && to === $r.path ? 'info' : color"
  />
</template>

<script setup lang="ts">
import { QBtn as QuasarBtn, type QBtnProps } from 'quasar'

defineProps<QBtnProps>()
const $r = useRoute()
</script>
