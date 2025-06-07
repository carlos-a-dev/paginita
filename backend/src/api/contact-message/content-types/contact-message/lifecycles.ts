import { Data } from '@strapi/strapi'

const lifecycles = {
  async afterCreate({ result }) {
    try {
        const settings = (await strapi.db.query('api::contact-setting.contact-setting').findOne({
            populate: ['to', 'cc']
        })) as Data.ContentType<'api::contact-setting.contact-setting'>
        
        if (!settings.sendContactMessages) {
            return;
        }
        if (!settings.to) {
            console.warn('No recipients setup for Contact Messages. Disable Sent or add at least one "to" recipient.')
            return;
        }

        if (!settings.emailTemplateId) {
            console.warn('No email template set.');
            return;
        }

        const to = settings.to.map((recipient) => recipient.email)
        const cc = settings.cc.map((recipient) => recipient.email)
        const bcc = settings.bcc.map((recipient) => recipient.email)

        await strapi
            .plugin('email-designer-v5')
            .service('email')
            .sendTemplatedEmail(
                {
                to: to,
                cc: cc,
                bcc: bcc,
                replyTo: result.email,
                },
                { templateReferenceId: settings.emailTemplateId },
                {
                name: result.name,
                email: result.email,
                message: result.message,
                },
                result
            );

      await strapi.db.query('api::contact-message.contact-message').update({
        where: { id: result.id },
        data: { 
            sent: true
         },
      });
    } catch (error) {
        console.error(error.message);
    }
  },
};

export default lifecycles;
