# Privacy policy authoring guide

Create a CMS page with the slug matching NUXT_PUBLIC_PRIVACY_POLICY_PATH. Replace
all placeholders, remove inapplicable sections, and review against actual
business practices before publishing. This guide is not a universal legal policy.

Suggested content for a Markdown Content component:

```markdown
# Privacy Policy

Effective date: [date]

[Legal operator name] operates [site URL]. Contact [privacy contact] with questions
about this notice or information you have provided.

## Information and purposes

[Describe name, email, optional phone, message, IP address, submission timestamps,
and delivery status as applicable. Explain inquiry handling, abuse prevention,
hosting logs, and any other processing performed by this site.]

Please do not submit passwords, payment details, government identification
numbers, or medical information through the contact form.

## Cookies and providers

[Explain the theme preference cookie, actual analytics or advertising, external
font requests, hosting and email providers, notification recipients, and links
to third-party services used by this installation.]

## Retention and protection

[State the site's approved retention period and any exceptions. Describe email,
exports, provider logs, and backup expiry accurately. Describe actual safeguards
without promising absolute security.]

## Requests, audience, and changes

[Provide a monitored privacy contact, applicable request procedures, identity
verification, legal retention limitations, intended audience, and update process.]
```

Set page-specific title, description, canonical URL, and indexing settings in
the CMS. Site names and locations, contact addresses, provider descriptions,
retention periods, and effective dates belong in each site's content rather
than shared frontend code.
