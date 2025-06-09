<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page
        class="window-height window-width row justify-center items-center bg-grey-2 text-center"
      >
        <div
          class="column items-center q-pa-md"
          style="max-width: 500px;"
        >
          <q-icon
            :name="errorIcon"
            :color="error?.statusCode === 404 ? 'info' : 'negative'"
            size="7rem"
            class="q-mb-lg"
          />

          <div
            class="text-h2 text-weight-light q-mb-sm"
            :class="error?.statusCode === 404 ? 'text-blue-grey-7' : 'text-negative'"
          >
            {{ error?.statusCode }}
          </div>

          <p class="text-h5 text-blue-grey-9 q-mb-xl">
            {{ errorMessage }}
          </p>

          <q-card
            v-if="error?.data && showDetails"
            flat
            bordered
            class="q-mb-lg bg-red-1 text-left"
            style="width: 100%;"
          >
            <q-card-section>
              <div class="text-subtitle2 text-red-9">
                Technical Details:
              </div>
              <pre
                class="text-caption"
                style="white-space: pre-wrap; word-break: break-all;"
              >{{ JSON.stringify(error?.data, null, 2) }}</pre>
            </q-card-section>
          </q-card>

          <q-btn
            color="primary"
            text-color="white"
            unelevated
            rounded
            label="Go to Homepage"
            no-caps
            size="lg"
            icon="fas fa-home"
            class="q-px-xl q-py-sm"
            @click="handleErrorClear"
          />

          <div class="q-mt-lg text-caption text-grey-7">
            If you think this is a mistake, you can <a
              href="#"
              class="text-primary"
              @click.prevent="showDetails = !showDetails"
            >view details</a> or contact support.
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import type { QuasarTheme } from '~/types/globalSettings'

const { globalSettings } = useGlobalSettings()

const props = defineProps({
  error: Object as () => ({ statusCode: number, message?: string, statusMessage?: string, data?: unknown }),
})
const handleErrorClear = () => clearError({ redirect: '/' })
const showDetails = ref(false)

const errorMessage = computed(() => {
  if (props.error?.statusCode === 404) {
    return props.error?.message || props.error?.statusMessage || 'Oops! The page you are looking for could not be found.'
  }
  if (props.error?.statusCode && props.error?.statusCode >= 500) {
    return props.error?.message || props.error?.statusMessage || 'Sorry, something went wrong on our end. We are looking into it.'
  }
  return props.error?.message || props.error?.statusMessage || 'An unexpected error occurred.'
})

const errorIcon = computed(() => {
  if (props.error?.statusCode === 404) {
    return 'fas fa-map-signs' // Or 'fas fa-search-location'
  }
  if (props.error?.statusCode && props.error?.statusCode >= 500) {
    return 'fas fa-cogs' // Or 'fas fa-server'
  }
  return 'fas fa-exclamation-triangle'
})

useHead({
  title: `Error ${props.error?.statusCode} - Page Not Found`,
  meta: [
    { name: 'description', content: `An error occurred: ${errorMessage.value}` },
  ],
})

if (globalSettings.value?.quasarTheme) {
  useHead({
    style: [
      {
        textContent: getThemeStyle(globalSettings.value?.quasarTheme),
        tagPosition: 'bodyOpen',
        tagPriority: 1,
      },
    ],
  })
}

function getThemeStyle(quasarTheme: QuasarTheme | undefined) {
  if (!quasarTheme) return ''
  return `:root { ${Object.entries(quasarTheme)
    .map(([key, val]) => `--q-${key}: ${val};`)
    .join('')} }`
}
</script>

<style scoped>
/* You can add custom styles here if Quasar classes aren't enough */
a {
  text-decoration: none;
}
pre {
  font-size: 0.85em;
  line-height: 1.4;
}
</style>
