# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

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

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
