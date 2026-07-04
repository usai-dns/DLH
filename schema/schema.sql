-- DLH portal schema. Idempotent: CREATE TABLE IF NOT EXISTS only, no drops.
-- Note: card config lives in cards.config (TEXT JSON) until the API token
-- gains R2 permissions; template files ship as Workers Assets with dlh-serve.

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  stripe_customer_id TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  preview_image TEXT,
  price_cents INTEGER NOT NULL DEFAULT 1997,
  billing TEXT NOT NULL DEFAULT 'yearly',
  status TEXT NOT NULL DEFAULT 'active',      -- active | draft | archived
  assets_prefix TEXT NOT NULL,                -- path prefix in the serving worker's assets
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customers(id),
  template_id TEXT NOT NULL REFERENCES templates(id),
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',     -- pending | paid | expired | cancelled
  amount_cents INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id),
  customer_id TEXT NOT NULL REFERENCES customers(id),
  template_id TEXT NOT NULL REFERENCES templates(id),
  slug TEXT NOT NULL UNIQUE,
  custom_domain TEXT UNIQUE,
  config TEXT NOT NULL DEFAULT '{}',          -- customer field selections (JSON)
  status TEXT NOT NULL DEFAULT 'draft',       -- draft | published | suspended
  published_at TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_cards_slug ON cards(slug);
CREATE INDEX IF NOT EXISTS idx_cards_domain ON cards(custom_domain);
CREATE INDEX IF NOT EXISTS idx_cards_customer ON cards(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
