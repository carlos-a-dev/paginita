import type { SEO } from '~/types/strapi/seo'

export default function useSeo(seo: SEO) {
  const route = useRoute()
  const config = useRuntimeConfig()
  const { globalSettings } = useGlobalSettings()

  // Make sure to set NUXT_PUBLIC_SITE_URL in your .env file for production
  const siteUrl = config.public.siteUrl || 'http://localhost:3000'
  const pageUrl = new URL(route.fullPath, siteUrl).href

  // Use the canonical URL from the CMS if provided, otherwise default to the page's URL.
  const canonicalUrl = seo.canonicalURL || pageUrl

  // Ensure image URLs are absolute. useStrapiMedia prepends the Strapi URL.
  const metaImageUrl = seo.metaImage?.url ? useStrapiMedia(seo.metaImage.url) : undefined
  const ogImageUrl = seo.openGraph?.ogImage?.url
    ? useStrapiMedia(seo.openGraph.ogImage.url)
    : metaImageUrl

  // Define OpenGraph and Twitter properties with fallbacks for robustness.
  const title = seo.metaTitle
  const description = seo.metaDescription

  const ogTitle = seo.openGraph?.ogTitle || title
  const ogDescription = seo.openGraph?.ogDescription || description
  const ogUrl = seo.openGraph?.ogUrl || canonicalUrl
  const siteName = globalSettings.value?.siteName

  // Filter out any tags that would have empty content.
  const meta = [
    // Standard meta tags
    { name: 'description', content: description },
    seo.keywords && { name: 'keywords', content: seo.keywords },
    seo.metaRobots && { name: 'robots', content: seo.metaRobots },
    seo.metaViewport && { name: 'viewport', content: seo.metaViewport },
    metaImageUrl && { name: 'image', content: metaImageUrl },

    // Open Graph
    { property: 'og:title', content: ogTitle },
    { property: 'og:description', content: ogDescription },
    { property: 'og:url', content: ogUrl },
    ogImageUrl && { property: 'og:image', content: ogImageUrl },
    { property: 'og:type', content: seo.openGraph?.ogType || 'website' },
    siteName && { property: 'og:site_name', content: siteName },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: ogTitle },
    { name: 'twitter:description', content: ogDescription },
    ogImageUrl && { name: 'twitter:image', content: ogImageUrl },
  ].filter(Boolean)

  useHead({
    title,
    link: [{ rel: 'canonical', href: canonicalUrl }],
    meta: meta as [],
    script: [
      seo.structuredData && Object.keys(seo.structuredData).length > 0
        ? { type: 'application/ld+json', innerHTML: JSON.stringify(seo.structuredData, null, 2) }
        : undefined,
    ],
  })
}
