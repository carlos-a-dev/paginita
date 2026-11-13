import { createHmac } from 'node:crypto'
import { createError, defineEventHandler, useRuntimeConfig } from 'nuxt/server'

// Signed "<timestamp>.<HMAC>" token for the contact form. The CMS checks it
// with the same secret (CONTACT_FORM_SECRET) to turn away scripted posts that
// never loaded the form, and submissions made seconds after loading it.
export default defineEventHandler((event) => {
  const secret = String(useRuntimeConfig().contactFormSecret || '').trim()
  if (!secret) throw createError({ statusCode: 404, message: 'Not found' })
  const now = Date.now()
  const signature = createHmac('sha256', secret).update(`contact-form:${now}`).digest('base64url')
  event.res.headers.set('cache-control', 'no-store')
  return { token: `${now}.${signature}` }
})
