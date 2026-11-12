<template>
  <app-section :tone="data.tone ?? 'dark'">
    <figure class="quote-block">
      <figcaption
        v-if="data.eyebrow"
        class="eyebrow"
      >
        {{ data.eyebrow }}
      </figcaption>
      <blockquote class="quote-text">
        {{ data.quote }}
      </blockquote>
    </figure>
  </app-section>
</template>

<script setup lang="ts">
import type { QuoteData } from '~/types/strapi/blocks'

defineProps<{ data: QuoteData }>()
</script>
