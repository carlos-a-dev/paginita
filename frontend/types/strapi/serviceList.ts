import type { SingleType } from './strapi'

export type Service = {
  id: number
  title: string
  description: string
  icon: string
  visible: boolean
}

export type ServiceList = SingleType & {
  title: string
  services: Service[]
}
