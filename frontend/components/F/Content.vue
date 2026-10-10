<template>
  <q-card
    v-once
    class="content-card"
  >
    <q-card-section>
      <!-- eslint-disable vue/no-v-html -->
      <div
        class="cms-prose"
        v-html="result"
      />
      <!-- eslint-enable vue/no-v-html -->
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { sanitizeCmsHtml } from '~/utils/sanitizeCmsHtml'

const props = defineProps<{
  data?: {
    body: string
    useStyledSiteName: boolean
  }
}>()

const { globalSettings } = useGlobalSettings()

const result = computed(() => {
  let md = useMarkdown().md.render(props.data?.body || '')

  if (
    props.data?.useStyledSiteName
    && globalSettings.value.siteNameStyled
    && globalSettings.value.siteName !== globalSettings.value.siteNameStyled
  ) {
    md = md.replaceAll(globalSettings.value.siteName, globalSettings.value.siteNameStyled)
  }

  return sanitizeCmsHtml(md)
})
</script>
