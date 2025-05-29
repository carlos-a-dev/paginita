<template>
  <q-page class="bg-white">
    <!-- Hero Section -->
    <div
      class="q-pa-xl text-white flex flex-center"
      style="background: #d32f2f; min-height: 80vh;"
    >
      <div class="text-center">
        <h1 class="text-h2 text-bold">
          Empowering Your Digital Business
        </h1>
        <p class="text-h4 q-mt-md">
          eCommerce, Web Design, Process Documentation & Training
        </p>
        <q-btn
          color="white"
          text-color="black"
          label="Let's Work Together"
          class="q-mt-lg"
        />
      </div>
    </div>

    <!-- Services Section -->
    <div class="q-pa-xl">
      <div class="text-h4 text-center q-mb-xl">
        Our Services
      </div>
      <div class="q-gutter-xl row justify-center">
        <q-card
          flat
          class="col-xs-12 col-sm-6 col-md-3 q-pa-md text-center"
        >
          <q-icon
            name="shopping_cart"
            size="64px"
            color="red"
          />
          <div class="text-h6 q-mt-md">
            eCommerce Solutions
          </div>
          <p class="text-body2">
            Store setup, integrations, optimization
          </p>
        </q-card>

        <q-card
          flat
          class="col-xs-12 col-sm-6 col-md-3 q-pa-md text-center"
        >
          <q-icon
            name="web"
            size="64px"
            color="red"
          />
          <div class="text-h6 q-mt-md">
            Web Design
          </div>
          <p class="text-body2">
            Responsive, UX/UI-focused websites
          </p>
        </q-card>

        <q-card
          flat
          class="col-xs-12 col-sm-6 col-md-3 q-pa-md text-center"
        >
          <q-icon
            name="description"
            size="64px"
            color="red"
          />
          <div class="text-h6 q-mt-md">
            Process Documentation
          </div>
          <p class="text-body2">
            SOPs, flowcharts, knowledge bases
          </p>
        </q-card>

        <q-card
          flat
          class="col-xs-12 col-sm-6 col-md-3 q-pa-md text-center"
        >
          <q-icon
            name="school"
            size="64px"
            color="red"
          />
          <div class="text-h6 q-mt-md">
            Training & Workshops
          </div>
          <p class="text-body2">
            Custom training for your team
          </p>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'mock',
})
</script>
