<template>
  <component
    :is="component"
    v-if="component"
    v-bind="$props.props"
    :data="$props.data"
  />
</template>

<script setup lang="ts">
import type { Component } from '~/types/strapi/strapi'

const rProps = defineProps<Component & {
  lazy?: boolean
  props?: Record<string, unknown>
  data?: Record<string, unknown>
}>()

const component = computed(() => {
  const key = rProps.__component

  if (!key || !key.startsWith('f.')) return null

  // Convert "f.section-title" to "SectionTitle"
  const componentName = (rProps.lazy ? 'Lazy' : '') + key
    .replace('.', '-')
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  // Eager fallback for already-loaded/auto-imported component
  try {
    const component = resolveComponent(componentName)
    console.debug(`[DynamicComponent] Loaded component: ${componentName}`)
    return typeof component === 'string' ? null : componentName
  }
  catch (err) {
    console.warn(`[DynamicComponent] Component not found: ${componentName}`)
    console.warn(err)
    return null
  }
})
</script>
