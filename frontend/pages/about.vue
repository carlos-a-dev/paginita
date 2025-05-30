<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card
      class="my-card"
      flat
      bordered
    >
      <q-card-section>
        <div class="text-h5">
          About Us
        </div>
        <div class="text-subtitle2 q-mt-sm">
          Welcome to our website! This project is built with Vue.js and Quasar Framework.
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <p>
          Our mission is to deliver high-quality web applications with a focus on performance and user experience.
        </p>
        <p>
          This page demonstrates the use of Quasar components such as <code>q-card</code>, <code>q-separator</code>, and responsive layouts.
        </p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
// No script logic needed for this simple About page
</script>

<style scoped>
.my-card {
    max-width: 500px;
    width: 100%;
}
</style>
