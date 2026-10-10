import { Data } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import { deliverContactEmail } from '../../../../utils/contact-email';
import { SUBMISSION_TIMEFRAME_MS } from '../../../../utils/contact-submission';

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
      sort: {
        createdAt: 'desc'
      }
    });

    if (existingMessage) {
      // A recent message from this IP or email already exists.
      strapi.log.warn(
        `Duplicate contact message attempt within ${SUBMISSION_TIMEFRAME_MS / 1000 / 60} minutes.`
      );
      throw new errors.ApplicationError('Something went wrong');
    }

    // Check blacklisted
    const settings = (await strapi.db.query('api::contact-setting.contact-setting').findOne({
      populate: ['blacklist']
    })) as Data.ContentType<'api::contact-setting.contact-setting'>;

    (settings?.blacklist ?? []).forEach((rule) => {
      const regex = new RegExp(rule.rule);
      if (regex.test(data[rule.field])) {
        // A recent message from this IP or email already exists.
        strapi.log.warn(`Contact message blocked. Rule: ${rule.id} | Field: ${rule.field}.`);
        throw new errors.ApplicationError('Something went wrong');
      }
    });
  },
  async afterCreate(event: { result: Data.ContentType<'api::contact-message.contact-message'> }) {
    await deliverContactEmail(strapi, event.result);
  }
};

export default lifecycles;
