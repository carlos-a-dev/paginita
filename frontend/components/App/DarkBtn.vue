<template>
  <q-btn
    v-bind="$props"
    :color="$q.dark.isActive ? 'dark' : undefined"
    @click="toggleDarkMode()"
  />
</template>

<script setup lang="ts">
import { Dark, type QBtnProps } from 'quasar'

withDefaults(
  defineProps<QBtnProps>(),
  {
    round: true,
    flat: true,
    icon: 'brightness_6',
    ariaLabel: 'Toggle dark mode',
    title: 'Toggle dark mode',
  },
)

const toggleDarkMode = () => {
  Dark.toggle()
  localStorage.setItem('dark-mode', Dark.isActive ? 'true' : 'false')
}
</script>
