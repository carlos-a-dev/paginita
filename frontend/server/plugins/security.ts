import { createHash } from 'node:crypto'
import { useRuntimeConfig } from 'nuxt/server'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    if (import.meta.dev) return
    // Hash only framework-generated head/body scripts, never CMS page content.
    const hashes = new Set<string>()
    for (const chunk of [...html.head, ...html.bodyPrepend, ...html.bodyAppend]) {
      for (const match of chunk.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)) {
        if (match[1]) hashes.add(`'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`)
      }
    }
    const cmsOrigin = new URL(useRuntimeConfig().public.strapi.url).origin
    event.node.res.setHeader('content-security-policy', [
      'default-src \'self\'',
      `script-src 'self' ${[...hashes].join(' ')}`,
      'script-src-attr \'none\'',
      'style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com',
      'font-src \'self\' https://fonts.gstatic.com',
      `img-src 'self' data: blob: ${cmsOrigin}`,
      `connect-src 'self' ${cmsOrigin}`,
      'frame-ancestors \'none\'',
      'object-src \'none\'',
      'base-uri \'self\'',
      'form-action \'self\'',
    ].join('; '))
  })
})
