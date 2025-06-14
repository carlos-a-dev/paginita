<template>
  <q-card
    v-once
  >
    <q-card-section>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="result" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
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

  return md
})
</script>
