// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['nuxt-quasar-ui'],
   runtimeConfig: {
    public: {
      strapi_url: '', // can be overridden by NUXT_PUBLIC_STRAPI_URL environment variable
    }
  },
})
