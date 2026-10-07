import { defineEventHandler, useRuntimeConfig } from 'nuxt/server'
import { webUrl } from '~/utils/seo'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteUrl = webUrl(config.public.siteUrl, config.public.siteUrl, true)
  event.res.headers.set('content-type', 'text/plain; charset=utf-8')
  event.res.headers.set('cache-control', 'public, max-age=300')
  if (!siteUrl || ['localhost', '127.0.0.1', '[::1]'].includes(new URL(siteUrl).hostname)) return 'User-agent: *\nDisallow: /\n'
  return `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', siteUrl).href}\n`
})
