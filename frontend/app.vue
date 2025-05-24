<template>
  <div>
    <h1>Welcome to the App</h1>
    <p>This is a simple Vue.js application.</p>
    <router-view></router-view>

    <pre>
      {{ about }}
    </pre>

    <footer>
      <p>&copy; 2023 My Application</p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
const { findOne } = useStrapi()
const about = ref()

about.value = await findOne('about', {
  populate: '*'
})
</script>