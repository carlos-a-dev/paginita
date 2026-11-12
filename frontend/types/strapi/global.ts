import type { SEO } from './seo'
import type { SingleType, MediaImage } from './strapi'

export type QuasarTheme = {
  primary: string
  secondary: string
  accent: string
  dark: string
  darkPage: string
  positive: string
  negative: string
  info: string
  warning: string
}

export type Organization = {
  legalName?: string | null
  email?: string | null
  telephone?: string | null
  addressLocality?: string | null
  addressRegion?: string | null
  addressCountry?: string | null
  areaServed?: string | null
}

export type Global = SingleType & {
  siteName: string
  siteNameStyled: string
  siteDescription: string
  favicon: MediaImage
  siteLogo: MediaImage
  quasarTheme: QuasarTheme
  seo?: SEO
  organization?: Organization | null
}
