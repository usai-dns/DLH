#!/usr/bin/env bash
# Run the full local stack (api + serve on shared D1 state + portal) and the
# portal customer-flow E2E. Assumes schema + template already seeded into
# .wrangler-shared (scripts/seed-db.sh does the remote equivalent).
set -euo pipefail
cd "$(dirname "$0")/.."

PERSIST="$PWD/.wrangler-shared"
LOGDIR="${TMPDIR:-/tmp}/dlh-e2e-logs"
mkdir -p "$LOGDIR"

cleanup() { pkill -f "wrangler dev" 2>/dev/null || true; pkill -f "serve portal" 2>/dev/null || true; }
trap cleanup EXIT

( cd serve && npx wrangler dev --port 8787 --persist-to "$PERSIST" >"$LOGDIR/serve.log" 2>&1 ) &
( cd api && npx wrangler dev --port 8788 --inspector-port 9230 --persist-to "$PERSIST" >"$LOGDIR/api.log" 2>&1 ) &
npx serve portal -l 8090 >"$LOGDIR/portal.log" 2>&1 &

echo "waiting for stack..."
for i in $(seq 1 60); do
  ok=1
  curl -sf http://127.0.0.1:8787/ >/dev/null 2>&1 || ok=0
  curl -sf http://127.0.0.1:8788/api/templates >/dev/null 2>&1 || ok=0
  curl -sf http://127.0.0.1:8090/ >/dev/null 2>&1 || ok=0
  [ "$ok" = 1 ] && break
  sleep 1
done
[ "$ok" = 1 ] || { echo "stack failed to start; logs in $LOGDIR"; exit 1; }

PORTAL_E2E=1 PORTAL_URL=http://127.0.0.1:8090 \
E2E_API=http://127.0.0.1:8788 E2E_SERVE=http://127.0.0.1:8787 \
PW_BASE_URL=http://127.0.0.1:8090 \
npx playwright test tests/portal-flow.spec.js --reporter=line
