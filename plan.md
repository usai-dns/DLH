# DLH — Business Portal Plan

> Revised 2026-06-11. Verified against actual repo and Cloudflare account state.

---

## 1. What DLH Is

A **storefront and hosting platform for interactive digital gift cards.** Cards are engineered externally (by us, by Claude, by any design tool) and arrive as self-contained packages. DLH does four things:

1. **Catalog** — lists available card templates for customers to browse
2. **Configure** — lets customers open the live card and customize editable fields (images, text, music, prompts) by selecting from provided options
3. **Purchase** — Stripe checkout, order tracking
4. **Host** — publishes the configured card to a unique URL and serves it

DLH does NOT design or build cards. That's a separate project. DLH consumes finished card packages.

---

## 2. What Exists Today (verified)

### On `main` branch
- A single hardcoded anniversary card at `dennisloveshallie.com`
- Vanilla HTML/CSS/JS (155 lines HTML, 500 lines JS, 780 lines CSS)
- 6 dance style images + music tracks, couple photo (~127MB unoptimized)
- Playwright E2E tests (7 tests)
- Deployed via Cloudflare Pages project `dlh` (production domain: dennisloveshallie.com)
- Also deployed to Workers preview at `dlh-anniversary-preview.usai-dlh.workers.dev`

### On `valentines` branch
- Original Valentine's Day card (frozen, preserved)

### Cloudflare account (`f1d19cc490b902a854ac1b43b5808673`)
- Pages project `dlh` with custom domain dennisloveshallie.com
- Worker `dlh-anniversary-preview` for preview deploys
- **No D1 databases, R2 buckets, or KV namespaces exist for DLH yet**
- ~120 other workers (Forward Flow, CRM, etc.)

### What does NOT exist (previously claimed in plan.md)
- No `product` branch
- No `dlh-db` D1 database
- No `dlh-assets` R2 bucket
- No `dlh-worker` or `dlh-serving` workers
- No order pipeline or Stripe integration

---

## 3. Card Package Contract

A card template is a directory conforming to this spec. DLH doesn't care how the card was built — only that the package follows the contract.

### Package structure
```
card-package/
├── manifest.json          # Card metadata + editable field definitions
├── index.html             # The card (entry point)
├── style.css              # (optional, can be inlined)
├── script.js              # (optional, can be inlined)
├── assets/                # Static files the card references
│   ├── images/
│   └── music/
└── options/               # Selectable assets for editable fields
    ├── images/
    │   ├── photo-1.jpg
    │   ├── photo-2.jpg
    │   └── ...
    └── music/
        ├── track-1.mp3
        └── ...
```

### manifest.json
```json
{
  "id": "anniversary-dance-2026",
  "name": "Anniversary — Dance Lessons",
  "description": "Interactive dance style picker with music, venue info, and celebration.",
  "version": "1.0.0",
  "preview_image": "assets/images/preview.jpg",
  "price_cents": 1997,
  "billing": "yearly",

  "fields": [
    {
      "key": "card_title",
      "type": "text",
      "label": "Card title",
      "default": "Happy Anniversary,\nMy Love",
      "max_length": 80
    },
    {
      "key": "card_message",
      "type": "text",
      "label": "Card message",
      "default": "I love your body,\nmoving with my body…",
      "max_length": 200
    },
    {
      "key": "main_photo",
      "type": "image",
      "label": "Card photo",
      "default": "assets/images/main-cut.png",
      "options_dir": "options/images/"
    },
    {
      "key": "dance_styles",
      "type": "multi_select",
      "label": "Dance styles to include",
      "min": 2,
      "max": 6,
      "default": ["tango", "salsa", "ballroom", "swing", "hiphop", "country"],
      "options": [
        { "value": "tango", "label": "Tango" },
        { "value": "salsa", "label": "Salsa" },
        { "value": "ballroom", "label": "Ballroom" },
        { "value": "swing", "label": "Swing" },
        { "value": "hiphop", "label": "Hip Hop" },
        { "value": "country", "label": "Country" }
      ]
    },
    {
      "key": "intro_text",
      "type": "text",
      "label": "Intro screen text",
      "default": "I have something for you...",
      "max_length": 100
    }
  ],

  "config_key": "__CARD_CONFIG__"
}
```

### How cards consume config

The card reads `window.__CARD_CONFIG__` at load time. DLH injects this before the card's script:

```html
<script>window.__CARD_CONFIG__ = { ...customer selections... };</script>
<script src="script.js"></script>
```

The card applies the config to itself. DLH doesn't touch the card's DOM.

### Edit mode

When loaded with `?edit=true`, the card shows inline editing affordances. The card communicates with the DLH portal (which iframes the card) via postMessage:

```javascript
// Card emits on field change:
window.parent.postMessage({
  type: 'dlh:config_update',
  config: { ...updated config... }
}, '*');

// Card listens for config injection:
window.addEventListener('message', (e) => {
  if (e.data.type === 'dlh:set_config') {
    applyConfig(e.data.config);
  }
});
```

---

## 4. Architecture

### Services

| Service | Type | Name | Purpose |
|---|---|---|---|
| Portal | Pages | `dlh-portal` | Storefront: catalog, live configurator (iframes card), checkout |
| API | Worker | `dlh-api` | Order CRUD, Stripe webhooks, config storage |
| Card serving | Worker | `dlh-serve` | Slug → R2 template → inject config → serve |
| Database | D1 | `dlh-db` | Customers, orders, cards, template registry |
| Storage | R2 | `dlh-assets` | Card template packages + per-order configs |

### R2 layout
```
dlh-assets/
├── templates/
│   ├── anniversary-dance-2026/
│   │   ├── manifest.json
│   │   ├── index.html
│   │   ├── style.css
│   │   ├── script.js
│   │   ├── assets/...
│   │   └── options/...
│   └── valentine-2026/
│       └── ...
└── cards/
    ├── {slug}/
    │   └── config.json        # Customer's field selections
    └── ...
```

### D1 schema
```sql
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  stripe_customer_id TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  preview_image TEXT,
  price_cents INTEGER NOT NULL DEFAULT 1997,
  billing TEXT NOT NULL DEFAULT 'yearly',
  status TEXT NOT NULL DEFAULT 'active',
  r2_prefix TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customers(id),
  template_id TEXT NOT NULL REFERENCES templates(id),
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  amount_cents INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE cards (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id),
  customer_id TEXT NOT NULL REFERENCES customers(id),
  template_id TEXT NOT NULL REFERENCES templates(id),
  slug TEXT NOT NULL UNIQUE,
  custom_domain TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_cards_slug ON cards(slug);
CREATE INDEX idx_cards_domain ON cards(custom_domain);
```

Config lives in R2 (`cards/{slug}/config.json`), not D1. D1 handles identity and business state. R2 handles content.

### Serving flow
```
GET https://{slug}.dlhcards.com/
  → dlh-serve worker
  → D1: SELECT template_id, status FROM cards WHERE slug = ?
  → R2: get templates/{template_id}/index.html
  → R2: get cards/{slug}/config.json
  → Inject window.__CARD_CONFIG__ into HTML
  → Return (cache HTML 60s, assets 24h)

GET https://{slug}.dlhcards.com/assets/images/tango.jpg
  → R2: get templates/{template_id}/assets/images/tango.jpg → stream
```

### Portal configurator flow
```
Customer picks template
  → Portal loads card in iframe with ?edit=true
  → Card renders with defaults, shows edit affordances
  → Customer edits fields on the live card
  → Card emits dlh:config_update via postMessage
  → Portal captures config
  → "Preview" → reload iframe without ?edit=true
  → "Purchase" → Stripe checkout
  → Payment success → config.json written to R2, card published
  → Customer gets their URL
```

---

## 5. Repo Structure

```
DLH/
├── public/                  # Current anniversary card (dennisloveshallie.com)
├── portal/                  # Storefront (Pages site)
│   ├── index.html           # Card catalog
│   ├── configure.html       # Live configurator (iframes card)
│   ├── checkout.html
│   ├── success.html
│   ├── style.css
│   └── script.js
├── api/                     # dlh-api Worker
│   ├── src/
│   │   ├── index.js
│   │   └── routes/
│   │       ├── templates.js
│   │       ├── orders.js
│   │       ├── cards.js
│   │       └── webhooks.js
│   └── wrangler.jsonc
├── serve/                   # dlh-serve Worker
│   ├── src/
│   │   └── index.js
│   └── wrangler.jsonc
├── schema/
│   └── schema.sql
├── templates/               # Card packages (uploaded to R2)
│   ├── anniversary-dance-2026/
│   └── valentine-2026/
├── scripts/
│   ├── publish-template.sh
│   └── seed-db.sh
├── tests/
├── wrangler.jsonc           # Existing preview worker
├── CLAUDE.md
└── plan.md
```

---

## 6. Milestones

### M0 — Hygiene (2–3 days)
- Compress images to <400KB, convert WAVs to MP3 (<2.5MB)
- Remove dead assets (flamenco.jpg, blues.mp3)
- Add data-testid to card flow stages, rewrite tests to assert flow not copy
- dennisloveshallie.com unchanged throughout

### M1 — Serving spine (1 week)
- Create R2 `dlh-assets`, D1 `dlh-db`, apply schema
- Package anniversary card as template (write manifest.json)
- Upload to R2 at templates/anniversary-dance-2026/
- Build dlh-serve worker: slug → D1 → R2 → config inject → serve
- Seed one card row in D1
- Verify: served card renders correctly at preview URL

### M2 — API + config (1 week)
- Build dlh-api with Hono
- GET /templates, POST /orders, GET/PUT /cards/:slug/config
- Convert anniversary card JS to read from window.__CARD_CONFIG__
- Verify: changing config.json changes what the card shows

### M3 — Portal + configurator (1–2 weeks)
- Build portal as static Pages site
- Card catalog, configure page (iframe + postMessage), preview mode
- Add edit mode to anniversary card (tappable text, photo picker, style toggler)
- Verify: customer can configure and preview a card

### M4 — Stripe + publish (1 week)
- Stripe product ($19.97/yr), checkout session, webhooks
- Payment success → config.json to R2, card published
- Verify: end-to-end test payment → live card at unique URL

### M5 — Production (1 week)
- Wildcard DNS for *.dlhcards.com → dlh-serve
- Migrate dennisloveshallie.com to dlh-serve
- Port Valentine's card as second template
- Stripe live mode

---

## 7. Open Decisions

1. **Domain**: dlhcards.com, dlh.cards, or other for {slug}.domain?
2. **Pricing**: $19.97/yr confirmed? One-time option?
3. **Customer uploads**: when do we add photo/music upload vs. selection from provided options?
4. **Second template**: port Valentine's card or build a new one to validate the contract?
5. **Asset generation**: future milestone — generate images/text/music from prompts given card context + user input

---

## 8. History

- **2026-06-11** — Revised plan. DLH scoped as business portal only. Cards are external packages consumed via manifest.json contract. Previous infrastructure claims corrected (none existed).
- **2026-05-10** — Original plan.md created with aspirational SaaS architecture.
- **2026-04** — Anniversary card built and deployed to dennisloveshallie.com.
- **2026-02** — Original Valentine's card for Hallie.
