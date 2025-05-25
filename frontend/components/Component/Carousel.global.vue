<template>
    <q-carousel v-model="slide" animated thumbnails navigation arrows>
        <q-carousel-slide v-for="(image, index) in strapiData.images" :key="image.id" :name="index"
            :img-src="useStrapiMedia(image.url)" />
    </q-carousel>
</template>

<script setup lang="ts">
import type { Carousel } from '~/types/component/carousel';

const props = defineProps<{
    strapiData: Carousel
}>();

const slide = ref(0);
</script>