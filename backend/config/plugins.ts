export default ({ env }) => ({
  'material-symbols': true,
  // EMAIL_PROVIDER=smtp sends through any SMTP server (e.g. Zoho Mail);
  // otherwise SendGrid. Contact notifications use whichever is configured.
  email: {
    config:
      env('EMAIL_PROVIDER', 'sendgrid') === 'smtp'
        ? {
            provider: 'nodemailer',
            providerOptions: {
              host: env('SMTP_HOST'),
              port: env.int('SMTP_PORT', 465),
              secure: env.bool('SMTP_SECURE', true),
              ...(env('SMTP_USERNAME')
                ? { auth: { user: env('SMTP_USERNAME'), pass: env('SMTP_PASSWORD') } }
                : {})
            },
            settings: {
              // SMTP servers like Zoho only send From the authenticated mailbox (or its aliases).
              defaultFrom: env('EMAIL_FROM', env('SMTP_USERNAME')),
              defaultReplyTo: env('EMAIL_REPLY_TO', env('EMAIL_FROM', env('SMTP_USERNAME')))
            }
          }
        : {
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
  'email-designer-v5': { enabled: true },
  seo: { enabled: true }
});
