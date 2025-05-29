<template>
  <component
    v-bind="$props"
    :is="component"
    v-if="component !== 'not-found'"
  />
</template>

<script setup lang="ts">
const $props = defineProps<{
  // eslint-disable-next-line vue/prop-name-casing
  __component: string
  [key: string]: unknown
}>()

const component = computed(() => {
  const componentName = $props.__component ? $props.__component.replace('.', '-') : 'not-found'
  return resolveComponent(componentName)
})
</script>
