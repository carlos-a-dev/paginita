<template>
    <q-footer class="bg-grey-8 text-white">
        <q-toolbar>
            <q-toolbar-title>
                <q-avatar v-if="logoSrc">
                    <img :src="logoSrc" :alt="global?.siteName" />
                </q-avatar>
                <div>{{ global?.siteName }}</div>
            </q-toolbar-title>
        </q-toolbar>
    </q-footer>
</template>

<script setup lang="ts">
const { global } = useGlobalSettings()

const logoSrc = computed(() => {
    return global.value?.siteLogo?.url ? useStrapiMedia(global.value.siteLogo.url + '?' + global.value.siteName) : ''
})
</script>