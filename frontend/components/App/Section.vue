<template>
  <section
    class="site-section"
    :class="`tone-${tone || 'default'}`"
  >
    <div class="section-inner">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
// A full-width page band. Tones: default (surface), muted (tinted), dark (navy).
defineProps<{ tone?: 'default' | 'muted' | 'dark' | null }>()
</script>
