import type { Organization } from '~/types/strapi/global'
import { parseAreaServed } from '~/utils/seo'

// One line of llms.txt text: no newlines, no Markdown link syntax from CMS text.
const line = (value?: string | null) => (value || '').replace(/\s+/g, ' ').replace(/[[\]]/g, '').trim()

export function llmsTxt(options: {
  siteName: string
  siteDescription?: string
  organization?: Organization | null
  contactUrl?: string
  services: { title?: string, description?: string }[]
  pages: { title: string, url: string, description?: string }[]
}): string {
  const org = options.organization || {}
  const location = [org.addressLocality, org.addressRegion, org.addressCountry].map(line).filter(Boolean).join(', ')
  const areas = parseAreaServed(org.areaServed)
  const facts = [
    org.legalName && `- Legal name: ${line(org.legalName)}`,
    location && `- Based in: ${location}`,
    areas.length && `- Serves: ${areas.map(line).join(', ')}`,
    org.email && `- Email: ${line(org.email)}`,
    options.contactUrl && `- Contact form: ${options.contactUrl}`,
  ].filter(Boolean)
  const services = options.services
    .map(service => ({ name: line(service.title?.replace(/^[^\p{L}\p{N}]+/u, '')), description: line(service.description) }))
    .filter(service => service.name)
  const out = [`# ${line(options.siteName)}`, '']
  if (options.siteDescription) out.push(`> ${line(options.siteDescription)}`, '')
  if (facts.length) out.push(...facts as string[], '')
  if (services.length) out.push('## Services', '', ...services.map(service => `- ${service.name}${service.description ? `: ${service.description}` : ''}`), '')
  if (options.pages.length) out.push('## Pages', '', ...options.pages.map(page => `- [${line(page.title)}](${page.url})${page.description ? `: ${line(page.description)}` : ''}`), '')
  return out.join('\n')
}
