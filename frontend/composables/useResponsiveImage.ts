import type { MediaImage } from '~/types/strapi/strapi'
// Assuming useStrapiMedia is auto-imported by Nuxt or globally available.
// If not, you might need: import { useStrapiMedia } from '#imports' or the correct path.

interface UseResponsiveImageOptions {
  /** The Strapi media image object or a ref to it. */
  image: MaybeRef<MediaImage | undefined | null>
  /**
   * The 'sizes' attribute string for the img tag.
   * E.g., "(max-width: 600px) 100vw, 50vw".
   * The consumer is responsible for providing the correct sizes value.
   */
  sizes?: string
}

export function useResponsiveImage(options: UseResponsiveImageOptions) {
  const reactiveImage = computed(() => unref(options.image))

  const srcset = computed<string | undefined>(() => {
    const img = reactiveImage.value
    if (!img) {
      return undefined
    }

    const sources: { url: string, width: number }[] = []
    const addedUrls = new Set<string>()

    // Add formatted images
    if (img.formats) {
      Object.values(img.formats).forEach((format) => {
        if (format && format.url && typeof format.width === 'number') {
          const fullUrl = useStrapiMedia(format.url) // Ensure useStrapiMedia is available
          if (!addedUrls.has(fullUrl)) {
            sources.push({ url: fullUrl, width: format.width })
            addedUrls.add(fullUrl)
          }
        }
      })
    }

    // Add the original image itself if it has a width and URL, and is not already added
    if (img.url && typeof img.width === 'number') {
      const originalFullUrl = useStrapiMedia(img.url)
      if (!addedUrls.has(originalFullUrl)) {
        sources.push({ url: originalFullUrl, width: img.width })
      }
    }

    if (sources.length === 0) {
      return undefined
    }

    sources.sort((a, b) => a.width - b.width)
    return sources.map(s => `${s.url} ${s.width}w`).join(', ')
  })

  const src = computed<string | undefined>(() => {
    return reactiveImage.value?.url ? useStrapiMedia(reactiveImage.value.url) : undefined
  })

  const alt = computed<string>(() => {
    return reactiveImage.value?.alternativeText ?? ''
  })

  return {
    src,
    srcset,
    sizes: computed(() => options.sizes), // Pass through consumer-provided sizes
    alt,
  }
}
