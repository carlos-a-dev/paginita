const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');
const exportsForTest = {};
runInNewContext(
  ts.transpileModule(readFileSync(require.resolve('../src/utils/contact-retention.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS }
  }).outputText,
  { exports: exportsForTest, Date, Number }
);
const { retentionCutoff, purgeExpiredContacts } = exportsForTest;

test('retention cutoff preserves the boundary and rejects dangerous configuration', () => {
  assert.equal(
    retentionCutoff(180, Date.UTC(2026, 9, 10)).toISOString(),
    '2026-04-13T00:00:00.000Z'
  );
  for (const days of [0, -1, NaN, 1.5, 3651]) assert.throws(() => retentionCutoff(days));
});
test('cleanup deletes only expired contacts and logs counts without message data', async () => {
  let filter;
  const logs = [];
  const strapi = {
    db: {
      query: (uid) => {
        assert.equal(uid, 'api::contact-message.contact-message');
        return {
          deleteMany: async (options) => {
            filter = options.where;
            return { count: 2 };
          }
        };
      }
    },
    log: { info: (...args) => logs.push(args) }
  };
  await purgeExpiredContacts(strapi, 180);
  assert(filter.createdAt.$lt instanceof Date);
  assert.deepEqual(JSON.parse(JSON.stringify(logs)), [
    ['Expired contact records deleted', { count: 2 }]
  ]);
  filter = undefined;
  await assert.rejects(purgeExpiredContacts(strapi, 0));
  assert.equal(filter, undefined);
});
