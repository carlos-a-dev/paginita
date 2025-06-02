<template>
  <component
    v-bind="$props"
    :is="component"
    v-if="component !== 'not-found'"
  />
</template>

<script setup lang="ts">
import type { Component } from '~/types/strapi/strapi'

const $props = defineProps<Component>()

const component = computed(() => {
  const componentName = $props.__component ? $props.__component.replace('.', '-') : 'not-found'
  return resolveComponent(componentName)
})
</script>
