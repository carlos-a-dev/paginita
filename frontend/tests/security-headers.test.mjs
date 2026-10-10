import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

test('CSP authorizes framework scripts but never hashes CMS body scripts', () => {
  let hook
  const exports = {}
  const require = createRequire(import.meta.url)
  const source = readFileSync(new URL('../server/plugins/security.ts', import.meta.url), 'utf8').replaceAll('import.meta.dev', 'false')
  runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, {
    exports, URL, Set,
    defineNitroPlugin: plugin => plugin({ hooks: { hook: (_name, callback) => { hook = callback } } }),
    require: name => name === 'nuxt/server' ? { useRuntimeConfig: () => ({ public: { strapi: { url: 'https://strapi.alvasori.net/path' } } }) } : require(name),
  })
  let policy
  hook({ head: ['<script>window.nuxt=true</script>'], bodyPrepend: [], bodyAppend: [], body: ['<script>window.evil=true</script>'] }, { event: { node: { res: { setHeader: (_key, value) => {
    policy = value
  } } } } })
  const hash = value => createHash('sha256').update(value).digest('base64')
  assert(policy.includes(hash('window.nuxt=true')))
  assert(!policy.includes(hash('window.evil=true')))
  assert(!policy.split(';')[1].includes('unsafe-inline'))
  assert(policy.includes('script-src-attr \'none\''))
  assert(policy.includes('frame-ancestors \'none\''))
  assert(policy.includes('connect-src \'self\' https://strapi.alvasori.net'))
})
