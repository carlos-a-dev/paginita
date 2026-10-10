# Per-site privacy notice

Privacy policies are CMS content. The normal catch-all page route serves their
body and SEO; there is no repository page overriding a site's policy.

Publish a page in each site's Strapi installation and set
NUXT_PUBLIC_PRIVACY_POLICY_PATH to its path. The default is /privacy-policy;
/data-protection is another supported example. Only a single CMS slug is allowed,
consistent with existing page routing. External URLs, nested paths, and executable
URLs are rejected. An explicitly empty setting omits the links for deployments
that intentionally do not provide a privacy page.

The footer and contact form use this setting. The normal sitemap includes
published CMS policies according to their own indexing and canonical settings.
No policy URL is fabricated when its page is missing or unpublished.

## Content to review for each site

Use privacy-policy-template.md as an authoring guide, not a policy to publish
without customization. Enter the site's legal identity, privacy contact,
effective date, service providers, processing purposes, location, and actual
retention policy. Confirm practices outside the application as well.

Describe contact fields, IP and abuse controls, the theme cookie, and providers
actually used by that installation. The current frontend uses Google Fonts and
the backend config uses SendGrid; update disclosures if those integrations change.
Do not assume every site uses analytics, newsletters, social links, or WhatsApp.
Do not publish unverified promises about selling data or regional privacy rights.

Before release, apply the site's retention period to the database, inboxes,
exports, provider records, and backups. Designate a privacy-request owner and
incident owner. See contact-data-policy.md. Verify privacy links, published CMS
content, SEO, and mobile navigation in that deployment.

Legal requirements depend on the operator and affected jurisdictions. The original
Florida audit is preserved separately in legal/florida.md; it is not the policy
for every CMS installation. Obtain site-specific legal review where needed.

These changes do not publish CMS content or alter live provider settings.
