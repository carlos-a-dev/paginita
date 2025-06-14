<template>
  <q-card
    v-once
    class="q-pa-xs q-pa-md-xl"
  >
    <q-card-section class="text-h3 text-center">
      {{ data.title }}
    </q-card-section>
    <q-card-section class="q-gutter-y-lg row justify-center">
      <q-card
        v-for="service in services"
        :key="service.id"
        flat
        class="col-xs-12 col-sm-6 col-md-3 col-lg-2 text-center"
      >
        <q-card-section>
          <q-icon
            :name="service.icon"
            size="64px"
            color="secondary"
          />
          <div class="text-h4 text-weight-regular q-mt-md">
            {{ service.title }}
          </div>
          <p class="text-plus-1 text-weight-light">
            {{ service.description }}
          </p>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { Service, ServiceList } from '~/types/strapi/serviceList'

defineProps<{
  data: {
    title: string
  }
}>()

const { data: services } = await useAsyncData<Partial<Service>[]>(
  async () => {
    const serviceList = useState<Partial<ServiceList>[] | null>('service-list')
    if (!serviceList.value) {
      serviceList.value = (await useStrapi().findOne<ServiceList>('service-list', {
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
</script>
