import type { SingleType } from './strapi'

export type SocialNetwork = {
  id: number
  name: string
  icon: string
  url: string
  visible: boolean
}

export type SocialNetworks = SingleType & {
  items: SocialNetwork[]
}
