import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

function load(file, modules = {}) {
  const exports = {}
  runInNewContext(ts.transpileModule(readFileSync(new URL(`../utils/${file}`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, { exports, URL, require: name => modules[name] })
  return exports
}
const seo = load('seo.ts')
const { robotsTxt } = load('aiCrawlers.ts')
const { llmsTxt } = load('llms.ts', { '~/utils/seo': seo })

test('robots.txt blocks AI training crawlers only when asked, and never search crawlers', () => {
  const open = robotsTxt({ siteUrl: 'https://alvasori.net/' })
  assert(!open.includes('GPTBot'))
  assert.match(open, /User-agent: \*\nAllow: \/\n\nSitemap: https:\/\/alvasori\.net\/sitemap\.xml\n$/)
  const blocked = robotsTxt({ siteUrl: 'https://alvasori.net/', blockAiTraining: true })
  for (const agent of ['GPTBot', 'ClaudeBot', 'Google-Extended', 'CCBot']) assert(blocked.includes(`User-agent: ${agent}\n`))
  for (const agent of ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Claude-SearchBot', 'Googlebot']) assert(!blocked.includes(agent))
  assert.match(blocked, /User-agent: Bytespider\nDisallow: \/\n\nUser-agent: \*\nAllow: \//)
  assert.equal(robotsTxt({ siteUrl: 'http://localhost:3000/', blockAiTraining: true }), 'User-agent: *\nDisallow: /\n')
})

test('FAQ markup lists only complete questions', () => {
  const schema = JSON.parse(JSON.stringify(seo.faqSchema({ pageUrl: 'https://alvasori.net/', items: [
    { question: ' What do you do? ', answer: 'Systems.' }, { question: 'No answer', answer: ' ' },
  ] })))
  assert.equal(schema['@type'], 'FAQPage')
  assert.deepEqual(schema.mainEntity, [{ '@type': 'Question', 'name': 'What do you do?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Systems.' } }])
  assert.equal(seo.faqSchema({ pageUrl: 'https://alvasori.net/', items: [] }), undefined)
})

test('llms.txt summarizes the business from CMS data', () => {
  const text = llmsTxt({
    siteName: 'AlvaSori', siteDescription: 'Helps small\nbusinesses.',
    organization: { legalName: 'AlvaSori LLC', email: 'info@alvasori.net', addressLocality: 'St. Johns', addressRegion: 'FL', addressCountry: 'US', areaServed: 'Florida\nUnited States' },
    contactUrl: 'https://alvasori.net/contact',
    services: [{ title: '🎨 Web Design', description: 'Sites [that] sell.' }, { title: ' ' }],
    pages: [{ title: 'Home', url: 'https://alvasori.net/' }, { title: 'About', url: 'https://alvasori.net/about', description: 'Who we are' }],
  })
  assert.equal(text, [
    '# AlvaSori', '', '> Helps small businesses.', '',
    '- Legal name: AlvaSori LLC', '- Based in: St. Johns, FL, US', '- Serves: Florida, United States', '- Email: info@alvasori.net', '- Contact form: https://alvasori.net/contact', '',
    '## Services', '', '- Web Design: Sites that sell.', '',
    '## Pages', '', '- [Home](https://alvasori.net/)', '- [About](https://alvasori.net/about): Who we are', '',
  ].join('\n'))
})
