# SEO audit and remediation

Audited production read-only and the local production clone on 2026-10-07.
The database has seven published pages plus seven draft revisions; the draft
rows are expected Strapi storage, not duplicate public pages.

## Findings and fixes

| Finding | Fix |
| --- | --- |
| Contact, About, and Links have no SEO component and reuse the global title/description | Add page-specific SEO to both published and draft revisions; require SEO for future CMS pages |
| Homepage SEO describes SEO services while the page describes broader business systems and automation | Align its title, description, Open Graph fields, and keywords with the current content |
| Global `siteDescription` says “A Blog made with Strapi” | Use the existing business-focused global SEO description |
| ASAS Creativo's Open Graph URL points to the partner site | Point sharing metadata to the actual `/asas-creativo` page |
| Fallback canonical/OG URLs become stale during navigation and include tracking queries | Derive them reactively from the current path; omit query strings/fragments and ignore global page-specific URLs |
| Page metadata does not consistently inherit a default sharing image | Merge page/global image fallbacks and output absolute HTTP(S) URLs |
| No sitemap or structured data is configured | Add a published-page sitemap, robots discovery, and Organization/WebSite/page JSON-LD defaults |
| Demo and error pages have no indexing policy | Mark them `noindex`; exclude the demo from the CMS sitemap |

The frontend emits one canonical link, description, viewport, and JSON-LD
script after server rendering and client navigation. CMS structured data and
robot directives remain authoritative. Generated schema uses only the site
name, URLs, logo, and page metadata; no address, ratings, or other business
claims are invented. JSON-LD serialization escapes script-closing characters.

## Reviewable database corrections

The proposed content is in `backend/data/seo/updates.json`. The script updates
only SEO components, their page links, the global description, and affected
`updated_at` timestamps. It preserves page bodies, media relationships,
contact messages, and draft/published status. It does not publish draft content.

Audit any SQLite copy without changing it, from the repository root:

```bash
python3 backend/scripts/optimize-seo.py --database backend/.tmp/data.db
```

With the backend stopped, apply the reviewed changes:

```bash
python3 backend/scripts/optimize-seo.py --database backend/.tmp/data.db --apply
```

Applying creates a consistent `.before-seo-TIMESTAMP` backup beside the database
and uses a transaction. Reapplying is a no-op. For production, use the actual
production database path after reviewing the JSON plan, with the backend stopped;
restart it afterward. Production data has not been modified by this branch work.

The local database and the separate `strapi-upgrade-test.db` copy have been
corrected. Both are ignored by Git. The script and JSON plan make the same
corrections reproducible when this branch is deployed.

## Configuration and validation

Set `NUXT_PUBLIC_SITE_URL` to the public frontend origin and
`NUXT_PUBLIC_STRAPI_URL` to the CMS origin. The sitemap uses only published,
indexable CMS pages and excludes external canonicals. Keep the Public role's
page/global read permissions enabled for the frontend and sitemap.

```bash
pnpm --dir frontend lint
pnpm --dir frontend typecheck
node frontend/tests/seo.test.mjs
node frontend/tests/page-routing.test.mjs
node frontend/tests/sitemap.test.mjs
pnpm --dir frontend build
```

Browser checks cover all seven page titles/descriptions, canonical and Open
Graph URLs, image fallbacks, JSON-LD, server-rendered tags, navigation updates,
demo/error indexing, `/sitemap.xml`, and `/robots.txt`. Database checks verify
backup creation, idempotence, all seven published pages, and unchanged content,
media, and messages. Search rankings and search-engine indexing were not tested.

References:
- [Google canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Nuxt reactive SEO metadata](https://nuxt.com/docs/api/composables/use-seo-meta)

## Production HTTP cache policy

The read-only production check found `Expires` 30 days in the future and
`Cache-Control: max-age=2592000` on HTML for `/` and `/contact`. Nginx's frontend
location applies the same long lifetime to rendered HTML, so browsers may keep
outdated metadata after deployment.

`ops/nginx-seo-cache.patch` is prepared against the current
`/etc/nginx/sites-available/default`. It changes HTML to `private, no-cache`,
keeps one-year immutable caching for hashed `/_nuxt/` assets, and preserves the
image provider's own cache headers for `/_ipx/`. It does not change TLS or backend
proxy settings. The proposed directives were syntax-checked in an isolated
Nginx configuration; the live configuration was not edited or reloaded.

After reviewing the patch, an administrator can back up the site configuration,
apply it, test the complete configuration (including production TLS), and reload:

```bash
sudo cp -a /etc/nginx/sites-available/default /etc/nginx/sites-available/default.before-seo
sudo patch --dry-run -p1 -d / < ops/nginx-seo-cache.patch
sudo patch -p1 -d / < ops/nginx-seo-cache.patch
sudo nginx -t && sudo systemctl reload nginx
```

Check public response headers after applying it. Existing browser-cached HTML
may require a refresh; the new policy prevents new month-long HTML caches.
