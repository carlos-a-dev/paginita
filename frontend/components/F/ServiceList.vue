<template>
  <div class="q-pa-xl">
    <div class="text-h4 text-center q-mb-xl">
      {{ title }}
    </div>
    <div class="q-gutter-xl row justify-center">
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
  </div>
</template>

<script setup lang="ts">
import type { Service, ServiceList } from '~/types/strapi/serviceList'

const { title } = defineProps<{
  title: string
}>()

const { data: services } = await useAsyncData<Partial<Service>[]>(
  'serviceList',
  async () => (await useStrapi().findOne<ServiceList>('service-list', {
    populate: {
      services: {
        fields: ['id', 'title', 'description', 'icon'],
        filters: { visible: { $eq: true } },
      },
    },
  })).data.services || [],
)
</script>
