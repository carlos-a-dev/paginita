import { createError, defineEventHandler, useRuntimeConfig } from 'nuxt/server'
import type { Organization } from '~/types/strapi/global'
import { llmsTxt } from '~/utils/llms'
import { isIndexable, webUrl } from '~/utils/seo'

type PageEntry = { slug: string, seo?: { metaTitle?: string, metaDescription?: string, metaRobots?: string, canonicalURL?: string } }

// llms.txt (https://llmstxt.org): a Markdown summary of the site for AI assistants, built from the CMS.
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = webUrl(config.public.siteUrl, config.public.siteUrl, true)
  if (!siteUrl) throw createError({ statusCode: 503, message: 'Site URL is not configured' })
  const api = `${config.public.strapi.url.replace(/\/$/, '')}${config.public.strapi.prefix}`
  const [global, serviceList, pages] = await Promise.all([
    $fetch<{ data: { siteName: string, siteDescription?: string, organization?: Organization | null, seo?: { metaRobots?: string } } }>(`${api}/global`, {
      query: { 'populate[organization]': '*', 'populate[seo][fields][0]': 'metaRobots' },
    }),
    $fetch<{ data?: { services?: { title?: string, description?: string }[] } }>(`${api}/service-list`, {
      query: { 'populate[services][fields][0]': 'title', 'populate[services][fields][1]': 'description', 'populate[services][filters][visible][$eq]': 'true' },
    }).catch(() => ({ data: { services: [] } })),
    $fetch<{ data: PageEntry[] }>(`${api}/pages`, {
      query: {
        'status': 'published',
        'fields[0]': 'slug',
        'populate[seo][fields][0]': 'metaTitle',
        'populate[seo][fields][1]': 'metaDescription',
        'populate[seo][fields][2]': 'metaRobots',
        'populate[seo][fields][3]': 'canonicalURL',
        'pagination[pageSize]': 100,
      },
    }),
  ])
  const siteName = global.data.siteName
  const globalRobots = global.data.seo?.metaRobots || ''
  const pageList = pages.data
    .filter(entry => entry.slug && !entry.slug.includes('/') && isIndexable(entry.seo?.metaRobots?.trim() || globalRobots))
    .map((entry) => {
      const path = entry.slug === 'index' ? '/' : `/${encodeURIComponent(entry.slug)}`
      const url = webUrl(entry.seo?.canonicalURL, siteUrl, true) || webUrl(path, siteUrl, true)!
      const title = (entry.seo?.metaTitle || entry.slug).replace(new RegExp(`\\s*[|\\-–]\\s*${siteName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`), '').trim()
      return { title: entry.slug === 'index' ? 'Home' : title, url, description: entry.seo?.metaDescription, home: entry.slug === 'index' }
    })
    .filter(page => new URL(page.url).origin === new URL(siteUrl).origin)
    .sort((a, b) => Number(b.home) - Number(a.home))
  const contactUrl = pageList.find(page => new URL(page.url).pathname === '/contact')?.url
  event.res.headers.set('content-type', 'text/plain; charset=utf-8')
  event.res.headers.set('cache-control', 'public, max-age=3600')
  return llmsTxt({ siteName, siteDescription: global.data.siteDescription, organization: global.data.organization, contactUrl, services: serviceList.data?.services || [], pages: pageList })
})
