import type { SingleType, MediaImage } from './strapi'

export type Global = SingleType & {
  siteName: string
  siteNameStyled: string
  siteDescription: string
  favicon: MediaImage
  siteLogo: MediaImage
  quasarTheme: {
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
}
