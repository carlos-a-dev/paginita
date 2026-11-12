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
  devtools: { enabled: true },
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;700;900&family=Montserrat:wght@200;300;400;500;600&display=swap',
        },
      ],
    },
  },
  css: [
    '@/assets/styles/fonts.scss',
    '@/assets/styles/highlightjs.scss',
    '@/assets/styles/main.scss',
  ],
  runtimeConfig: {
    // Read at build time: PM2 does not load frontend/.env at runtime.
    blockAiTraining: process.env.NUXT_BLOCK_AI_TRAINING === 'true',
    indexNowKey: process.env.NUXT_INDEXNOW_KEY || '',
    security: {
      styleOrigins: 'https://fonts.googleapis.com',
      fontOrigins: 'https://fonts.gstatic.com',
      imageOrigins: '',
      connectOrigins: '',
      // Read at build time: PM2 does not load frontend/.env at runtime.
      hstsIncludeSubdomains: process.env.NUXT_SECURITY_HSTS_INCLUDE_SUBDOMAINS === 'true',
    },
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      privacyPolicyPath: '/privacy-policy',
      accessibilityStatementPath: '/accessibility',
    },
  },
  srcDir: '.',
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
      fontIcons: ['fontawesome-v7'],
      animations: [
        'fadeIn',
        'fadeOut',
        'rotateIn',
        'rotateOut',
      ],
    },
    cssAddon: true,
    plugins: ['Notify', 'Loading'],
    sassVariables: './assets/styles/quasar-variables.scss',
    components: {
      defaults: {
        QBtn: {
          noCaps: true,
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
