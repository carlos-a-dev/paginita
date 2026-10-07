import { defineEventHandler, getRequestIP } from 'nuxt/server'

export default defineEventHandler(event => ({
  ip: getRequestIP(event, { xForwardedFor: true }) ?? '',
}))
