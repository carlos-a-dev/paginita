<template>
  <q-card
    v-once
    class="q-pa-md q-pa-md-xl"
    style="border-radius: 2em;"
  >
    <div class="text-h4 text-center q-mb-xl">
      {{ data.title }}
    </div>
    <div class="q-gutter-y-lg row justify-center">
      <q-card
        v-for="service in services"
        :key="service.id"
        flat
        class="col-xs-12 col-sm-6 col-md-3 col-lg-2 q-pa-md text-center"
      >
        <q-icon
          :name="service.icon"
          size="64px"
          color="primary"
        />
        <div class="text-h6 q-mt-md">
          {{ service.title }}
        </div>
        <p class="text-body2">
          {{ service.description }}
        </p>
      </q-card>
    </div>
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
