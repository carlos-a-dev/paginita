import { createError, defineEventHandler, useRuntimeConfig } from 'nuxt/server'
import { indexNowKey } from '~/utils/indexNow'

// IndexNow ownership proof (https://www.indexnow.org). Submissions pass this
// file as keyLocation; at the site root it covers every URL on the host.
export default defineEventHandler((event) => {
  const key = indexNowKey(useRuntimeConfig().indexNowKey)
  if (!key) throw createError({ statusCode: 404, message: 'Not found' })
  event.res.headers.set('content-type', 'text/plain; charset=utf-8')
  event.res.headers.set('cache-control', 'public, max-age=3600')
  return key
})
