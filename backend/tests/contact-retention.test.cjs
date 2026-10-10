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

test('each installation must choose a retention period before enabling deletion', () => {
  const configExports = {};
  runInNewContext(
    ts.transpileModule(readFileSync(require.resolve('../config/server.ts'), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS }
    }).outputText,
    { exports: configExports, require: () => exportsForTest }
  );
  const configuration = (enabled, days) => {
    const env = (_name, fallback) => fallback;
    env.bool = () => enabled;
    env.int = (name, fallback) =>
      name === 'CONTACT_RETENTION_DAYS' ? (days ?? fallback) : fallback;
    env.array = () => [];
    return configExports.default({ env });
  };
  assert.equal(configuration(false).cron.enabled, false);
  assert.throws(() => configuration(true));
  assert.throws(() => configuration(true, 0));
  assert.equal(configuration(true, 90).cron.enabled, true);
  assert.equal(configuration(true, 365).cron.enabled, true);
});
