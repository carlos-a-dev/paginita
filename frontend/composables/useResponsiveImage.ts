import type { ImageOptions } from '@nuxt/image'
import type { MediaImage } from '~/types/strapi/strapi'

export function useResponsiveImage(src: string, alt?: string, options: ImageOptions = {}) {
  options = {
    sizes: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw',
    height: '80vh',
    ...options,
  }

  return {
    ...useImage().getSizes('/strapi' + src, options),
    alt: alt ?? undefined,
  }
}

export function useStrapiImage(image: MediaImage, options: ImageOptions = {}) {
  return useResponsiveImage(image.url, image.alternativeText ?? undefined, options)
}
