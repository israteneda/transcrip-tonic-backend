#!/usr/bin/env bash
# POST scripts/payload-example.json to the webhook. Set WEBHOOK_URL or pass as first arg.
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PAYLOAD="${SCRIPT_DIR}/payload-example.json"
URL="${1:-${WEBHOOK_URL}}"
if [ -z "$URL" ]; then
  echo "Usage: $0 <webhook_url>"
  echo "   or: WEBHOOK_URL=<url> $0"
  exit 1
fi
curl -s -w "\nHTTP %{http_code}\n" -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d @"$PAYLOAD"
