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

export type Global = SingleType & {
  siteName: string
  siteNameStyled: string
  siteDescription: string
  favicon: MediaImage
  siteLogo: MediaImage
  quasarTheme: QuasarTheme
  seo?: SEO
}
