import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

const exports = {}
runInNewContext(ts.transpileModule(readFileSync(new URL('../utils/seo.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports, URL })
const { buildSeo, serializeSchema, isIndexable, servicesSchema, parseAreaServed } = exports
const base = {
  siteUrl: 'https://alvasori.net/', mediaUrl: 'https://strapi.alvasori.net/', siteName: 'AlvaSori',
  siteDescription: 'Business systems and digital solutions', siteLogo: '/strapi/uploads/logo.png', path: '/contact?utm_source=test#form',
  global: { metaTitle: 'Home title', metaDescription: 'Global description', canonicalURL: 'https://alvasori.net/', openGraph: { ogUrl: 'https://alvasori.net/', ogTitle: 'Global OG title' }, metaImage: { url: '/uploads/default.png' } },
}

test('page URLs exclude tracking parameters and never inherit global canonical or OG URLs', () => {
  const seo = buildSeo(base)
  assert.equal(seo.canonical, 'https://alvasori.net/contact')
  assert.equal(seo.ogUrl, seo.canonical)
  assert.equal(seo.title, 'Contact | AlvaSori')
  assert.equal(seo.ogTitle, seo.title)
  assert.equal(seo.description, 'Global description')
  assert.equal(seo.image, 'https://strapi.alvasori.net/uploads/default.png')
})
test('page metadata overrides defaults and relative URLs become absolute', () => {
  const seo = buildSeo({ ...base, page: { metaTitle: 'Contact our team', metaDescription: 'Page description', canonicalURL: '/contact?utm_source=test#form', openGraph: { ogImage: { url: '/uploads/contact.png' }, ogType: 'article' } } })
  assert.equal(seo.title, 'Contact our team')
  assert.equal(seo.ogTitle, seo.title)
  assert.equal(seo.description, 'Page description')
  assert.equal(seo.canonical, 'https://alvasori.net/contact')
  assert.equal(seo.image, 'https://strapi.alvasori.net/uploads/contact.png')
  assert.equal(seo.ogType, 'article')
})
test('invalid CMS URLs and OG types safely fall back', () => {
  const seo = buildSeo({ ...base, page: { canonicalURL: 'javascript:alert(1)', openGraph: { ogUrl: 'data:text/html,test', ogType: 'invalid' } } })
  assert.equal(seo.canonical, 'https://alvasori.net/contact')
  assert.equal(seo.ogUrl, seo.canonical)
  assert.equal(seo.ogType, 'website')
})
test('structured data identifies the correct page and encodes script-closing content safely', () => {
  const seo = buildSeo(base)
  const graph = JSON.parse(seo.structuredData)['@graph']
  assert.equal(graph[2]['@type'], 'ContactPage')
  assert.equal(graph[2].url, seo.canonical)
  assert.equal(graph[0].logo, 'https://strapi.alvasori.net/uploads/logo.png')
  const hostile = { name: '</script><script>alert(1)</script> & \u2028' }
  const serialized = serializeSchema(hostile)
  assert(!serialized.includes('<'))
  assert.deepEqual(JSON.parse(serialized), hostile)
})
test('explicit CMS schema and noindex settings remain authoritative', () => {
  const seo = buildSeo({ ...base, page: { metaRobots: 'noindex, follow', structuredData: { '@context': 'https://schema.org', '@type': 'FAQPage' } } })
  assert.equal(seo.robots, 'noindex, follow')
  assert.equal(JSON.parse(seo.structuredData)['@type'], 'FAQPage')
})

test('noindex and none directives exclude a page while ordinary directives do not', () => {
  assert.equal(isIndexable('index, follow'), true)
  assert.equal(isIndexable('noindex, follow'), false)
  assert.equal(isIndexable('NONE'), false)
  assert.equal(isIndexable('max-snippet:0'), true)
})

const organization = {
  legalName: 'AlvaSori LLC', email: 'info@alvasori.net', telephone: ' ',
  addressLocality: 'St. Johns', addressRegion: 'FL', addressCountry: 'US', areaServed: 'Florida\nUnited States, Florida',
}

test('organization data comes from the CMS and omits empty fields', () => {
  const socialUrls = ['https://www.instagram.com/alvasorillc', 'https://wa.me/15555550100?text=hi', 'javascript:alert(1)', 'https://x.com/AlvaSoriLLC', 'https://www.instagram.com/alvasorillc']
  const org = JSON.parse(buildSeo({ ...base, organization, socialUrls }).structuredData)['@graph'][0]
  assert.equal(org.legalName, 'AlvaSori LLC')
  assert.equal(org.description, 'Business systems and digital solutions')
  assert.deepEqual(org.address, { '@type': 'PostalAddress', 'addressLocality': 'St. Johns', 'addressRegion': 'FL', 'addressCountry': 'US' })
  assert.deepEqual(org.areaServed, ['Florida', 'United States'])
  assert.deepEqual(org.sameAs, ['https://www.instagram.com/alvasorillc', 'https://x.com/AlvaSoriLLC'])
  assert.equal(org.telephone, undefined)
  assert.deepEqual(org.contactPoint, { '@type': 'ContactPoint', 'contactType': 'customer support', 'email': 'info@alvasori.net', 'url': 'https://alvasori.net/contact' })

  const bare = JSON.parse(buildSeo(base).structuredData)['@graph'][0]
  assert.deepEqual(Object.keys(bare).sort(), ['@id', '@type', 'description', 'logo', 'name', 'url'])
})

test('services become Service offers provided by the organization', () => {
  const catalog = JSON.parse(JSON.stringify(servicesSchema({
    siteUrl: 'https://alvasori.net/', pageUrl: 'https://alvasori.net/', areaServed: organization.areaServed,
    services: [{ title: '🎨 Web Design', description: 'Websites' }, { title: '  ', description: 'no name' }, { title: 'SEO' }],
  })))
  assert.equal(catalog['@type'], 'OfferCatalog')
  assert.deepEqual(catalog.itemListElement.map(offer => offer.itemOffered.name), ['Web Design', 'SEO'])
  assert.deepEqual(catalog.itemListElement[0].itemOffered.provider, { '@id': 'https://alvasori.net/#organization' })
  assert.deepEqual(catalog.itemListElement[0].itemOffered.areaServed, ['Florida', 'United States'])
  assert.equal(servicesSchema({ siteUrl: 'https://alvasori.net/', pageUrl: 'https://alvasori.net/', services: [] }), undefined)
  assert.equal(parseAreaServed(undefined).length, 0)
})
