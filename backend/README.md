# 🚀 Getting started with Strapi

## Strapi version and upgrades

The backend uses Strapi **5.57.0**, with the official color picker,
users-permissions plugin, SendGrid provider, and utilities pinned to the same
version. The SEO plugin has its own release numbering and stays pinned to
**2.0.9**; do not change it to the Strapi core version.

Use Node 24 LTS for production. The package engine range matches Strapi's
published range (`>=20.0.0 <=26.x.x`). Install dependencies from the repository
root with `pnpm install --frozen-lockfile`; the workspace's root `pnpm-lock.yaml`
is the lockfile used for deployment.

Before deploying an upgrade, take a consistent database backup. Strapi applies
its internal database migrations during startup. If rolling back after startup,
restore both the previous application version and the pre-upgrade database.

The 5.57.0 upgrade was applied with the official upgrade tool and tested against
a separate copy of the production database with contact email delivery disabled.
Production must keep its own `.env` and database configuration; the local test
database is not part of the deployment.

Contact submissions accept only name (1–100 characters), email (up to 254), optional
phone (up to 50), and message (21–500). The server sets IP and delivery state.
One validated attempt per IP or normalized email is allowed every two minutes;
rejected attempts return HTTP 429 with `Retry-After`.

Forwarded headers are ignored by default. Set `CONTACT_TRUSTED_PROXIES` to the
exact socket addresses of your reverse proxies, for example `127.0.0.1,::1` for
a local proxy. Configure each trusted proxy to overwrite or append the actual
peer to `X-Forwarded-For`. IP resolution walks the chain from right to left and
stops at the first untrusted address. Do not list client addresses as proxies.

The concurrency limiter runs in memory in the single backend process configured
in `ecosystem.config.cjs`; database checks preserve successful-submission limits
after restarts. Multiple backend processes require a shared atomic limiter before
scaling. Keep public role permissions restricted to contact-message `create`;
read, update, and delete must remain restricted to administrators.

Run contact protection regression tests with `node --test tests/contact-submission.test.cjs`.

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>

## Contact email delivery

A received contact enquiry is stored before email forwarding. `sent: true`
means the provider accepted it; it does not prove inbox delivery. Provider
failures leave the stored enquiry unsent and log its message ID, HTTP status,
and sanitized provider reason without logging the submission or credentials.

Sending requires enabled contact settings, recipients, an existing template
reference, a valid SendGrid sender/API key, and available sending allowance.
The production investigation on 2026-10-08 found a valid key with `mail.send`
permission, but sandbox mail validation returned HTTP 401 with
`Maximum credits exceeded`. Restore the account's allowance in SendGrid before
retesting. A sandbox request validates configuration without delivering mail.

Existing unsent messages remain available in Strapi. Do not automatically
replay them; select the enquiries to forward after provider access is restored.
