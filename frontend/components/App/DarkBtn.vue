<template>
  <transition
    mode="out-in"
    appear
    enter-active-class="animated rotateIn fadeIn faster"
    leave-active-class="animated rotateOut fadeOut faster"
  >
    <q-btn
      v-bind="$props"
      :key="darkMode ? 'dark_mode' : 'light_mode'"
      :icon="darkMode ? 'dark_mode' : 'light_mode'"
      @click="toggleDarkMode"
    />
  </transition>
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

const { darkMode } = useTheme()
const { dark } = useQuasar()

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  dark.set(darkMode.value)
}
</script>
