# Browser security headers

The production Nuxt server sends a Content Security Policy that permits its
own scripts and hashes of framework-generated inline scripts. CMS page content
is excluded from hash generation. Inline event handlers, frames, objects, and
cross-origin form submissions are blocked. Google Fonts and the configured
Strapi origin are allowed for the resources they supply. Development skips CSP
to allow hot reload; verify a production build.

The Google Fonts stylesheet uses a normal stylesheet link because inline
`onload` attributes are blocked. Quasar needs inline styles, so `style-src`
permits those while script execution remains restricted.

Responses also carry framing protection, MIME sniffing protection, a referrer
policy, and restrictions on camera, microphone, and geolocation. HSTS is enabled
for production when `NUXT_PUBLIC_SITE_URL` starts with `https://`. It does not
include subdomains or preload; those require a separate hosting decision.

Nginx must preserve the application headers. Its independently served static
assets should also carry `X-Content-Type-Options: nosniff`. If streaming rendering
or a new external integration is introduced, revalidate the CSP before release.

After deployment, inspect headers on `/`, `/contact`, and `/privacy-policy`;
check the browser console for CSP violations; navigate between pages and switch
the color theme. Never submit a live contact form just to test these headers.
