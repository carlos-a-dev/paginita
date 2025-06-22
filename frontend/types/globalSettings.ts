import type { QuasarTheme } from './strapi/global'
import type { SEO } from './strapi/seo'

export type GlobalSettings = {
  siteName: string
  siteNameStyled: string
  siteDescription: string
  siteLogo: string
  favicon: string
  quasarTheme: QuasarTheme
  seo?: SEO
}
