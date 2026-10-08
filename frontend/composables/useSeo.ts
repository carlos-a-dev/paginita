import type { MaybeRefOrGetter } from 'vue'
import type { SEO } from '~/types/strapi/seo'
import { buildSeo } from '~/utils/seo'

export default function useSeo(pageSeo?: MaybeRefOrGetter<Partial<SEO> | null | undefined>) {
  const route = useRoute()
  const config = useRuntimeConfig()
  const { globalSettings } = useGlobalSettings()
  const mediaUrl = useStrapiMedia('/')
  const metadata = computed(() => buildSeo({
    page: toValue(pageSeo),
    global: globalSettings.value?.seo,
    siteName: globalSettings.value?.siteName || 'AlvaSori',
    siteDescription: globalSettings.value?.siteDescription,
    siteLogo: globalSettings.value?.siteLogo,
    siteUrl: config.public.siteUrl,
    mediaUrl,
    path: route.path,
  }))

  useSeoMeta({
    title: () => metadata.value.title,
    description: () => metadata.value.description,
    robots: () => metadata.value.robots,
    ogTitle: () => metadata.value.ogTitle,
    ogDescription: () => metadata.value.ogDescription,
    ogUrl: () => metadata.value.ogUrl,
    ogType: () => metadata.value.ogType,
    ogSiteName: () => metadata.value.siteName,
    ogImage: () => metadata.value.image,
    ogImageAlt: () => metadata.value.imageAlt,
    ogImageWidth: () => metadata.value.imageWidth,
    ogImageHeight: () => metadata.value.imageHeight,
    twitterCard: () => metadata.value.image ? 'summary_large_image' : 'summary',
    twitterTitle: () => metadata.value.ogTitle,
    twitterDescription: () => metadata.value.ogDescription,
    twitterImage: () => metadata.value.image,
  })
  useHead(() => ({
    meta: metadata.value.keywords ? [{ name: 'keywords', content: metadata.value.keywords }] : [],
    link: [{ key: 'seo-canonical', rel: 'canonical', href: metadata.value.canonical }],
    script: [{ key: 'seo-structured-data', type: 'application/ld+json', textContent: metadata.value.structuredData }],
  }))
}
