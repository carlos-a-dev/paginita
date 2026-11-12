<template>
  <app-section :tone="data.tone">
    <div class="cta-block">
      <h2 class="section-title">
        {{ data.heading }}
      </h2>
      <p
        v-if="data.text"
        class="section-lead"
      >
        {{ data.text }}
      </p>
      <NuxtLink
        v-if="data.buttonLabel && data.link"
        :to="data.link"
        class="site-btn site-btn-primary"
      >
        {{ data.buttonLabel }}
        <q-icon
          name="arrow_forward"
          aria-hidden="true"
        />
      </NuxtLink>
    </div>
  </app-section>
</template>

<script setup lang="ts">
import type { CtaData } from '~/types/strapi/blocks'

defineProps<{ data: CtaData }>()
</script>
