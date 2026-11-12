#!/usr/bin/env bash
# Tells IndexNow search engines (Bing, Yandex, Seznam, Naver...) that pages changed.
# Usage: ops/indexnow.sh <site-url> [url ...]
#
#   With only the site URL, submits every URL in its sitemap.xml.
#   With URLs, submits just those (they must be on the same host).
#
# The key comes from <site-url>/indexnow-key.txt (NUXT_INDEXNOW_KEY), which
# also proves ownership. Google does not use IndexNow; use Search Console.
set -euo pipefail

SITE="${1:?Usage: ops/indexnow.sh <site-url> [url ...]}"; shift
SITE="${SITE%/}"
ENDPOINT="${INDEXNOW_ENDPOINT:-https://api.indexnow.org/indexnow}"

KEY_LOCATION="$SITE/indexnow-key.txt"
KEY=$(curl -fsS --max-time 20 "$KEY_LOCATION") || { echo "No IndexNow key at $KEY_LOCATION (set NUXT_INDEXNOW_KEY and redeploy)." >&2; exit 1; }

if (( $# )); then
  URLS=$(printf '%s\n' "$@")
else
  URLS=$(curl -fsS --max-time 30 "$SITE/sitemap.xml" | grep -oE '<loc>[^<]+</loc>' | sed -E 's#</?loc>##g; s/&amp;/\&/g')
fi
[[ -n "$URLS" ]] || { echo "No URLs to submit." >&2; exit 1; }

BODY=$(SITE="$SITE" KEY="$KEY" KEY_LOCATION="$KEY_LOCATION" URLS="$URLS" python3 -I -c '
import json, os, sys, urllib.parse
host = urllib.parse.urlsplit(os.environ["SITE"]).hostname
urls = [u for u in os.environ["URLS"].split() if u]
other = [u for u in urls if urllib.parse.urlsplit(u).hostname != host]
if other: sys.exit("Not on " + host + ": " + " ".join(other))
print(json.dumps({"host": host, "key": os.environ["KEY"].strip(), "keyLocation": os.environ["KEY_LOCATION"], "urlList": urls}))
')

echo "Submitting $(wc -l <<<"$URLS") URL(s) to $ENDPOINT"
STATUS=$(curl -sS --max-time 30 -o /dev/stderr -w '%{http_code}' -H 'Content-Type: application/json; charset=utf-8' --data "$BODY" "$ENDPOINT")
case "$STATUS" in
  200) echo "200 OK: submitted." ;;
  202) echo "202 Accepted: received; the key file is checked shortly." ;;
  *) echo "IndexNow returned HTTP $STATUS" >&2; exit 1 ;;
esac
