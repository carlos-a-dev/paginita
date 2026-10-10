# Privacy notice release checklist

The repository now owns `/privacy-policy` as an explicit Nuxt page. It takes
precedence over the older CMS page at that URL. Update the repository page when
practices change; editing the old CMS page will not change the public notice.
The sitemap includes the repository route and ignores the obsolete CMS metadata.

The contact form and footer link directly to the policy. The notice describes
IP collection and abuse controls, the theme cookie, Google Fonts, external social
links, CMS storage, and SendGrid notifications. It avoids unverified claims about
analytics, newsletters, selling information, or automatic regional rights.

The business approved a 365-day contact retention policy. Before publishing:

- Set CONTACT_RETENTION_DAYS=365 and enable database cleanup after checking legal
  holds and unresolved inquiries. See contact-data-policy.md.
- Apply retention procedures to recipient inboxes, exports, provider records,
  and backups; record the backup expiry schedule. The database job cannot do this.
- Assign responsibility for privacy requests at info@alvasori.net and incident
  response. Verify that the mailbox is monitored.
- Confirm the notice against actual hosting, provider, and business practices,
  including any processing outside this application. Seek Florida legal review
  for the final business policy and applicable obligations.

Florida §501.204 prohibits unfair or deceptive commercial practices, including
potentially misleading privacy promises. The lack of a cookie-consent banner is
not automatically a Florida violation. The Digital Bill of Rights' controller
requirements are narrow, including a revenue threshold and other criteria; do
not apply its full notice requirements to this business without checking scope.

Sources:
https://www.flsenate.gov/Laws/Statutes/2026/501.204
https://www.flsenate.gov/Laws/Statutes/2026/501.702

No production CMS content, provider settings, inboxes, or backups were changed
as part of this branch. Those operational steps are necessary before publication
so the policy describes actual practice.
