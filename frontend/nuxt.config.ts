const strapiUrl = process.env.NUXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-quasar-ui', '@nuxtjs/strapi', '@nuxt/eslint', '@nuxt/image'],
  components: [
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
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@200;300&display=swap',
        },
      ],
    },
  },
  css: ['@/assets/styles/highlightjs.scss', '@/assets/styles/fonts.scss'],
  compatibilityDate: '2025-05-15',
  eslint: {
    config: {
      stylistic: true,
    },
  },
  image: {
    ipx: {
      modifiers: {
        format: 'webp',
        quality: 80,
      },
    },
    screens: {
      'xs': 600,
      'sm': 1024,
      'md': 1440,
      'lg': 1920,
      'xl': 1920,
      'xxl': 1920,
      '2xl': 1920,
    },
    domains: [strapiUrl.replace('http://', '').replace('https://', '')],
    alias: {
      strapi: strapiUrl,
    },
  },
  quasar: {
    extras: {
      fontIcons: ['fontawesome-v6'],
      animations: 'all',
    },
    cssAddon: true,
    plugins: ['Notify', 'Loading'],
    sassVariables: './assets/styles/quasar-variables.scss',
    components: {
      defaults: {
        QBtn: {
          rounded: true,
          noCaps: true,
        },
        QBtnGroup: {
          rounded: true,
        },
        QImg: {
          loadingShowDelay: 300,
          spinnerColor: 'grey-1',
        },
      },
    },
  },
  strapi: {
    url: strapiUrl,
    devtools: true,
    version: 'v5',
  },
})
