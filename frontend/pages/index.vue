<template>
  <pre>
    {{ about }}
  </pre>
</template>

<script lang="ts" setup>
const { findOne } = useStrapi()
const about = ref()

about.value = await findOne('about', {
  populate: '*'
})
</script>