<template>
  <component
    v-bind="$props"
    :is="component"
    v-if="component !== null"
  />
</template>

<script setup lang="ts">
import type { Component } from '~/types/strapi/strapi'

const $props = defineProps<Component>()

const component = computed(() => {
  const componentName = $props.__component.replace('.', '-')
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  const component = resolveComponent(componentName)

  return typeof component === 'string' ? null : component
})
</script>
