import { send } from "process";

const lifecycles = {
  async afterCreate({ result }) {
    try {
        // 1. Fetch recipient emails from singleton
    // const settings = await strapi.entityService.findOne(
    //   'api::notification-settings.notification-settings',
    //   {} // no ID needed for singleton
    // );

    // const rawRecipients = settings?.recipients ?? '';
    // const recipients: string[] = Array.isArray(rawRecipients)
    //   ? rawRecipients
    //   : rawRecipients
    //       .split(',')
    //       .map((email: string) => email.trim())
    //       .filter(Boolean);

    // 2. Send email using a template defined in Strapi Admin
    await strapi
      .plugin('email-designer-v5')
      .service('email')
      .sendTemplatedEmail(
        {
          to: 'carlos.alexander.dev@gmail.com',
          replyTo: result.email
        },
        {
          templateReferenceId: 2, // must match Admin templateRef
        },
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
