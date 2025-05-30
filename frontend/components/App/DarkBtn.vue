<template>
  <q-btn
    v-bind="$props"
    :icon="icon"
    @click="toggleDarkMode()"
  />
</template>

<script setup lang="ts">
import type { QBtnProps } from 'quasar'

withDefaults(
  defineProps<QBtnProps>(),
  {
    round: true,
    flat: true,
    ariaLabel: 'Toggle dark mode',
    title: 'Toggle dark mode',
  },
)

const darkMode = useCookie<boolean | 'auto'>('dark-mode')
const $qq = useQuasar()
const toggleDarkMode = () => {
  darkMode.value = darkMode.value === 'auto' ? true : (darkMode.value ? false : 'auto')
  $qq.dark.set(darkMode.value)
}

const icon = computed(() => {
  switch (darkMode.value) {
    case true:
      return 'dark_mode'
    case false:
      return 'light_mode'
    case 'auto':
      return 'brightness_auto'
    default:
      return 'brightness_auto'
  }
})
</script>
