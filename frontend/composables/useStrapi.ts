import { strapi } from '@strapi/client'

export const useStrapiUrl = () => useRuntimeConfig().public.strapi_url

export const useStrapiMedia = (path: string) => useStrapiUrl() + path

export const useStrapi = () => strapi({ baseURL: useStrapiUrl() + '/api' })
