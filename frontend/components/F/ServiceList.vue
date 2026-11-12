<template>
  <q-card
    v-once
    class="services-card"
  >
    <q-card-section class="section-heading">
      {{ data.title }}
    </q-card-section>
    <q-card-section class="services-grid">
      <q-card
        v-for="service in services"
        :key="service.id"
        flat
        class="service-card"
      >
        <q-card-section>
          <div class="service-icon">
            <q-icon
              :name="service.icon === 'rule_settings' ? 'settings' : service.icon"
              size="32px"
              color="primary"
              aria-hidden="true"
            />
          </div>
          <h3 class="service-title">
            {{ service.title?.replace(/^[^\p{L}\p{N}]+/u, '') }}
          </h3>
          <p class="service-description">
            {{ service.description }}
          </p>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { Service, ServiceList } from '~/types/strapi/serviceList'
import { serializeSchema, servicesSchema, webUrl } from '~/utils/seo'

defineProps<{
  data: {
    title: string
  }
}>()

const { data: services } = await useAsyncData<Partial<Service>[]>(
  async () => {
    const serviceList = useState<Partial<Service>[] | null>('service-list')
    if (!serviceList.value) {
      serviceList.value = (await useStrapi().findOne<ServiceList>('service-list', '', {
        populate: {
          services: {
            fields: ['id', 'title', 'description', 'icon'],
            filters: { visible: { $eq: true } },
          },
        },
      })).data.services || []
    }

    return serviceList.value
  },
)

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
