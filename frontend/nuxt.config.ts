// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['nuxt-quasar-ui', '@nuxtjs/strapi', '@nuxt/eslint'],
  strapi: {
    url: process.env.NUXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
    devtools: false,
    version: 'v5',
  },
  quasar: {
    extras: {
      fontIcons: ['fontawesome-v6']
    }
  }
})