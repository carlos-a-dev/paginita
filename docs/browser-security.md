# Browser security headers

The production Nuxt server sends a Content Security Policy that permits its
own scripts and hashes of framework-generated inline scripts. CMS page content
is excluded from hash generation. Inline event handlers, frames, objects, and
cross-origin form submissions are blocked. The configured Strapi origin is allowed for CMS images and API calls.
Additional origins are configured independently for each deployment. Development skips CSP
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

## Per-site CSP configuration

Set NUXT_PUBLIC_SITE_URL and NUXT_PUBLIC_STRAPI_URL for each installation.
NUXT_SECURITY_STYLE_ORIGINS, NUXT_SECURITY_FONT_ORIGINS,
NUXT_SECURITY_IMAGE_ORIGINS, and NUXT_SECURITY_CONNECT_ORIGINS accept
comma-separated HTTP(S) origins. The first two default to the Google Fonts
services already used by the shared frontend; the others default to empty.
For different fonts, change the stylesheet in nuxt.config.ts and configure its
style and font origins together. Values are normalized to origins; executable
schemes, credentials, wildcards, and directive injection are rejected.

These settings are installation-wide. Run separate backend/frontend instances
for different sites; this configuration does not introduce tenant isolation
within a shared database or process.
