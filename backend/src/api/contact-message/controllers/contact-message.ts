/**
 * contact-message controller
 */

import { factories } from '@strapi/strapi';
import {
  checkFormToken,
  createSubmissionLimiter,
  spamReason,
  getClientIP,
  validateContact,
  SUBMISSION_TIMEFRAME_MS,
  GLOBAL_SUBMISSION_LIMIT,
  GLOBAL_SUBMISSION_WINDOW_MS
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

      // Limit direct API calls, including invalid bodies, before doing database work.
      const retryAfter = reserveSubmission(ip);
      if (retryAfter) {
        ctx.set('Retry-After', String(retryAfter));
        return ctx.tooManyRequests('Please wait before submitting another message.');
      }

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

      // Spam: answer as if accepted, but don't save or notify, so bots learn nothing.
      const accepted = () => {
        ctx.status = 201;
        ctx.body = { data: { accepted: true } };
      };
      const secret = process.env.CONTACT_FORM_SECRET?.trim();
      if (secret) {
        const token = checkFormToken(input.formToken, secret);
        if (token === 'too-fast') {
          strapi.log.warn('Contact message dropped as spam: sent too soon after the form loaded.');
          return accepted();
        }
        if (token !== 'ok') {
          return ctx.badRequest('This form has expired. Please reload the page and try again.');
        }
      }
      const reason = spamReason(data as { name: string; email: string; message: string });
      if (reason) {
        strapi.log.warn(`Contact message dropped as spam: ${reason}.`);
        return accepted();
      }

      // Keep successful submissions limited across process restarts, too.
      const recent = await strapi.documents('api::contact-message.contact-message').findFirst({
        filters: {
          ip,
          createdAt: { $gte: new Date(Date.now() - SUBMISSION_TIMEFRAME_MS).toISOString() }
        }
      });
      const globalCount = await strapi.documents('api::contact-message.contact-message').count({
        filters: {
          createdAt: { $gte: new Date(Date.now() - GLOBAL_SUBMISSION_WINDOW_MS).toISOString() }
        }
      });
      if (globalCount >= GLOBAL_SUBMISSION_LIMIT) {
        ctx.set('Retry-After', String(GLOBAL_SUBMISSION_WINDOW_MS / 1000));
        return ctx.tooManyRequests('Please wait before submitting another message.');
      }
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
