import type { MediaImage } from './strapi'

export type OpenGraph = {
  id: number
  ogTitle: string
  ogDescription: string
  ogImage?: MediaImage
  ogUrl?: string
  ogType?: string
}

export type SEO = {
  id: number
  metaTitle: string
  metaDescription: string
  metaImage?: MediaImage
  openGraph?: OpenGraph
  keywords?: string
  metaRobots?: string
  metaViewport?: string
  canonicalURL?: string
  structuredData?: object
}
