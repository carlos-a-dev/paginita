import type { Core, Data } from '@strapi/strapi';
import { deliveryError, sendContactEmail } from './contact-email';

const UID = 'api::contact-message.contact-message';
const MAX_BULK = 50;

type SendResult = { documentId: string; sent: boolean; error?: string };

/** Sends one message's notification email and marks it sent; never throws. */
async function sendOne(strapi: Core.Strapi, documentId: string): Promise<SendResult> {
  const message = (await strapi.documents(UID).findOne({ documentId })) as Data.ContentType<typeof UID> | null;
  if (!message) return { documentId, sent: false, error: 'Contact message not found.' };
  try {
    await sendContactEmail(strapi, message, { requireEnabled: false });
    return { documentId, sent: true };
  } catch (error) {
    const { status, reason } = deliveryError(error);
    strapi.log.error('Manual contact email delivery failed', { messageId: message.id, status, reason });
    return { documentId, sent: false, error: reason };
  }
}

const canSend = (ctx) => !!ctx.state.userAbility?.can('plugin::content-manager.explorer.update', UID);

/**
 * Admin-only routes behind the "Send email" actions on contact messages.
 * Both require an admin session with permission to update contact messages.
 *   POST /contact-message-delivery/:documentId/send   one message
 *   POST /contact-message-delivery/send               { documentIds: [...] } (bulk)
 */
export function registerContactDeliveryRoute(strapi: Core.Strapi) {
  strapi.server.routes({
    type: 'admin',
    prefix: '/contact-message-delivery',
    routes: [
      {
        method: 'POST',
        path: '/:documentId/send',
        handler: async (ctx) => {
          if (!canSend(ctx)) return ctx.forbidden('You do not have permission to send contact messages.');
          const result = await sendOne(strapi, ctx.params.documentId);
          if (result.error === 'Contact message not found.') return ctx.notFound(result.error);
          if (!result.sent) {
            ctx.status = 502;
            ctx.body = { data: null, error: { status: 502, name: 'DeliveryError', message: result.error } };
            return;
          }
          ctx.body = { data: result };
        },
        config: { policies: [] },
        info: { apiName: 'contact-message', type: 'admin' }
      },
      {
        method: 'POST',
        path: '/send',
        handler: async (ctx) => {
          if (!canSend(ctx)) return ctx.forbidden('You do not have permission to send contact messages.');
          const ids = ctx.request.body?.documentIds;
          if (!Array.isArray(ids) || !ids.length || !ids.every((id) => typeof id === 'string' && id.length <= 64)) {
            return ctx.badRequest('documentIds must be a non-empty list of document IDs.');
          }
          const unique = [...new Set(ids as string[])];
          if (unique.length > MAX_BULK) return ctx.badRequest(`Send at most ${MAX_BULK} messages at a time.`);
          // One at a time keeps provider rate limits and logs simple.
          const results: SendResult[] = [];
          for (const documentId of unique) results.push(await sendOne(strapi, documentId));
          ctx.body = { data: { results, sentCount: results.filter((r) => r.sent).length, failedCount: results.filter((r) => !r.sent).length } };
        },
        config: { policies: [] },
        info: { apiName: 'contact-message', type: 'admin' }
      }
    ]
  });
}
