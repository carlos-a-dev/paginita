<template>
  <ul
    v-if="items?.length"
    class="highlights"
    :class="`highlights-${variant}`"
  >
    <li
      v-for="item in items"
      :key="item.id ?? item.title"
      class="highlight"
    >
      <span
        v-if="item.icon"
        class="highlight-icon"
        aria-hidden="true"
      ><q-icon :name="item.icon" /></span>
      <span class="highlight-body">
        <component
          :is="linkTag(item.link)"
          v-bind="linkProps(item.link)"
          class="highlight-title"
        >{{ item.title }}</component>
        <span
          v-if="item.text"
          class="highlight-text"
        >{{ item.text }}</span>
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Highlight } from '~/types/strapi/blocks'

// inline: icon + short text in a row (hero trust points, contact details);
// cards: one card per item with a detail line; facts: large title over a caption.
withDefaults(defineProps<{ items?: Highlight[], variant?: 'inline' | 'cards' | 'facts' }>(), { variant: 'inline' })

const NuxtLink = resolveComponent('NuxtLink')
const external = (link: string) => /^(https?:|mailto:|tel:)/i.test(link)
const linkTag = (link?: string | null) => (link ? (external(link) ? 'a' : NuxtLink) : 'span')
const linkProps = (link?: string | null) => (link ? (external(link) ? { href: link } : { to: link }) : {})
</script>
