<!-- eslint-disable vue/no-v-html -->
<template>
  <app-section
    id="faq"
    class="faq-section"
  >
    <div class="split split-top">
      <div class="split-main faq-intro">
        <p
          v-if="data?.eyebrow"
          class="eyebrow"
        >
          {{ data.eyebrow }}
        </p>
        <h2 class="section-title">
          {{ data?.title }}
        </h2>
        <div
          v-if="intro"
          class="section-body cms-prose"
          v-html="intro"
        />
      </div>
      <div class="faq-list">
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
      </div>
    </div>
  </app-section>
</template>

<script setup lang="ts">
import { faqItems, faqSchema, serializeSchema, webUrl } from '~/utils/seo'
import type { FaqItem } from '~/utils/seo'

const props = defineProps<{
  data?: {
    title?: string
    eyebrow?: string | null
    intro?: string | null
    items?: FaqItem[]
  }
}>()

// Answers stay visible (no accordion) so readers, screen readers and crawlers get the full text.
const items = computed(() => faqItems(props.data?.items))
const render = useCmsHtml()
const intro = computed(() => render(props.data?.intro))

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
