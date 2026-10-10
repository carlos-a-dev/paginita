# Contact endpoint abuse protection

The server checks the honeypot when present; the form now sends it in the API
payload. It is discarded before saving or emailing. Bots can leave honeypots
empty, so this is only one signal, not proof that a sender is human.

The single backend process reserves IP submission slots synchronously, before
validation or database work. One IP can attempt a submission every two minutes.
An endpoint-wide ceiling defaults to 120 distinct eligible IP attempts in a
rolling minute. Each backend installation can set CONTACT_GLOBAL_SUBMISSION_LIMIT
to an integer from 1 to 1000 for its own traffic. Repeated requests from one IP do not consume additional global
slots. Both protections return HTTP 429 with Retry-After. Successful submissions
are also checked in the database so restarting the process does not reset their
cooldown or the recent-submission ceiling.

Unverified email addresses do not create cooldowns: someone submitting another
person's email cannot block that person at a different IP. Blacklist rules are
still applied, and server-owned fields remain excluded from user input.

Set CONTACT_TRUSTED_PROXIES to the exact reverse-proxy socket addresses. An empty
setting ignores forwarded headers; behind a proxy this can make all visitors
share one IP. Do not trust arbitrary proxies or user-controlled headers.

This is application-level backpressure for the current one-process backend.
Configure host/proxy request limits for volumetric traffic. Before scaling the
backend to multiple workers, use a shared atomic limiter; database count checks
alone cannot reserve concurrent capacity across processes. If sustained bot
traffic occurs below the ceiling, add a server-verified bot challenge. Do not
claim that a honeypot or an IP address establishes the sender's identity.

Validation covers filled honeypots, direct controller calls, concurrent calls,
email-address impersonation, endpoint-wide limits, and database cooldowns after
a process restart. No production messages are submitted by these tests.
