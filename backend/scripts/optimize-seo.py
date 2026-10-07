#!/usr/bin/env python3
"""Audit/apply reviewed SEO updates to a stopped Strapi SQLite database."""
import argparse
import datetime
import json
from pathlib import Path
import sqlite3

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--database', required=True, type=Path)
parser.add_argument('--apply', action='store_true', help='Back up and apply changes; otherwise audit only')
args = parser.parse_args()
plan = json.loads((Path(__file__).parents[1] / 'data/seo/updates.json').read_text())
for slug, values in plan['pages'].items():
    assert 1 <= len(values['title']) <= 60, slug
    assert 50 <= len(values['description']) <= 160, slug
assert args.database.is_file(), 'Database does not exist'
connection = sqlite3.connect(f'file:{args.database.resolve()}?mode={"rw" if args.apply else "ro"}', uri=True)
connection.row_factory = sqlite3.Row
assert connection.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
changes = []
for page in connection.execute('SELECT id, slug, published_at FROM pages ORDER BY id'):
    values = plan['pages'].get(page['slug'])
    if not values:
        continue
    link = connection.execute("SELECT cmp_id FROM pages_cmps WHERE entity_id = ? AND field = 'seo' AND component_type = 'shared.seo'", (page['id'],)).fetchone()
    seo = connection.execute('SELECT * FROM components_shared_seos WHERE id = ?', (link['cmp_id'],)).fetchone() if link else None
    desired = {'meta_title': values['title'], 'meta_description': values['description'], 'canonical_url': plan['siteUrl'] + ('' if page['slug'] == 'index' else page['slug'])}
    if 'keywords' in values:
        desired['keywords'] = values['keywords']
    differing = {key: value for key, value in desired.items() if not seo or seo[key] != value}
    og = connection.execute("SELECT cmp_id FROM components_shared_seos_cmps WHERE entity_id = ? AND field = 'openGraph'", (seo['id'],)).fetchone() if seo else None
    og_changes = {}
    if og:
        row = connection.execute('SELECT * FROM components_shared_open_graphs WHERE id = ?', (og['cmp_id'],)).fetchone()
        og_desired = {'og_title': values['title'], 'og_description': values['description'], 'og_url': desired['canonical_url'], 'og_type': 'website'}
        og_changes = {key: value for key, value in og_desired.items() if row[key] != value}
    if differing or og_changes:
        changes.append((page['id'], page['slug'], 'published' if page['published_at'] else 'draft', seo['id'] if seo else None, differing, og['cmp_id'] if og else None, og_changes))
for _, slug, status, _, fields, _, og_fields in changes:
    print(f'{slug} ({status}): SEO {json.dumps(fields)}; Open Graph {json.dumps(og_fields)}')
global_changes = list(connection.execute('SELECT id FROM globals WHERE site_description IS NOT ?', (plan['globalDescription'],)))
if global_changes:
    print('Global site description:', plan['globalDescription'])
if not args.apply:
    print('Audit only. Re-run with --apply against the stopped database to apply these changes.')
    raise SystemExit(0)
if not changes and not global_changes:
    print('SEO data is already optimized; no changes needed.')
    raise SystemExit(0)
backup = Path(str(args.database) + '.before-seo-' + datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ'))
with sqlite3.connect(backup) as destination:
    connection.backup(destination)
backup.chmod(0o600)
updated_at = int(datetime.datetime.now(datetime.timezone.utc).timestamp() * 1000)
with connection:
    for page_id, _, _, seo_id, fields, og_id, og_fields in changes:
        if seo_id is None:
            columns = ', '.join(fields)
            placeholders = ', '.join('?' for _ in fields)
            seo_id = connection.execute(f'INSERT INTO components_shared_seos ({columns}) VALUES ({placeholders})', tuple(fields.values())).lastrowid
            connection.execute("INSERT INTO pages_cmps (entity_id, cmp_id, component_type, field) VALUES (?, ?, 'shared.seo', 'seo')", (page_id, seo_id))
        elif fields:
            assignments = ', '.join(key + ' = ?' for key in fields)
            connection.execute(f'UPDATE components_shared_seos SET {assignments} WHERE id = ?', (*fields.values(), seo_id))
        connection.execute('UPDATE pages SET updated_at = ? WHERE id = ?', (updated_at, page_id))
        if og_fields:
            assignments = ', '.join(key + ' = ?' for key in og_fields)
            connection.execute(f'UPDATE components_shared_open_graphs SET {assignments} WHERE id = ?', (*og_fields.values(), og_id))
    if global_changes:
        connection.execute('UPDATE globals SET site_description = ?, updated_at = ?', (plan['globalDescription'], updated_at))
assert connection.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
print(f'Applied {len(changes)} page SEO updates. Backup: {backup}')
