// import type { ApiContactSettingContactSetting } from '../../../../../types/generated/contentTypes';

const lifecycles = {
  async afterCreate({ result }) {
    try {
        const settings = (await strapi.db.query('api::contact-setting.contact-setting').findOne({
            populate: ['to', 'cc']
        }))
        
        if (!settings.sendContactMessages) {
            console.log(settings);
            return;
        }

        const to = settings.to.map((recipient) => recipient.email)
        const cc = settings.cc.map((recipient) => recipient.email)

    await strapi
      .plugin('email-designer-v5')
      .service('email')
      .sendTemplatedEmail(
        {
          to: to,
          cc: cc,
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
