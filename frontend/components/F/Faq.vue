<template>
  <q-card class="faq-card">
    <q-card-section>
      <h2 class="section-heading">
        {{ data?.title }}
      </h2>
    </q-card-section>
    <q-card-section class="faq-list">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="faq-item"
      >
        <h3 class="faq-question">
          {{ item.question }}
        </h3>
        <p
          v-for="(paragraph, pIndex) in item.answer.split(/\n\s*\n/)"
          :key="pIndex"
          class="faq-answer"
        >
          {{ paragraph }}
        </p>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { faqItems, faqSchema, serializeSchema, webUrl } from '~/utils/seo'
import type { FaqItem } from '~/utils/seo'

const props = defineProps<{
  data?: {
    title?: string
    items?: FaqItem[]
  }
}>()

// Answers stay visible (no accordion) so readers, screen readers and crawlers get the full text.
const items = computed(() => faqItems(props.data?.items))

const config = useRuntimeConfig()
const route = useRoute()
const faqJsonLd = computed(() => {
  const siteUrl = webUrl(config.public.siteUrl, config.public.siteUrl, true)
  if (!siteUrl) return undefined
  const schema = faqSchema({ pageUrl: webUrl(route.path, siteUrl, true) || siteUrl, items: items.value })
  return schema && serializeSchema(schema)
})
useHead(() => ({
  script: faqJsonLd.value ? [{ key: 'seo-faq', type: 'application/ld+json', textContent: faqJsonLd.value }] : [],
}))
</script>
