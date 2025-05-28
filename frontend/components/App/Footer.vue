<template>
    <q-footer class="bg-dark text-white q-pa-md">
        <q-toolbar class="justify-between">
            <div class="row items-center">
                <q-avatar v-if="logoSrc" size="42px" class="q-mr-sm">
                    <img :src="logoSrc" :alt="globalSettings?.siteName" />
                </q-avatar>
                <div class="text-h6">{{ globalSettings?.siteName }}</div>
            </div>
            <div class="row items-center">
                <q-btn flat dense icon="fa-brands fa-github" href="https://github.com/" target="_blank"
                    class="q-mr-xs" />
                <q-btn flat dense icon="fa-brands fa-twitter" href="https://twitter.com/" target="_blank"
                    class="q-mr-xs" />
                <q-btn flat dense icon="fa-solid fa-envelope" href="mailto:info@example.com" />
            </div>
        </q-toolbar>
        <div class="text-caption text-grey-4 text-center q-mt-sm">
            &copy; {{ new Date().getFullYear() }} {{ globalSettings?.siteName }}. All rights reserved.
        </div>
    </q-footer>
</template>

<script setup lang="ts">
const { globalSettings } = useGlobalSettings()

const logoSrc = computed(() => {
    return globalSettings.value?.siteLogo ? useStrapiMedia(globalSettings.value?.siteLogo) : ''
})
</script>