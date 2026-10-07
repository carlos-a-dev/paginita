const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, dependencies = {}) {
  const source = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  const exports = {};
  vm.runInNewContext(source, {
    exports, require: name => dependencies[name] ?? require(name), URL, process, Date, Map, Set
  });
  return exports;
}
const helpers = load('utils/contact-submission.ts');
const valid = { name: ' Alice ', email: 'Alice@Example.com', message: 'A valid message with enough characters.' };

test('untrusted clients cannot spoof their IP via forwarded headers', () => {
  assert.equal(helpers.getClientIP('192.0.2.1', '198.51.100.1', []), '192.0.2.1');
  assert.equal(helpers.getClientIP('192.0.2.1', '198.51.100.1', ['127.0.0.1']), '192.0.2.1');
});
test('trusted proxy chain stops at the actual untrusted peer', () => {
  assert.equal(helpers.getClientIP('::ffff:127.0.0.1', '203.0.113.99, 198.51.100.1', ['127.0.0.1']), '198.51.100.1');
  assert.equal(helpers.getClientIP('127.0.0.1', '198.51.100.1, ::1', ['127.0.0.1', '::1']), '198.51.100.1');
  assert.equal(helpers.getClientIP('127.0.0.1', 'invalid', ['127.0.0.1']), '127.0.0.1');
  assert.equal(helpers.normalizeIP('2001:0db8:0000:0000:0000:0000:0000:0001'), '2001:db8::1');
});
test('contact validation enforces bounds and excludes server-controlled fields', () => {
  const result = helpers.validateContact({ ...valid, ip: 'spoof', sent: true });
  assert.equal(result.name, 'Alice');
  assert.equal(result.email, 'alice@example.com');
  assert.equal(result.ip, undefined);
  assert.equal(result.sent, undefined);
  for (const patch of [{ message: 'x'.repeat(20) }, { message: 'x'.repeat(501) }, { name: ' ' }, { name: 'x'.repeat(101) }, { email: 'bad' }, { phone: {} }]) {
    assert.throws(() => helpers.validateContact({ ...valid, ...patch }));
  }
  assert.doesNotThrow(() => helpers.validateContact({ ...valid, message: 'x'.repeat(500) }));
});
test('limiter blocks concurrent attempts and rotating IPs or emails, then expires', () => {
  const reserve = helpers.createSubmissionLimiter();
  assert.equal(reserve('192.0.2.1', 'alice@example.com', 1000), 0);
  assert.equal(reserve('192.0.2.1', 'different@example.com', 1000), 120);
  assert.equal(reserve('192.0.2.2', 'alice@example.com', 1000), 120);
  assert.equal(reserve('192.0.2.2', 'different@example.com', 1000), 0);
  assert.equal(reserve('192.0.2.1', 'alice@example.com', 121000), 0);
});
test('controller overwrites spoofed fields and returns 429 before a concurrent create', async () => {
  let writes = 0;
  const controller = load('api/contact-message/controllers/contact-message.ts', {
    '@strapi/strapi': { factories: { createCoreController: (_uid, factory) => Object.setPrototypeOf(factory({ strapi: { documents: () => ({ findFirst: async () => null }) } }), { create: async ctx => { writes++; return ctx.request.body; } }) } },
    '../../../utils/contact-submission': helpers
  }).default;
  const makeContext = () => ({
    req: { socket: { remoteAddress: '192.0.2.50' } },
    request: { body: { data: { ...valid, ip: '198.51.100.99', sent: true } } },
    get: () => '198.51.100.99', set: () => {},
    badRequest: () => 400, tooManyRequests: () => 429
  });
  const [first, second] = await Promise.all([controller.create(makeContext()), controller.create(makeContext())]);
  assert.equal(first.data.ip, '192.0.2.50');
  assert.equal(first.data.sent, false);
  assert.equal(second, 429);
  assert.equal(writes, 1);
  const invalid = makeContext();
  invalid.request.body.data.message = 'short';
  assert.equal(await controller.create(invalid), 400);
});

test('database cooldown survives limiter restart and supplies Retry-After', async () => {
  const controller = load('api/contact-message/controllers/contact-message.ts', {
    '@strapi/strapi': { factories: { createCoreController: (_uid, factory) => Object.setPrototypeOf(factory({ strapi: { documents: () => ({ findFirst: async () => ({ id: 1 }) }) } }), { create: async () => { throw new Error('Must not create'); } }) } },
    '../../../utils/contact-submission': helpers
  }).default;
  const headers = {};
  const ctx = {
    req: { socket: { remoteAddress: '192.0.2.51' } },
    request: { body: { data: valid } },
    get: () => '', set: (name, value) => { headers[name] = value; },
    badRequest: () => 400, tooManyRequests: () => 429
  };
  assert.equal(await controller.create(ctx), 429);
  assert.equal(headers['Retry-After'], '120');
});
