#!/usr/bin/env bash
# Apply the DLH schema and seed the anniversary template + a test card.
# Idempotent: CREATE TABLE IF NOT EXISTS + INSERT OR IGNORE throughout.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "== applying schema =="
npx wrangler d1 execute dlh-db --remote --file=schema/schema.sql

echo "== seeding template + test card =="
npx wrangler d1 execute dlh-db --remote --command "
INSERT OR IGNORE INTO customers (id, email, name)
  VALUES ('cust_seed', 'dennis@example.com', 'Dennis');
INSERT OR IGNORE INTO templates (id, name, description, preview_image, price_cents, billing, status, assets_prefix)
  VALUES ('anniversary-dance-2026', 'Anniversary — Dance Lessons',
          'Interactive dance-style picker with music, venue info, and a spotlight celebration.',
          'assets/images/main-cut.png', 1997, 'yearly', 'active', 'anniversary-dance-2026');
INSERT OR IGNORE INTO orders (id, customer_id, template_id, status, amount_cents)
  VALUES ('ord_seed', 'cust_seed', 'anniversary-dance-2026', 'paid', 1997);
INSERT OR IGNORE INTO cards (id, order_id, customer_id, template_id, slug, config, status, published_at)
  VALUES ('card_test1', 'ord_seed', 'cust_seed', 'anniversary-dance-2026',
          'dennis-loves-hallie-test', '{}', 'published', datetime('now'));
"

echo "== done =="
