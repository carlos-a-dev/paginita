import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

const exports = {}
runInNewContext(ts.transpileModule(readFileSync(new URL('../utils/privacyPolicy.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports })

test('each site can choose its CMS privacy slug or intentionally omit links', () => {
  assert.equal(exports.privacyPolicyPath('/privacy-policy'), '/privacy-policy')
  assert.equal(exports.privacyPolicyPath('/data-protection'), '/data-protection')
  assert.equal(exports.privacyPolicyPath(''), '')
})

test('privacy links cannot navigate to external, executable, or nested destinations', () => {
  for (const path of ['https://other.test/privacy', '//other.test', 'javascript:alert(1)', '/../privacy', '/about/privacy', '/privacy?redirect=other', '/privacy%2Fother']) {
    assert.throws(() => exports.privacyPolicyPath(path))
  }
})

test('CMS page routing remains authoritative for privacy content and SEO', () => {
  assert.equal(existsSync(new URL('../pages/privacy-policy.vue', import.meta.url)), false)
  const sitemap = readFileSync(new URL('../server/routes/sitemap.xml.ts', import.meta.url), 'utf8')
  assert(!sitemap.includes('entry.slug === \'privacy-policy\''))
  assert(!sitemap.includes('new URL(\'/privacy-policy\''))
})
