import type { Core } from '@strapi/strapi';

export function retentionCutoff(days: number, now = Date.now()): Date {
  if (!Number.isSafeInteger(days) || days < 1 || days > 3650) {
    throw new Error('CONTACT_RETENTION_DAYS must be an integer between 1 and 3650.');
  }
  return new Date(now - days * 24 * 60 * 60 * 1000);
}

export async function purgeExpiredContacts(strapi: Core.Strapi, days: number): Promise<void> {
  const cutoff = retentionCutoff(days);
  const result = await strapi.db.query('api::contact-message.contact-message').deleteMany({
    where: { createdAt: { $lt: cutoff } }
  });
  strapi.log.info('Expired contact records deleted', { count: result.count });
}
