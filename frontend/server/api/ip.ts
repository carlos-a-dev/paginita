import type { H3Event } from 'h3'

export default defineEventHandler((event) => {
  const ip = getRequestIP(event)
  return { ip }
})

// Utility to extract IP (can handle proxies if needed)
function getRequestIP(event: H3Event): string {
  const forwarded = getHeader(event, 'x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]
  return event.node.req.socket.remoteAddress || ''
}
