# Contact data retention and incident response

## Retention controls

The website stores contact names, email addresses, optional phone numbers,
messages, IP addresses, and delivery status. Configured email recipients receive
copies through SendGrid. Abuse logs must not contain submission bodies or field
values; they record only the rejection reason and rule identifier.

Database cleanup is opt-in. `CONTACT_RETENTION_ENABLED=false` is the default.
Choose and approve a retention period before setting it to `true`, then set
`CONTACT_RETENTION_DAYS` to an integer from 1 to 3650. The example uses 180 days;
that is an implementation example, not a Florida statutory retention period.
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
   Ordinary names and email addresses alone do not necessarily qualify as personal
   information under Florida's breach statute. Free-text messages may qualify.
3. Obtain legal review promptly. Florida Statutes §501.171 generally requires
   affected-individual notice within 30 days after determination or reason to
   believe a qualifying breach occurred, subject to statutory exceptions. Notify
   the Department of Legal Affairs when 500 or more Florida individuals are
   affected; additional credit-reporting notice applies when more than 1,000
   individuals require notice at once. The 30-day period is not permission to wait.
4. Coordinate with hosting, email providers, and other processors. Third-party
   agents generally have a 10-day notification deadline to the covered entity.
5. Document remediation, notifications, and the legal basis for any exception.
   Verify restoration and monitor for recurrence. Review the retention policy.

Source: https://www.flsenate.gov/Laws/Statutes/2026/501.171

The operator still needs to choose the retention period, designate an incident
owner, and verify email, backup, hosting, and access controls. This document does
not certify legal compliance or the production infrastructure.
