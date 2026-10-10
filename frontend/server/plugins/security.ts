import { createHash } from 'node:crypto'
import { useRuntimeConfig } from 'nuxt/server'
import { cspOrigins } from '../utils/cspOrigins'

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
    const config = useRuntimeConfig()
    const cmsOrigin = cspOrigins(config.public.strapi.url).join(' ')
    const styles = cspOrigins(config.security.styleOrigins).join(' ')
    const fonts = cspOrigins(config.security.fontOrigins).join(' ')
    const images = cspOrigins(config.security.imageOrigins).join(' ')
    const connections = cspOrigins(config.security.connectOrigins).join(' ')
    event.node.res.setHeader('content-security-policy', [
      'default-src \'self\'',
      `script-src 'self' ${[...hashes].join(' ')}`,
      'script-src-attr \'none\'',
      `style-src 'self' 'unsafe-inline' ${styles}`,
      `font-src 'self' ${fonts}`,
      `img-src 'self' data: blob: ${cmsOrigin} ${images}`,
      `connect-src 'self' ${cmsOrigin} ${connections}`,
      'frame-ancestors \'none\'',
      'object-src \'none\'',
      'base-uri \'self\'',
      'form-action \'self\'',
    ].join('; '))
  })
})
