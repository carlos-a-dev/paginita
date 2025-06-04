import type { SingleType } from './strapi'

export type NavigationLinkItem = {
  id: number
  label: string
  url: string
}

export type NavigationLink = SingleType & {
  links: NavigationLinkItem[]
}
