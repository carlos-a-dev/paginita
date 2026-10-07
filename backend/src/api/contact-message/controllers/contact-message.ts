/**
 * contact-message controller
 */

import { factories } from '@strapi/strapi';
import {
  createSubmissionLimiter,
  getClientIP,
  validateContact,
  SUBMISSION_TIMEFRAME_MS
} from '../../../utils/contact-submission';

const reserveSubmission = createSubmissionLimiter();

export default factories.createCoreController(
  'api::contact-message.contact-message',
  ({ strapi }) => ({
    async create(ctx) {
      const ip = getClientIP(
        ctx.req.socket.remoteAddress ?? '',
        ctx.get('x-forwarded-for'),
        (process.env.CONTACT_TRUSTED_PROXIES ?? '').split(',')
      );
      if (!ip) return ctx.badRequest('Unable to determine client address.');

      const input = ctx.request.body?.data;
      if (!input || typeof input !== 'object' || Array.isArray(input)) {
        return ctx.badRequest('Contact data is required.');
      }
      let data: Record<string, string>;
      try {
        data = validateContact(input);
      } catch (error) {
        return ctx.badRequest(error.message);
      }

      const retryAfter = reserveSubmission(ip, data.email);
      if (retryAfter) {
        ctx.set('Retry-After', String(retryAfter));
        return ctx.tooManyRequests('Please wait before submitting another message.');
      }

      // Keep successful submissions limited across process restarts, too.
      const recent = await strapi.documents('api::contact-message.contact-message').findFirst({
        filters: {
          $or: [{ ip }, { email: data.email }],
          createdAt: { $gte: new Date(Date.now() - SUBMISSION_TIMEFRAME_MS).toISOString() }
        }
      });
      if (recent) {
        ctx.set('Retry-After', String(SUBMISSION_TIMEFRAME_MS / 1000));
        return ctx.tooManyRequests('Please wait before submitting another message.');
      }

      // Only accept contact fields; IP and delivery state belong to the server.
      ctx.request.body = { data: { ...data, ip, sent: false } };
      return super.create(ctx);
    }
  })
);
