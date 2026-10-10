import { createError, defineEventHandler, useRuntimeConfig } from 'nuxt/server'
import { isIndexable, webUrl } from '~/utils/seo'

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, character => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', '\'': '&apos;' })[character]!)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = webUrl(config.public.siteUrl, config.public.siteUrl, true)
  if (!siteUrl) throw createError({ statusCode: 503, message: 'Site URL is not configured' })
  const endpoint = `${config.public.strapi.url.replace(/\/$/, '')}${config.public.strapi.prefix}/pages`
  const global = await $fetch<{ data: { seo?: { metaRobots?: string } } }>(endpoint.replace(/\/pages$/, '/global'), { query: { 'populate[seo][fields][0]': 'metaRobots' } })
  const globalRobots = global.data.seo?.metaRobots || ''
  const urls = new Map<string, string>()
  if (isIndexable(globalRobots)) urls.set(new URL('/privacy-policy', siteUrl).href, '')
  let pageCount = 1
  for (let page = 1; page <= pageCount; page++) {
    const response = await $fetch<{
      data: { slug: string, updatedAt?: string, seo?: { metaRobots?: string, canonicalURL?: string } }[]
      meta?: { pagination?: { pageCount?: number } }
    }>(endpoint, {
      query: {
        'status': 'published',
        'fields[0]': 'slug',
        'fields[1]': 'updatedAt',
        'populate[seo][fields][0]': 'metaRobots',
        'populate[seo][fields][1]': 'canonicalURL',
        'pagination[page]': page,
        'pagination[pageSize]': 100,
      },
    })
    pageCount = response.meta?.pagination?.pageCount || 1
    for (const entry of response.data) {
      // The repository owns this route; obsolete CMS metadata does not override it.
      if (entry.slug === 'privacy-policy') continue
      if (!entry.slug || entry.slug.includes('/') || !isIndexable(entry.seo?.metaRobots?.trim() || globalRobots)) continue
      const path = entry.slug === 'index' ? '/' : `/${encodeURIComponent(entry.slug)}`
      const url = webUrl(entry.seo?.canonicalURL, siteUrl, true) || webUrl(path, siteUrl, true)!
      if (new URL(url).origin !== new URL(siteUrl).origin) continue
      const modified = entry.updatedAt && !Number.isNaN(Date.parse(entry.updatedAt)) ? new Date(entry.updatedAt).toISOString() : ''
      urls.set(url, modified)
    }
  }
  event.res.headers.set('content-type', 'application/xml; charset=utf-8')
  event.res.headers.set('cache-control', 'public, max-age=300')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...urls].map(([url, modified]) => `<url><loc>${escapeXml(url)}</loc>${modified ? `<lastmod>${modified}</lastmod>` : ''}</url>`).join('')}</urlset>`
})
