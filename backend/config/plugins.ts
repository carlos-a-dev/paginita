export default ({ env }) => ({
  'material-symbols': true,
  email: {
    config: {
      // For community providers pass the full package name (e.g. provider: 'strapi-provider-email-mandrill')
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY')
      },
      settings: {
        defaultFrom: env('SENDGRID_EMAIL_FROM'),
        defaultReplyTo: env('SENDGRID_EMAIL_REPLY_TO'),
        testAddress: env('SENDGRID_EMAIL_TEST_ADDRESS')
      }
    }
  },
  'email-designer-v5': { enabled: true }
});
