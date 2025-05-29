<template>
    <div class="q-pa-xl text-white flex flex-center hero" :style="style" :class="classes">
        <div class="text-center">
            <h1 v-if="title" class="text-h2 text-bold">{{ title }}</h1>
            <p v-if="message" class="text-h4 q-mt-md">
                {{ message }}
            </p>
            <q-btn
v-if="callToAction && link" unelevated color="secondary" :label="callToAction" class="q-mt-lg"
                :href="link" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { HomeHeroProps } from '~/types/component/homeHero';

const $props = defineProps<HomeHeroProps>();

const classes = computed(() => {
    return {
        'bg-primary': !$props.background?.url
    };
});

const style = computed(() => {
    return $props.background?.url ? {
        backgroundImage: `url('${useStrapiMedia($props.background?.url)}')`
    } : null;
});
</script>

<style scoped>
.hero {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    min-height: 100vh;
}
</style>
