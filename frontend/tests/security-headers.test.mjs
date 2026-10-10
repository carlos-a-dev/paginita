import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

const originsExports = {}
runInNewContext(ts.transpileModule(readFileSync(new URL('../server/utils/cspOrigins.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, { exports: originsExports, URL, Set })

test('CSP authorizes framework scripts but never hashes CMS body scripts', () => {
  let hook
  const exports = {}
  const require = createRequire(import.meta.url)
  const source = readFileSync(new URL('../server/plugins/security.ts', import.meta.url), 'utf8').replaceAll('import.meta.dev', 'false')
  runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, {
    exports, URL, Set,
    defineNitroPlugin: plugin => plugin({ hooks: { hook: (_name, callback) => { hook = callback } } }),
    require: (name) => {
      if (name === '../utils/cspOrigins') return originsExports
      if (name === 'nuxt/server') return {
        useRuntimeConfig: () => ({
          public: { strapi: { url: 'https://cms.example.test/path' } },
          security: { styleOrigins: 'https://styles.example.test', fontOrigins: 'https://fonts.example.test', imageOrigins: 'https://images.example.test', connectOrigins: 'https://api.example.test' },
        }),
      }
      return require(name)
    },
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
  assert(policy.includes('connect-src \'self\' https://cms.example.test https://api.example.test'))
  assert(policy.includes('style-src \'self\' \'unsafe-inline\' https://styles.example.test'))
  assert(policy.includes('font-src \'self\' https://fonts.example.test'))
  assert(policy.includes('img-src \'self\' data: blob: https://cms.example.test https://images.example.test'))
})

test('CSP origin configuration rejects executable schemes and directive injection', () => {
  const { cspOrigins } = originsExports
  assert.equal(cspOrigins('https://cms.example.test/path, https://cms.example.test').join(' '), 'https://cms.example.test')
  assert.equal(cspOrigins('').length, 0)
  for (const origin of ['javascript:alert(1)', '*', 'https://site.test;script-src', 'https://user:pass@site.test']) {
    assert.throws(() => cspOrigins(origin))
  }
})
