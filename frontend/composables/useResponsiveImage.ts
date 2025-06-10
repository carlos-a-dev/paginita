import type { MediaImage } from '~/types/strapi/strapi'
// Assuming useStrapiMedia is auto-imported by Nuxt or globally available.
// If not, you might need: import { useStrapiMedia } from '#imports' or the correct path.

interface UseResponsiveImageOptions {
  /** The Strapi media image object or a ref to it. */
  image: MediaImage | undefined | null // No longer MaybeRef if non-reactive
  /**
   * The 'sizes' attribute string for the img tag.
   * E.g., "(max-width: 600px) 100vw, 50vw".
   * The consumer is responsible for providing the correct sizes value.
   */
  sizes?: string
}

export function useResponsiveImage(options: UseResponsiveImageOptions) {
  const img = options.image

  let srcsetValue: string | undefined
  if (img) {
    const sources: { url: string, width: number }[] = []
    const addedUrls = new Set<string>()

    if (img.formats) {
      Object.values(img.formats).forEach((format) => {
        if (format && format.url && typeof format.width === 'number') {
          const fullUrl = useStrapiMedia(format.url)
          if (!addedUrls.has(fullUrl)) {
            sources.push({ url: fullUrl, width: format.width })
            addedUrls.add(fullUrl)
          }
        }
      })
    }

    if (img.url && typeof img.width === 'number') {
      const originalFullUrl = useStrapiMedia(img.url)
      if (!addedUrls.has(originalFullUrl)) {
        sources.push({ url: originalFullUrl, width: img.width })
      }
    }

    if (sources.length > 0) {
      sources.sort((a, b) => a.width - b.width)
      srcsetValue = sources.map(s => `${s.url} ${s.width}w`).join(', ')
    }
  }

  const srcValue: string | undefined = img?.url ? useStrapiMedia(img.url) : undefined

  const altValue: string = img?.alternativeText ?? ''

  return {
    src: srcValue,
    srcset: srcsetValue,
    sizes: options.sizes,
    alt: altValue,
  }
}
