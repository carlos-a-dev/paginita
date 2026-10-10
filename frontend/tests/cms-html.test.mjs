import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'
import MarkdownIt from 'markdown-it'
import attrs from 'markdown-it-attrs'

const exports = {}
runInNewContext(ts.transpileModule(readFileSync(new URL('../utils/sanitizeCmsHtml.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText, { exports, require: createRequire(import.meta.url) })
const { sanitizeCmsHtml } = exports

test('CMS HTML removes executable attributes, embeds and unsafe URLs', () => {
  const html = sanitizeCmsHtml('<script>alert(1)</script><iframe src="https://evil.example"></iframe><img src="x" onerror="alert(1)"><a href="javascript:alert(1)" onclick="alert(1)">link</a><svg onload="alert(1)"></svg>')
  assert(!/script|iframe|onerror|onclick|javascript:|svg/.test(html))
  assert.equal(sanitizeCmsHtml('<a href="&#106;avascript:alert(1)">x</a>'), '<a>x</a>')
  assert.equal(sanitizeCmsHtml('<img src="data:image/svg+xml,x">'), '<img />')
})

test('Markdown attributes cannot create event handlers and final HTML is sanitized', () => {
  const md = new MarkdownIt().use(attrs, { allowedAttributes: ['class', 'id'] })
  const html = sanitizeCmsHtml(md.render('![test](https://example.com/missing.png){onerror=alert(1)}\n\nText {.text-primary #intro onclick=alert(1)}'))
  assert(!html.includes('onerror='))
  assert(!html.includes('onclick='))
  assert(html.includes('class="text-primary"'))
  assert(html.includes('id="intro"'))
})

test('brand formatting and responsive content survive sanitization', () => {
  const brand = '<span class="text-primary">A</span>lva<span class="text-secondary">S</span>ori'
  assert.equal(sanitizeCmsHtml(brand), brand)
  const html = sanitizeCmsHtml('<h2 class="text-h2">Title</h2><pre><code class="hljs"><span class="hljs-keyword">const</span></code></pre><img src="/image.webp" srcset="/small.webp 400w, /large.webp 800w" sizes="100vw" alt="Example"><a href="/contact">Contact</a>')
  assert(html.includes('srcset='))
  assert(html.includes('hljs-keyword'))
  assert(html.includes('href="/contact"'))
})

test('sanitization also applies after insertion of a hostile styled site name', () => {
  assert.equal(sanitizeCmsHtml('<p>Welcome <span onclick="alert(1)">AlvaSori</span></p>'), '<p>Welcome <span>AlvaSori</span></p>')
})
