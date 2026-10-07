# Paginita frontend

The frontend uses Nuxt 4.6.0, Vue 3.5, Vue Router 5, Quasar 2.35, and the
current Nuxt Quasar, Image, Strapi, and ESLint modules. The existing pages,
components, layouts, and composables remain in the frontend root through
`srcDir: '.'`.

Use Node 24.21.0 from the repository's `.nvmrc` and pnpm 10.12.1. Install from
the repository root with `pnpm install --frozen-lockfile`. The frontend uses
Nuxt 4's TypeScript project references; run `pnpm --dir frontend typecheck`
from the root to check app, server, shared, and configuration code.

The Strapi module's single-type requests pass an empty document ID before
query parameters. Complex page/global population queries use `useStrapiClient`
with typed response data. Nuxt Image's custom `xs`/`xxl` screens are retained,
and responsive image helpers set WebP format and quality through modifiers.

TypeScript stays on 5.9.3 to support the compiler API used by Vue tooling and
the regression harness. The unused direct `qs` dependency was removed.

The shared SQLite driver was updated to 12.11.1 for Node 24 compatibility.
Strapi upgrade validation continues to use a separate local database with
email delivery disabled.

## CMS page URLs

The catch-all route in `pages/[...slug].vue` resolves CMS pages by a single
Strapi `slug`. Use one path segment when creating navigation links.

| URL | CMS lookup or response |
| --- | --- |
| `/` | Loads the page with slug `index`. |
| `/about` | Loads the page with slug `about`. |
| `/privacy-policy` | Loads the page with slug `privacy-policy`. |
| `/about/team` | Returns HTTP 404 before querying the CMS. |
| `/about%2Fteam` | Returns HTTP 404 when the route parameter contains a decoded slash. |

Single-segment URLs whose slug does not match a CMS page also return HTTP 404.
Nested paths never fall back to their first or last segment, even if the parent
page has already been loaded and cached. This applies to CMS pages handled by
the catch-all route; explicit Nuxt routes such as `/demo` use their own page.

Run the routing regression tests from the repository root:

```bash
node frontend/tests/page-routing.test.mjs
```

The tests cover the homepage, complete single-segment slugs, nested paths,
decoded slashes, and rejection of nested paths after a parent page is cached.

## Development

From the repository root, select the pinned Node runtime and install dependencies:

```bash
nvm install
nvm use
pnpm install --frozen-lockfile
```

Start Strapi and Nuxt together with `./paginita_dev.sh`, or run the frontend
with `pnpm --dir frontend dev`. It serves `http://localhost:3000` and expects
Strapi at `NUXT_PUBLIC_STRAPI_URL` (by default `http://localhost:1337`).

## Validation

From the repository root:

```bash
pnpm --dir frontend lint
pnpm --dir frontend typecheck
node frontend/tests/page-routing.test.mjs
pnpm --dir frontend build
```

## Production

Build with `pnpm --dir frontend build` and start with
`pnpm --dir frontend start`. The generated Node server stays at
`frontend/.output/server/index.mjs`, matching the PM2 configuration.

Install and select Node 24.21.0 before deploying; both the build process and
PM2's frontend process must use a supported runtime. Set `NUXT_PUBLIC_SITE_URL`
and `NUXT_PUBLIC_STRAPI_URL` to the production URLs.

Quasar Extras v2 uses the `fontawesome-v7` font package. The custom Sass module
forwards Quasar variables so the existing styles remain available under the
Quasar module's `@use` pipeline.
