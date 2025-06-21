import type { CollectionType, Component } from './strapi'
import type { SEO } from './seo'

export type Page = CollectionType & {
  slug: string
  layout: string
  body: Component[]
  seo?: SEO
  props?: Record<string, unknown>
}
