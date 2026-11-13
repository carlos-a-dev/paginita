import type { Core, Data } from '@strapi/strapi';
import { deliveryError, sendContactEmail } from './contact-email';

const UID = 'api::contact-message.contact-message';

/**
 * Admin-only route behind the "Send email" action on contact messages:
 * POST /contact-message-delivery/:documentId/send
 * Requires an admin session with permission to update contact messages.
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
          const ability = ctx.state.userAbility;
          if (!ability?.can('plugin::content-manager.explorer.update', UID)) {
            return ctx.forbidden('You do not have permission to send contact messages.');
          }
          const message = (await strapi.documents(UID).findOne({
            documentId: ctx.params.documentId
          })) as Data.ContentType<typeof UID> | null;
          if (!message) return ctx.notFound('Contact message not found.');

          try {
            await sendContactEmail(strapi, message, { requireEnabled: false });
          } catch (error) {
            const { status, reason } = deliveryError(error);
            strapi.log.error('Manual contact email delivery failed', { messageId: message.id, status, reason });
            ctx.status = 502;
            ctx.body = { data: null, error: { status: 502, name: 'DeliveryError', message: reason, details: { providerStatus: status } } };
            return;
          }
          ctx.body = { data: { documentId: message.documentId, sent: true } };
        },
        config: { policies: [] },
        info: { apiName: 'contact-message', type: 'admin' }
      }
    ]
  });
}
