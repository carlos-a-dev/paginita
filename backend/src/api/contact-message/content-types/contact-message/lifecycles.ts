import { Data } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const SUBMISSION_TIMEFRAME_MS = 2 * 60 * 1000; // 2 minutes

const lifecycles = {
  async beforeCreate(event) {
    const data = event.params.data as Data.ContentType<'api::contact-message.contact-message'>;

    // Check for recent submissions from the same IP or email to prevent spam/abuse
    const existingMessage: Pick<
      Data.ContentType<'api::contact-message.contact-message'>,
      'id'
    > | null = await strapi.documents('api::contact-message.contact-message').findFirst({
      fields: ['id'],
      filters: {
        $or: [{ ip: { $eq: data.ip, $notNull: true } }, { email: data.email }],
        createdAt: {
          $gte: new Date(Date.now() - SUBMISSION_TIMEFRAME_MS)
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (existingMessage) {
      // A recent message from this IP or email already exists.
      strapi.log.warn(
        `Possible bot! Duplicate contact message attempt within ${SUBMISSION_TIMEFRAME_MS / 1000 / 60} minutes.`,
        data
      );
      throw new errors.ApplicationError('Something went wrong');
    }
  },
  async afterCreate(event: { result: Data.ContentType<'api::contact-message.contact-message'> }) {
    const { result } = event;
    try {
      const settings = (await strapi.db.query('api::contact-setting.contact-setting').findOne({
        populate: ['to', 'cc']
      })) as Data.ContentType<'api::contact-setting.contact-setting'>;

      if (!settings.sendContactMessages) {
        return;
      }
      if (settings.to.length < 1) {
        strapi.log.warn(
          'No recipients setup for Contact Messages. Disable Sent or add at least one "to" recipient.'
        );
        return;
      }

      if (!settings.emailTemplateId) {
        strapi.log.warn('No email template set.');
        return;
      }

      const to = settings.to.map((recipient) => recipient.email);
      const cc = settings.cc?.map((recipient) => recipient.email) ?? [];
      const bcc = settings.bcc?.map((recipient) => recipient.email) ?? [];

      await strapi.plugin('email-designer-v5').service('email').sendTemplatedEmail(
        {
          to: to,
          cc: cc,
          bcc: bcc,
          replyTo: result.email
        },
        { templateReferenceId: settings.emailTemplateId },
        {
          name: result.name,
          email: result.email,
          phone: result.phone,
          message: result.message
        },
        result
      );

      await strapi.db.query('api::contact-message.contact-message').update({
        where: { id: result.id },
        data: {
          sent: true
        }
      });
    } catch (error) {
      strapi.log.error(error.message, error);
    }
  }
};

export default lifecycles;
