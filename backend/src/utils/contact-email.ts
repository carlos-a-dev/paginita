import type { Core, Data } from '@strapi/strapi';

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

export function deliveryError(error: unknown): { status?: number; reason: string } {
  const details = record(error);
  const response = record(details.response);
  const body = record(response.body);
  const messages = Array.isArray(body.errors)
    ? body.errors.map((item) => record(item).message).filter((item) => typeof item === 'string')
    : [];
  const raw = messages.length
    ? messages.join('; ')
    : String(details.message || 'Unknown delivery error');
  const code = Number(details.code || response.statusCode);
  return {
    status: code >= 400 && code <= 599 ? code : undefined,
    reason: raw
      .replace(/SG\.[A-Za-z0-9_.-]+/g, '[redacted]')
      .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[email]')
      .replace(/[\r\n\t]/g, ' ')
      .slice(0, 500)
  };
}

export async function deliverContactEmail(
  strapi: Core.Strapi,
  result: Data.ContentType<'api::contact-message.contact-message'>
): Promise<void> {
  try {
    const settings = (await strapi.db.query('api::contact-setting.contact-setting').findOne({
      populate: ['to', 'cc', 'bcc']
    })) as Data.ContentType<'api::contact-setting.contact-setting'> | null;
    if (!settings?.sendContactMessages) return;
    if (!settings.to?.length) throw new Error('Contact email has no configured recipients');
    if (!settings.emailTemplateId) throw new Error('Contact email has no configured template');
    const template = await strapi.db
      .query('plugin::email-designer-v5.email-designer-template')
      .findOne({ where: { templateReferenceId: settings.emailTemplateId }, select: ['id'] });
    if (!template) throw new Error('The configured contact email template does not exist');

    await strapi
      .plugin('email-designer-v5')
      .service('email')
      .sendTemplatedEmail(
        {
          to: settings.to.map((recipient) => recipient.email),
          cc: settings.cc?.map((recipient) => recipient.email) ?? [],
          bcc: settings.bcc?.map((recipient) => recipient.email) ?? [],
          replyTo: result.email
        },
        { templateReferenceId: settings.emailTemplateId },
        { name: result.name, email: result.email, phone: result.phone, message: result.message }
      );
    await strapi.db.query('api::contact-message.contact-message').update({
      where: { id: result.id },
      data: { sent: true }
    });
  } catch (error) {
    // Preserve the saved enquiry. Log the actionable provider reason without its payload/PII.
    strapi.log.error('Contact email delivery failed', {
      messageId: result.id,
      ...deliveryError(error)
    });
  }
}
