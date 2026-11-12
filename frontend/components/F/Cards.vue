<template>
  <app-section :tone="data.tone">
    <div
      class="section-header"
      :class="{ 'section-header-centered': data.centered }"
    >
      <p
        v-if="data.eyebrow"
        class="eyebrow"
      >
        {{ data.eyebrow }}
      </p>
      <h2 class="section-title">
        {{ data.heading }}
      </h2>
      <p
        v-if="data.intro"
        class="section-lead"
      >
        {{ data.intro }}
      </p>
    </div>
    <component
      :is="numbered ? 'ol' : 'ul'"
      class="card-grid"
      :class="`card-grid-${data.style || 'plain'}`"
    >
      <li
        v-for="(card, index) in data.cards"
        :key="card.id ?? index"
        class="info-card"
      >
        <span
          v-if="numbered"
          class="step-number"
          aria-hidden="true"
        >{{ String(index + 1).padStart(2, '0') }}</span>
        <h3 class="info-card-title">
          {{ card.title }}
        </h3>
        <p class="info-card-text">
          {{ card.text }}
        </p>
      </li>
    </component>
  </app-section>
</template>

<script setup lang="ts">
import type { CardsData } from '~/types/strapi/blocks'

const props = defineProps<{ data: CardsData }>()
const numbered = computed(() => props.data.style === 'numbered')
</script>
