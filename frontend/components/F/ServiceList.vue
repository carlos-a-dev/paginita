<template>
  <app-section
    v-once
    id="services"
    tone="muted"
    class="services-section"
  >
    <div class="section-header">
      <p
        v-if="data.eyebrow"
        class="eyebrow"
      >
        {{ data.eyebrow }}
      </p>
      <h2 class="section-title">
        {{ data.title }}
      </h2>
    </div>
    <div
      v-for="group in groups"
      :key="group.name"
      class="service-group"
    >
      <h3
        v-if="group.name"
        class="service-group-title"
      >
        {{ group.name }}
      </h3>
      <div class="services-grid">
        <article
          v-for="service in group.services"
          :key="service.id"
          class="service-card"
        >
          <div
            class="service-icon"
            aria-hidden="true"
          >
            <q-icon
              :name="service.icon === 'rule_settings' ? 'settings' : service.icon"
              size="28px"
            />
          </div>
          <h4 class="service-title">
            {{ service.title?.replace(/^[^\p{L}\p{N}]+/u, '') }}
          </h4>
          <p class="service-description">
            {{ service.description }}
          </p>
        </article>
      </div>
    </div>
  </app-section>
</template>

<script setup lang="ts">
import type { Service, ServiceList } from '~/types/strapi/serviceList'
import { serializeSchema, servicesSchema, webUrl } from '~/utils/seo'

defineProps<{
  data: {
    title: string
    eyebrow?: string | null
  }
}>()

const { data: services } = await useAsyncData<Partial<Service>[]>(
  async () => {
    const serviceList = useState<Partial<Service>[] | null>('service-list')
    if (!serviceList.value) {
      serviceList.value = (await useStrapi().findOne<ServiceList>('service-list', '', {
        populate: {
          services: {
            fields: ['id', 'title', 'description', 'icon', 'group'],
            filters: { visible: { $eq: true } },
          },
        },
      })).data.services || []
    }

    return serviceList.value
  },
)

// Services in CMS order, grouped by their group name (in order of first appearance).
const groups = computed(() => {
  const byName = new Map<string, Partial<Service>[]>()
  for (const service of services.value || []) {
    const name = service.group?.trim() || ''
    byName.set(name, [...(byName.get(name) || []), service])
  }
  return [...byName].map(([name, list]) => ({ name, services: list }))
})

const config = useRuntimeConfig()
const route = useRoute()
const { globalSettings } = useGlobalSettings()
const servicesJsonLd = computed(() => {
  const siteUrl = webUrl(config.public.siteUrl, config.public.siteUrl, true)
  if (!siteUrl) return undefined
  const schema = servicesSchema({
    siteUrl,
    pageUrl: webUrl(route.path, siteUrl, true) || siteUrl,
    services: services.value || [],
    areaServed: globalSettings.value?.organization?.areaServed,
  })
  return schema && serializeSchema(schema)
})
useHead(() => ({
  script: servicesJsonLd.value ? [{ key: 'seo-services', type: 'application/ld+json', textContent: servicesJsonLd.value }] : [],
}))
</script>
