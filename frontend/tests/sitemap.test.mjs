import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

function transpile(relative, globals) {
  const exports = {}
  runInNewContext(ts.transpileModule(readFileSync(new URL(relative, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, { exports, URL, ...globals })
  return exports
}
const helpers = transpile('../utils/seo.ts', {})

test('sitemap fetches every published page, filters nonindexable/external pages, and escapes XML', async () => {
  const calls = []
  const module = transpile('../server/routes/sitemap.xml.ts', {
    require: (name) => {
      if (name === '~/utils/seo') return helpers
      if (name === 'nuxt/server') return {
        defineEventHandler: handler => handler,
        createError: details => Object.assign(new Error(details.message), details),
        useRuntimeConfig: () => ({ public: { siteUrl: 'https://site.example.test/', strapi: { url: 'https://cms.example.test', prefix: '/api' } } }),
      }
      throw new Error(name)
    },
    $fetch: async (url, options) => {
      calls.push([url, options.query])
      if (url.endsWith('/global')) return { data: { seo: { metaRobots: 'index, follow' } } }
      assert.equal(options.query.status, 'published')
      if (options.query['pagination[page]'] === 1) return {
        data: [{ slug: 'index' }, { slug: 'hidden', seo: { metaRobots: 'noindex, follow' } }, { slug: 'private', seo: { metaRobots: 'none' } }],
        meta: { pagination: { pageCount: 2 } },
      }
      return { data: [{ slug: 'about', updatedAt: '2026-10-07T12:00:00.000Z' }, { slug: 'partner', seo: { canonicalURL: 'https://other.example/' } }, { slug: 'escaped', seo: { canonicalURL: '/a&b' } }] }
    },
  })
  const headers = new Headers()
  const xml = await module.default({ res: { headers } })
  assert.equal(calls.length, 3)
  assert.equal((xml.match(/<url>/g) || []).length, 3)
  assert(xml.includes('<loc>https://site.example.test/</loc>'))
  assert(xml.includes('<lastmod>2026-10-07T12:00:00.000Z</lastmod>'))
  assert(xml.includes('<loc>https://site.example.test/a&amp;b</loc>'))
  assert(!xml.includes('hidden') && !xml.includes('private') && !xml.includes('other.example'))
  assert.equal(headers.get('content-type'), 'application/xml; charset=utf-8')
})

test('robots blocks local-development origins', async () => {
  const module = transpile('../server/routes/robots.txt.ts', {
    require: name => name === '~/utils/seo'
      ? helpers
      : {
          defineEventHandler: handler => handler,
          useRuntimeConfig: () => ({ public: { siteUrl: 'http://localhost:3000' } }),
        },
  })
  const response = await module.default({ res: { headers: new Headers() } })
  assert.equal(response, 'User-agent: *\nDisallow: /\n')
})
