import { createError, defineEventHandler, useRuntimeConfig } from 'nuxt/server'
import { webUrl } from '~/utils/seo'

// RFC 9116 security contact, using the organization email from Global Settings.
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = webUrl(config.public.siteUrl, config.public.siteUrl, true)
  const endpoint = `${config.public.strapi.url.replace(/\/$/, '')}${config.public.strapi.prefix}/global`
  const global = await $fetch<{ data: { organization?: { email?: string | null } | null } }>(endpoint, { query: { 'populate[organization][fields][0]': 'email' } })
  const email = global.data.organization?.email?.trim()
  if (!siteUrl || !email || !/^[^\s@<>]+@[^\s@<>]+$/.test(email)) throw createError({ statusCode: 404, message: 'Not found' })
  // Expires must stay under a year ahead; a rolling 180 days never goes stale.
  const expires = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
  expires.setUTCHours(0, 0, 0, 0)
  event.res.headers.set('content-type', 'text/plain; charset=utf-8')
  event.res.headers.set('cache-control', 'public, max-age=86400')
  return [
    `Contact: mailto:${email}`,
    `Expires: ${expires.toISOString()}`,
    'Preferred-Languages: en',
    `Canonical: ${new URL('/.well-known/security.txt', siteUrl).href}`,
    '',
  ].join('\n')
})
