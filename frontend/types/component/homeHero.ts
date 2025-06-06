import type { MediaImage } from '../strapi/strapi'

export type HomeHeroProps = {
  title: string
  message: string
  callToAction: string
  link: string
  background: MediaImage
}
