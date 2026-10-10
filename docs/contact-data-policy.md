# Contact data retention and incident response

## Retention controls

The website stores contact names, email addresses, optional phone numbers,
messages, IP addresses, and delivery status. Configured email recipients receive
copies through the configured email provider. Abuse logs must not contain submission bodies or field
values; they record only the rejection reason and rule identifier.

Database cleanup is opt-in. `CONTACT_RETENTION_ENABLED=false` is the default.
There is no shared retention period. Each site operator must choose and set
`CONTACT_RETENTION_DAYS` to an integer from 1 to 3650 before enabling cleanup.
Enabling it with an absent or invalid period fails configuration validation.
Review existing inquiries, legal holds, email retention, and backup expiry first.
The period is a business policy choice, not a statutory default.
Restart the backend after changing configuration. Cleanup runs daily at 03:00 UTC
and deletes all contact records created before the cutoff, including records
whose notification email was not delivered. Review unresolved inquiries first.

This job does not erase email, provider logs, existing application logs,
exports, or backup copies. The operator must apply the chosen policy to those
systems too. Preserve a specific record when legally required, and keep cleanup
disabled while necessary holds are assessed. Restrict database and backup access,
protect storage with encryption, and limit CMS contact access to staff who need
it. Audit Public and Authenticated roles after CMS permission changes.

## Incident procedure

1. Assign an incident owner and record when the incident was discovered. Preserve
   evidence and isolate compromised credentials or systems. Stop further access.
2. Determine the information accessed, affected people, and relevant jurisdictions.
   Data types and affected locations determine which breach rules apply.
3. Obtain legal review promptly and identify required recipients, deadlines,
   exceptions, and the evidence needed to support notification decisions.
4. Coordinate with hosting, email providers, and other processors under their
   contracts and applicable law. Track when each party was notified.
5. Document remediation, notifications, and the legal basis for any exception.
   Verify restoration and monitor for recurrence. Review the retention policy.

For sites with Florida obligations, see [the jurisdiction-specific reference](legal/florida.md).
Other sites need their own legal review; Florida requirements are not CMS defaults.

The operator still needs to enable cleanup, designate an incident owner,
and verify email, backup, hosting, and access controls. This document does
not certify legal compliance or the production infrastructure.

## Deployment scope

These settings and cleanup apply to the entire backend installation, not an
individual domain. Use a separate backend/database for each independently managed
site. This change does not add tenant identification, per-tenant cleanup, or
access isolation to a shared backend. Do not enable cleanup in a shared database
until its records and policies can be scoped safely.
