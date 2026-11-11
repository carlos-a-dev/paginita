export default [
  'strapi::logger',
  'strapi::errors',
  // 'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          // CSP keywords must keep their single quotes; an unquoted self is read as a hostname.
          'script-src': ["'self'", 'editor.unlayer.com', 'strapi.alvasori.net'],
          'frame-src': ["'self'", 'editor.unlayer.com', 'strapi.alvasori.net'],
          upgradeInsecureRequests: null
        }
      }
    }
  }
];
