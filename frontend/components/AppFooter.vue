<template>
    <q-footer class="bg-grey-8 text-white">
        <q-toolbar>
            <q-toolbar-title>
                <q-avatar>
                    <img :src="useStrapiMedia(global?.siteLogo.formats.thumbnail?.url ?? global?.siteLogo.url ?? '')"
                        :alt="global?.siteLogo.alternativeText ?? ''" />
                </q-avatar>
                <div>{{ global.siteName }}</div>
            </q-toolbar-title>
        </q-toolbar>
    </q-footer>
</template>

<script setup lang="ts">
import type { Global } from '~/types/global'
const { findOne } = useStrapi()

const { data: global } = await useAsyncData(
    'globalSettings',
    async () => (await findOne<Global>('global', { populate: '*' })).data
)
</script>