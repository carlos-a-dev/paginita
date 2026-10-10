import { defineEventHandler, useRuntimeConfig } from 'nuxt/server'

export default defineEventHandler((event) => {
  event.res.headers.set('x-content-type-options', 'nosniff')
  event.res.headers.set('x-frame-options', 'DENY')
  event.res.headers.set('referrer-policy', 'strict-origin-when-cross-origin')
  event.res.headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=()')
  if (!import.meta.dev && String(useRuntimeConfig().public.siteUrl).startsWith('https://')) {
    event.res.headers.set('strict-transport-security', 'max-age=31536000')
  }
})
