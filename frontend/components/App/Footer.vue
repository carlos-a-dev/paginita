<template>
    <q-footer class="bg-grey-8 text-white">
        <q-toolbar>
            <q-toolbar-title>
                <q-avatar v-if="logoSrc">
                    <img :src="logoSrc" :alt="globalSettings?.siteName" />
                </q-avatar>
                <div>{{ globalSettings?.siteName }}</div>
            </q-toolbar-title>
        </q-toolbar>
    </q-footer>
</template>

<script setup lang="ts">
const { globalSettings } = useGlobalSettings()

const logoSrc = computed(() => {
    return globalSettings.value?.siteLogo ? useStrapiMedia(globalSettings.value.siteLogo + '?' + globalSettings.value.siteName) : ''
})
</script>