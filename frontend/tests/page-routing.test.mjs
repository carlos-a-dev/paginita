import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

function createPageHarness() {
  let requests = 0
  const states = new Map()
  const exports = {}
  const source = ts.transpileModule(
    readFileSync(new URL('../composables/usePage.ts', import.meta.url), 'utf8'),
    { compilerOptions: { module: ts.ModuleKind.CommonJS } },
  ).outputText
  runInNewContext(source, {
    exports,
    useRoute: () => ({ params: {}, path: '/' }),
    useState: (key, init) => {
      if (!states.has(key)) states.set(key, { value: init?.() })
      return states.get(key)
    },
    createError: details => Object.assign(new Error(details.statusMessage), details),
    useStrapi: () => ({
      find: async (_type, query) => {
        requests++
        return { data: [{ slug: query.filters.slug.$eq }] }
      },
    }),
  })
  return { page: exports.default(), requests: () => requests }
}

test('root and single-segment routes resolve complete CMS slugs', () => {
  const { page } = createPageHarness()
  for (const [slug, expected] of [[[], 'index'], ['', 'index'], [['about'], 'about'], ['about', 'about'], [['privacy-policy'], 'privacy-policy']]) {
    assert.equal(page.getSlug({ params: { slug }, path: '/' }), expected)
  }
  assert.equal(page.getSlug({ params: {}, path: '/' }), 'index')
  assert.equal(page.getSlug({ params: {}, path: '/about/' }), 'about')
})

test('nested and decoded-slash URLs return fatal 404 before CMS lookup', async () => {
  const { page, requests } = createPageHarness()
  for (const route of [
    { params: { slug: ['about', 'team'] }, path: '/about/team' },
    { params: { slug: ['about', 'team', 'member'] }, path: '/about/team/member' },
    { params: { slug: 'about/team' }, path: '/about/team' },
    { params: { slug: ['about/team'] }, path: '/about%2Fteam' },
    { params: {}, path: '/about/team/' },
  ]) {
    assert.throws(() => page.fetchRoutePage(route), error => error.statusCode === 404 && error.fatal === true)
  }
  assert.equal(requests(), 0)
})

test('a cached parent page never makes a nested URL resolve successfully', async () => {
  const { page, requests } = createPageHarness()
  const about = await page.fetchRoutePage({ params: { slug: ['about'] }, path: '/about' })
  assert.equal(about.value.slug, 'about')
  assert.throws(() => page.fetchRoutePage({ params: { slug: ['about', 'team'] }, path: '/about/team' }), error => error.statusCode === 404)
  assert.equal(requests(), 1)
})
