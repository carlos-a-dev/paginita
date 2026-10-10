import { purgeExpiredContacts, retentionCutoff } from '../src/utils/contact-retention';

export default ({ env }) => {
  const retentionEnabled = env.bool('CONTACT_RETENTION_ENABLED', false);
  const retentionDays = env.int('CONTACT_RETENTION_DAYS', 0);
  if (retentionEnabled) retentionCutoff(retentionDays);
  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    app: {
      keys: env.array('APP_KEYS')
    },
    cron: {
      enabled: retentionEnabled,
      tasks: {
        contactRetention: {
          task: async ({ strapi }) => {
            try {
              await purgeExpiredContacts(strapi, retentionDays);
            } catch {
              strapi.log.error('Contact retention cleanup failed; inspect database availability.');
            }
          },
          options: { rule: '0 0 3 * * *', tz: 'UTC' }
        }
      }
    }
  };
};
