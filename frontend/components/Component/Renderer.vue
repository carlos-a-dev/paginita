<template>
    <component v-if="component !== 'not-found'" v-bind="$props" :is="component" />
</template>

<script setup lang="ts">
const $props = defineProps<{
    __component: string,
    [key: string]: any
}>()

const component = computed(() => {
    const componentName = $props.__component ? $props.__component.replace('.', '-') : 'not-found'
    return resolveComponent(componentName)
})
</script>