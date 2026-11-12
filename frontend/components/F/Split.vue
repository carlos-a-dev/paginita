<!-- eslint-disable vue/no-v-html -->
<template>
  <app-section :tone="data.tone">
    <div class="split">
      <div class="split-main">
        <p
          v-if="data.eyebrow"
          class="eyebrow"
        >
          {{ data.eyebrow }}
        </p>
        <h2 class="section-title">
          {{ data.heading }}
        </h2>
        <div
          v-if="body"
          class="section-body cms-prose"
          v-html="body"
        />
      </div>
      <div class="split-aside">
        <div
          v-if="items.length && data.asideTitle"
          class="checklist-card"
        >
          <h3 class="checklist-title">
            {{ data.asideTitle }}
          </h3>
          <ul class="checklist">
            <li
              v-for="item in items"
              :key="item"
            >
              <span
                class="check"
                aria-hidden="true"
              ><q-icon name="check" /></span>{{ item }}
            </li>
          </ul>
        </div>
        <ul
          v-else-if="items.length"
          class="checklist checklist-cards"
        >
          <li
            v-for="item in items"
            :key="item"
          >
            <span
              class="check"
              aria-hidden="true"
            ><q-icon name="check" /></span>{{ item }}
          </li>
        </ul>
        <app-highlights
          v-if="data.facts?.length"
          :items="data.facts"
          :variant="data.facts.some(fact => fact.icon) ? 'cards' : 'facts'"
        />
      </div>
    </div>
  </app-section>
</template>

<script setup lang="ts">
import type { SplitData } from '~/types/strapi/blocks'

const props = defineProps<{ data: SplitData }>()
const render = useCmsHtml()
const body = computed(() => render(props.data.body))
// One checklist item per line.
const items = computed(() => (props.data.asideItems || '').split('\n').map(line => line.trim()).filter(Boolean))
</script>
