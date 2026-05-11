# DLH — Plan & Current State

> Source-of-truth document for evolving this repo into an autonomously-developed product. Copy this into a fresh Claude.ai conversation to continue planning.

---

## 1. The Product (one-liner)

A **personalized digital gift-card SaaS** — generate custom single-page sites (Valentine's, anniversary, etc.) for a recipient, with imagery, music, a reveal flow, and (eventually) a custom-generated song. Multi-tenant, served from `*.workers.dev` or a custom domain per customer.

Origin: the hand-built Valentine's site for Hallie at **dennisloveshallie.com**. We are productizing it.

---

## 2. Repo Layout

```
DLH/
├── public/              # Static site for the current card (anniversary template)
│   ├── index.html       # Card landing + dance-style selection flow
│   ├── script.js        # Reveal animations, audio, magazine-style flow
│   ├── style.css        # Magazine aesthetic
│   ├── images/          # ballroom, country, flamenco, hiphop, latin, swing, tango, main-cut, main-image
│   └── music/           # ballroom, blues, country, hiphop, salsa, swing, tango (mp3/wav)
├── tests/               # Playwright e2e
├── wrangler.jsonc       # CF Workers static-assets config → ./public
├── worker/              # (empty on main; lives on `product` branch — SaaS API worker)
├── serving/             # (empty on main; lives on `product` branch — multi-tenant serving worker)
├── package.json         # `npm run dev` = local serve, `npm test` = Playwright
└── plan.md              # ← you are here
```

---

## 3. Branch Topology

| Branch | Purpose | State |
|---|---|---|
| `main` | **Anniversary card template** — static site, single-tenant, deployable via Workers Assets. Most recent work converged here. | Active, current HEAD `b0167c6` |
| `hallie` | Original Valentine's card for Hallie (dennisloveshallie.com). Frozen reference. | Frozen at `b1df87b` |
| `valentines` | Same as `hallie` — clean reference for the Valentine's variant. | Frozen at `b1df87b` |
| `product` | SaaS platform scaffolding: D1 schema, R2 storage, multi-tenant serving worker, order pipeline, marketing site. | Has scaffolding committed (`af2bd5e`), needs activation. |
| `claude/anniversary-card-template-*` | Side branch where ballroom/dance-style work landed before merging into main. | Merged into main (same HEAD). |

**Intended evolution:**
- `main` = canonical "anniversary card template" reference implementation
- `product` = SaaS platform; gets promoted to main once the platform can render templates like the one on `main`
- `hallie` / `valentines` = preserved variants that the platform will eventually generate dynamically

---

## 4. What's Built

### Card template (on `main`)
- Magazine-style single-page anniversary card
- Reveal flow → dance-style selection (Ballroom, Country, Flamenco, Hip-hop, Latin, Salsa, Swing, Tango)
- Per-style image + audio preview
- Venue checkout links per style
- Equal-size cards with image-on-select, dynamic header
- Playwright e2e tests in `tests/valentine.spec.js`
- Deployable via `wrangler.jsonc` (Workers Assets, `./public`)

### SaaS scaffolding (on `product`, not yet active)
- Worker API for order creation (`worker/`)
- Multi-tenant serving worker (`serving/`) — looks up hostname in D1, serves from R2
- Order pipeline (CF Workflows, 9-step) for async render → publish
- Marketing site

### Cloudflare infrastructure (provisioned)
- **Account:** `f1d19cc490b902a854ac1b43b5808673` (usai-dlh, usai.dlh@gmail.com)
- **D1:** `dlh-db` (`2d05bbc1-dbbb-4dd5-91ef-9d842da04c92`) — schema applied
- **R2:** `dlh-assets` — templates uploaded under `templates/`
- **Workers:**
  - `dlh-worker` → `dlh-worker.usai-dlh.workers.dev` (API)
  - `dlh-serving` → `dlh-serving.usai-dlh.workers.dev` (multi-tenant render)
- **Workflow:** `order-pipeline` (class `OrderPipeline`)

---

## 5. What's NOT Done (the roadmap)

### Immediate (unblock production)
1. **Worker secrets** — `wrangler secret put` for: Stripe, Namecheap (domain reg), Twilio (SMS), Claude API key, CF API token.
2. **Stripe** — product + price ($19.97/yr subscription); test-mode webhooks wired to `dlh-worker`.
3. **Marketing site** — deploy to Cloudflare Pages.
4. **End-to-end test** — Stripe test mode → order creation → pipeline → site live at customer subdomain.

### Near-term (product completeness)
5. **Mureka API** — custom AI-generated songs ($0.025/song on Basic plan). Replaces the pre-made R2 music library for personalized cards.
6. **Photo upload** — customer photos to `orders/{id}/photos/{index}.jpeg` in R2, wired into the template render.
7. **Template selection UI** — let customers pick Valentine's vs anniversary vs (future templates).
8. **Custom domain provisioning** — Namecheap API → CF custom hostname binding → cert provisioning.

### Long-term (platform)
9. **Multiple templates** — generalize `main`'s anniversary template so the platform can render any of N templates with customer data injected.
10. **Template authoring** — internal tool / DSL for adding new templates without code changes.
11. **Analytics** — per-card view tracking, recipient engagement.
12. **Self-serve customer portal** — edit content post-purchase, re-publish.

---

## 6. How to Develop Autonomously (the actual ask)

The goal is letting Claude (or multiple Claude sessions) push this product forward without me babysitting every commit. Approach:

### Branch discipline
- One branch per logical workstream (`feature/stripe-integration`, `feature/mureka-songs`, `feature/template-renderer`, etc.)
- All long-running branches off `product`, not `main`. `main` only updates when a template ships.
- PRs into `product`; `product` → `main` only when a coherent platform release is ready.

### Per-task scope contract
Each autonomous task should specify:
- **Goal** — one sentence
- **Branch** — name and parent
- **Done-when** — testable acceptance criteria (a curl returns X, a page renders Y, an e2e test passes)
- **Out-of-scope** — what NOT to touch
- **Secrets needed** — names of env vars / wrangler secrets the task can assume exist

### Verification layer
- Playwright e2e for any user-facing flow (already set up in `tests/`)
- `wrangler dev` smoke tests for worker code
- `wrangler deploy --dry-run` as a build gate

### Tracking
- This file (`plan.md`) is the high-level state. Updated after each major milestone.
- Per-feature branches carry their own short README if they introduce new patterns.

---

## 7. Open Questions (decide before next sprint)

1. Does `main` stay as the "anniversary template reference" or become the SaaS platform once `product` is mature? (Recommendation: `product` → `main` after first paying customer.)
2. Templates as code (current) or templates as data (R2 JSON + render engine)? Data-driven is required for non-engineer template authoring.
3. Pricing: one-time vs subscription. Memory says $19.97/yr — confirm.
4. Custom domain UX: do we register on customer's behalf (Namecheap API) or let them BYO domain? Affects pipeline complexity significantly.
5. Mureka song generation: synchronous (block order completion) or async (placeholder song, swap in when ready)?

---

## 8. Recent History (most recent first)

- **2026-05-10** — Pulled all branches together. Anniversary template (dance-style selection, magazine redesign, ballroom assets) consolidated on `main`. `.DS_Store` cleanup; global gitignore configured.
- **2026-04-19** — Ballroom assets added. Equal-size cards with image-on-select.
- **2026-04** — Magazine-style redesign, venue links per dance style, multi-style support added.
- **Earlier** — `product` branch: SaaS scaffolding (worker API, serving worker, pipeline, D1 schema, R2 templates). All deployed but secrets/Stripe/Pages still pending.
- **Origin** — Hallie's Valentine card (`hallie` / `valentines` branches), dennisloveshallie.com.
