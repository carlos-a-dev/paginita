const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/utils/contact-email.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText, { exports: exportsObject });
const { deliverContactEmail, deliveryError } = exportsObject;

function harness({ reject = false, template = true, enabled = true } = {}) {
  const sends = [], updates = [], errors = [], queries = [];
  const strapi = {
    db: { query: uid => ({
      findOne: async options => {
        queries.push([uid, options]);
        if (uid.includes('contact-setting')) return { sendContactMessages: enabled, emailTemplateId: 2, to: [{ email: 'owner@example.com' }], cc: [], bcc: [{ email: 'archive@example.com' }] };
        return template ? { id: 2 } : null;
      },
      update: async options => updates.push(options)
    }) },
    plugin: () => ({ service: () => ({ sendTemplatedEmail: async (...args) => {
      sends.push(args);
      if (reject) throw { code: 401, message: 'Unauthorized', response: { body: { errors: [{ message: 'Maximum credits exceeded' }] } } };
      // The SendGrid provider resolves undefined on successful acceptance.
      return undefined;
    } }) }),
    log: { error: (...args) => errors.push(args) }
  };
  return { strapi, sends, updates, errors, queries };
}
const message = { id: 25, name: 'Visitor', email: 'visitor@example.com', phone: '', message: 'An enquiry with sufficient content.' };

test('quota failure preserves unsent state and logs the provider reason', async () => {
  const h = harness({ reject: true });
  await deliverContactEmail(h.strapi, message);
  assert.equal(h.updates.length, 0);
  assert.equal(h.errors[0][1].status, 401);
  assert.equal(h.errors[0][1].reason, 'Maximum credits exceeded');
  assert.equal(h.errors[0][1].messageId, 25);
});
test('successful provider acceptance marks sent and includes configured BCC', async () => {
  const h = harness();
  await deliverContactEmail(h.strapi, message);
  assert.equal(h.updates[0].data.sent, true);
  assert.equal(h.updates[0].where.id, 25);
  assert.equal(h.sends[0][0].bcc[0], 'archive@example.com');
  assert(h.queries[0][1].populate.includes('bcc'));
});
test('missing template never falsely marks the message sent', async () => {
  const h = harness({ template: false });
  await deliverContactEmail(h.strapi, message);
  assert.equal(h.sends.length, 0);
  assert.equal(h.updates.length, 0);
  assert(h.errors[0][1].reason.includes('template does not exist'));
});
test('disabled forwarding still preserves the message without sending', async () => {
  const h = harness({ enabled: false });
  await deliverContactEmail(h.strapi, message);
  assert.equal(h.sends.length, 0);
  assert.equal(h.updates.length, 0);
});
test('delivery diagnostics exclude email addresses and provider tokens', () => {
  const summary = deliveryError({ message: 'Bad address visitor@example.com using SG.secret.token\nfailed' });
  assert(!summary.reason.includes('visitor@example.com'));
  assert(!summary.reason.includes('SG.secret.token'));
  assert(!summary.reason.includes('\n'));
});
