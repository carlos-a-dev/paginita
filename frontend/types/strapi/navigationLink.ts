import type { SingleType } from './strapi'

export type NavigationLinkItem = {
  id: number
  label: string
  url: string
  visible: boolean
}

export type NavigationLink = SingleType & {
  links: NavigationLinkItem[]
}
