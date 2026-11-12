import { defineEventHandler, useRuntimeConfig } from 'nuxt/server'
import { robotsTxt } from '~/utils/aiCrawlers'
import { webUrl } from '~/utils/seo'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  event.res.headers.set('content-type', 'text/plain; charset=utf-8')
  event.res.headers.set('cache-control', 'public, max-age=300')
  return robotsTxt({
    siteUrl: webUrl(config.public.siteUrl, config.public.siteUrl, true),
    blockAiTraining: config.blockAiTraining,
  })
})
