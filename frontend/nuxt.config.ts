// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-quasar-ui', '@nuxtjs/strapi', '@nuxt/eslint', '@nuxtjs/mdc'],
  components: [
    {
      path: '~/components/Prose',
      global: true,
      prefix: 'Prose',
    },
    {
      path: '~/components/F',
      global: true,
      prefix: 'F',
    },
    '~/components',
  ],
  devtools: { enabled: false },
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  mdc: {
    components: {
      prose: true,
    },
  },
  compatibilityDate: '2025-05-15',
  eslint: {
    config: {
      stylistic: true,
    },
  },
  quasar: {
    extras: {
      fontIcons: ['fontawesome-v6'],
      animations: 'all',
    },
    plugins: ['Notify', 'Loading'],
  },
  strapi: {
    url: process.env.NUXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
    devtools: true,
    version: 'v5',
  },
})
