<template>
    <q-carousel v-model="slide" v-bind="$props">
        <q-carousel-slide v-for="(image, index) in $props.images" :key="image.id" :name="index"
            :img-src="useStrapiMedia(image.url)" />
    </q-carousel>
</template>

<script setup lang="ts">
import type { Carousel } from '~/types/component/carousel';

const $props = defineProps<Carousel>();

const slide = ref(0);
</script>