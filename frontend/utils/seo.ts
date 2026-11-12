import type { SEO } from '~/types/strapi/seo'
import type { Organization } from '~/types/strapi/global'

// Messaging links (wa.me and similar) are not profiles of the organization.
const notProfileHosts = /^(?:www\.)?(?:wa\.me|api\.whatsapp\.com|whatsapp\.com|t\.me|m\.me)$/i

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

const text = (value?: string | null) => value?.trim() || undefined

export function parseAreaServed(value?: string | null): string[] {
  return Array.from(new Set((value || '').split(/[\n,;]/).map(area => area.trim()).filter(Boolean)))
}

export function profileUrls(urls: (string | undefined)[]): string[] {
  return Array.from(new Set(urls.map(url => webUrl(url, 'https://invalid.invalid/')).filter((url): url is string => !!url && !notProfileHosts.test(new URL(url).hostname))))
}

export function organizationSchema(options: {
  siteUrl: string
  siteName: string
  siteDescription?: string
  logo?: string
  organization?: Organization | null
  socialUrls?: (string | undefined)[]
}) {
  const org = options.organization || {}
  const email = text(org.email)
  const telephone = text(org.telephone)
  const address = [org.addressLocality, org.addressRegion, org.addressCountry].some(text)
    ? { '@type': 'PostalAddress', 'addressLocality': text(org.addressLocality), 'addressRegion': text(org.addressRegion), 'addressCountry': text(org.addressCountry) }
    : undefined
  const areaServed = parseAreaServed(org.areaServed)
  const sameAs = profileUrls(options.socialUrls || [])
  return {
    '@type': 'Organization',
    '@id': `${options.siteUrl}#organization`,
    'name': options.siteName,
    'legalName': text(org.legalName),
    'url': options.siteUrl,
    'logo': options.logo,
    'description': text(options.siteDescription),
    email,
    telephone,
    address,
    'areaServed': areaServed.length ? areaServed : undefined,
    'sameAs': sameAs.length ? sameAs : undefined,
    'contactPoint': email || telephone
      ? { '@type': 'ContactPoint', 'contactType': 'customer support', email, telephone, 'url': new URL('/contact', options.siteUrl).href }
      : undefined,
  }
}

// Services shown on a page, as schema.org Service entries offered by the organization.
export function servicesSchema(options: {
  siteUrl: string
  pageUrl: string
  services: { title?: string, description?: string }[]
  areaServed?: string | null
}) {
  const areaServed = parseAreaServed(options.areaServed)
  const services = options.services
    .map(service => ({ name: service.title?.replace(/^[^\p{L}\p{N}]+/u, '').trim(), description: text(service.description) }))
    .filter(service => service.name)
  if (!services.length) return undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    '@id': `${options.pageUrl}#services`,
    'name': 'Services',
    'url': options.pageUrl,
    'itemListElement': services.map(service => ({
      '@type': 'Offer',
      'itemOffered': {
        '@type': 'Service',
        'name': service.name,
        'description': service.description,
        'provider': { '@id': `${options.siteUrl}#organization` },
        'areaServed': areaServed.length ? areaServed : undefined,
      },
    })),
  }
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
  organization?: Organization | null
  socialUrls?: (string | undefined)[]
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
      organizationSchema({ siteUrl, siteName, siteDescription: options.siteDescription, logo, organization: options.organization, socialUrls: options.socialUrls }),
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
