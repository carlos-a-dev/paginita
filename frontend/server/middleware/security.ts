import { defineEventHandler, useRuntimeConfig } from 'nuxt/server'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl)
  // One canonical host: send www.<site host> to the site URL with a permanent redirect.
  if (!import.meta.dev && siteUrl.startsWith('https://')) {
    const site = new URL(siteUrl)
    const host = (event.req.headers.get('host') || '').toLowerCase()
    if (host === `www.${site.host}`) {
      const url = new URL(event.req.url)
      return new Response(null, { status: 301, headers: { location: new URL(url.pathname + url.search, site).href } })
    }
  }
  event.res.headers.set('x-content-type-options', 'nosniff')
  event.res.headers.set('x-frame-options', 'DENY')
  event.res.headers.set('referrer-policy', 'strict-origin-when-cross-origin')
  event.res.headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=()')
  if (!import.meta.dev && siteUrl.startsWith('https://')) {
    // includeSubDomains only when every subdomain of the site serves HTTPS.
    event.res.headers.set('strict-transport-security', `max-age=31536000${config.security.hstsIncludeSubdomains ? '; includeSubDomains' : ''}`)
  }
})
