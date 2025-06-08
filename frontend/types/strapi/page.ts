import type { CollectionType, Component } from './strapi'

export type Page = CollectionType & {
  slug: string
  title: string
  description: string
  layout: string
  body: Component[]
  seo: object | null
  props?: Record<string, unknown>
}
