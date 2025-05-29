<template>
  <div class="row items-center">
    <q-btn
      v-for="socialNetwork in socialNetworks"
      :key="socialNetwork.id"
      flat
      dense
      :icon="socialNetwork.icon"
      :title="`Follow us on ${socialNetwork.name}`"
      :aria-label="`Follow us on ${socialNetwork.name}`"
      :href="socialNetwork.url"
      target="_blank"
      class="q-ml-xs"
    />
  </div>
</template>

<script setup lang="ts">
import type { SocialNetworkResponse, SocialNetwork } from '~/types/strapi/socialNetwork'

const { data: socialNetworks } = await useAsyncData<SocialNetwork[]>('socialNetworks', async () => {
  return (await useStrapi().findOne<SocialNetworkResponse>('social-network', {
    populate: {
      items: {
        fields: ['id', 'name', 'icon', 'url'],
        filters: { visible: { $eq: true } },
      },
    },
  })).data?.items || []
})
</script>
