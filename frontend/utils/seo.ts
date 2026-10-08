import type { SEO } from '~/types/strapi/seo'

const openGraphTypes = ['website', 'article', 'book', 'profile', 'music.song', 'music.album', 'music.playlist', 'music.radio_station', 'video.movie', 'video.episode', 'video.tv_show', 'video.other', 'payment.link'] as const
type OpenGraphType = typeof openGraphTypes[number]

export function webUrl(value: string | undefined, base: string, stripQuery = false): string | undefined {
  if (!value?.trim()) return undefined
  try {
    const url = new URL(value.trim(), base)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return undefined
    url.hash = ''
    if (stripQuery) url.search = ''
    return url.href
  }
  catch {
    return undefined
  }
}

export function serializeSchema(value: unknown): string {
  return (JSON.stringify(value) || '{}').replace(/[<>&\u2028\u2029]/g, character => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`)
}

export function buildSeo(options: {
  page?: Partial<SEO> | null
  global?: Partial<SEO> | null
  siteName: string
  siteDescription?: string
  siteLogo?: string
  siteUrl: string
  mediaUrl: string
  path: string
}) {
  const { page, global, siteName } = options
  const siteUrl = webUrl(options.siteUrl, options.siteUrl, true)
  if (!siteUrl) throw new Error('NUXT_PUBLIC_SITE_URL must be an absolute HTTP(S) URL')
  const routePath = (options.path.split(/[?#]/)[0] || '/').replace(/\/+$/, '') || '/'
  const pageUrl = webUrl(routePath.replace(/^\/+/, '/'), siteUrl, true) || siteUrl
  const canonical = webUrl(page?.canonicalURL, siteUrl, true) || pageUrl
  const label = routePath.split('/').filter(Boolean).pop()?.replace(/-/g, ' ').replace(/\b\w/g, character => character.toUpperCase())
  const title = page?.metaTitle?.trim() || (routePath === '/' ? global?.metaTitle?.trim() : undefined) || (label ? `${label} | ${siteName}` : siteName)
  const description = page?.metaDescription?.trim() || global?.metaDescription?.trim() || options.siteDescription?.trim()
  const images = [page?.openGraph?.ogImage, page?.metaImage, global?.openGraph?.ogImage, global?.metaImage]
  const selectedImage = images.find(image => webUrl(image?.url, options.mediaUrl))
  const image = webUrl(selectedImage?.url, options.mediaUrl)

  const ogTitle = page?.openGraph?.ogTitle?.trim() || title
  const ogDescription = page?.openGraph?.ogDescription?.trim() || description
  const ogUrl = webUrl(page?.openGraph?.ogUrl, siteUrl, true) || canonical
  const logo = webUrl(options.siteLogo?.replace(/^\/strapi(?=\/)/, ''), options.mediaUrl)
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${siteUrl}#organization`, 'name': siteName, 'url': siteUrl, ...(logo ? { logo } : {}) },
      { '@type': 'WebSite', '@id': `${siteUrl}#website`, 'name': siteName, 'url': siteUrl, 'publisher': { '@id': `${siteUrl}#organization` } },
      { '@type': routePath === '/contact' ? 'ContactPage' : routePath === '/about' ? 'AboutPage' : 'WebPage', '@id': `${canonical}#webpage`, 'url': canonical, 'name': title, description, 'isPartOf': { '@id': `${siteUrl}#website` } },
    ],
  }
  const custom = [page?.structuredData, global?.structuredData].find(value => value && typeof value === 'object' && Object.keys(value).length > 0)
  return {
    title, description, canonical, image, ogTitle, ogDescription, ogUrl, siteName,
    imageAlt: image ? selectedImage?.alternativeText || ogTitle : undefined,
    imageWidth: selectedImage?.width && selectedImage.width > 0 ? selectedImage.width : undefined,
    imageHeight: selectedImage?.height && selectedImage.height > 0 ? selectedImage.height : undefined,
    ogType: openGraphTypes.includes(page?.openGraph?.ogType as OpenGraphType) ? page!.openGraph!.ogType as OpenGraphType : 'website' as const,
    robots: page?.metaRobots?.trim() || global?.metaRobots?.trim() || 'index, follow',
    keywords: page?.keywords || global?.keywords,
    structuredData: serializeSchema(custom || graph),
  }
}

export function isIndexable(robots?: string): boolean {
  return !/(?:^|[,\s])(noindex|none)(?:$|[,\s])/i.test(robots || '')
}
