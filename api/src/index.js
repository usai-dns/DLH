// dlh-api — portal API worker.
//
//   GET  /api/templates                 -> active templates
//   GET  /api/templates/{id}            -> template row + manifest + default config
//   POST /api/orders                    -> {email, name?, template_id, slug}
//                                          creates customer + order + draft card,
//                                          returns edit_token (shown once)
//   GET  /api/orders/{id}               -> order status + card slug
//   GET  /api/cards/{slug}              -> card meta + config (no token required)
//   PUT  /api/cards/{slug}/config       -> X-Edit-Token; manifest-validated config
//   PUT  /api/cards/{slug}/publish      -> X-Edit-Token; draft -> published
//
// Template packages are bundled as Workers Assets (same ../templates dir the
// serve worker ships). Configs live in D1 until the token gains R2 access.

import { validateConfig } from './validate.js';

const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,62}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESERVED_SLUGS = new Set(['api', 'www', 'app', 'portal', 'admin', 'assets', 'templates', 'cards']);

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, OPTIONS',
  'access-control-allow-headers': 'content-type, x-edit-token',
};

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...CORS, ...extra },
  });
}

const err = (status, message, details) => json({ error: message, ...(details ? { details } : {}) }, status);

async function readJson(request) {
  try { return await request.json(); } catch { return null; }
}

async function loadTemplateFile(env, requestUrl, templateId, file) {
  const res = await env.ASSETS.fetch(new Request(new URL(`/${templateId}/${file}`, requestUrl)));
  if (!res.ok) return null;
  try { return await res.json(); } catch { return null; }
}

// ---- handlers ----

async function listTemplates(env) {
  const { results } = await env.DB.prepare(
    `SELECT id, name, description, preview_image, price_cents, billing
       FROM templates WHERE status = 'active' ORDER BY created_at`
  ).all();
  return json({ templates: results });
}

async function getTemplate(env, requestUrl, id) {
  const row = await env.DB.prepare(
    `SELECT id, name, description, preview_image, price_cents, billing, status
       FROM templates WHERE id = ? AND status = 'active'`
  ).bind(id).first();
  if (!row) return err(404, 'template not found');
  const manifest = await loadTemplateFile(env, requestUrl, id, 'manifest.json');
  const defaults = await loadTemplateFile(env, requestUrl, id, 'default-config.json');
  return json({ template: row, manifest, default_config: defaults });
}

async function createOrder(env, request) {
  const body = await readJson(request);
  if (!body) return err(400, 'invalid JSON body');

  const { email, name, template_id, slug } = body;
  if (typeof email !== 'string' || !EMAIL_RE.test(email)) return err(400, 'valid email required');
  if (typeof slug !== 'string' || !SLUG_RE.test(slug)) {
    return err(400, 'slug must be 2-63 chars: lowercase letters, digits, hyphens');
  }
  if (RESERVED_SLUGS.has(slug)) return err(400, 'slug is reserved');

  const template = await env.DB.prepare(
    `SELECT id, price_cents FROM templates WHERE id = ? AND status = 'active'`
  ).bind(template_id).first();
  if (!template) return err(400, 'unknown template');

  const taken = await env.DB.prepare(`SELECT 1 FROM cards WHERE slug = ?`).bind(slug).first();
  if (taken) return err(409, 'slug already taken');

  const defaults = await loadTemplateFile(env, request.url, template_id, 'default-config.json') || {};

  const customerId = 'cust_' + crypto.randomUUID().slice(0, 8);
  const orderId = 'ord_' + crypto.randomUUID().slice(0, 8);
  const cardId = 'card_' + crypto.randomUUID().slice(0, 8);
  const editToken = 'tok_' + crypto.randomUUID();

  // Upsert customer by email, then create order + draft card.
  await env.DB.prepare(
    `INSERT INTO customers (id, email, name) VALUES (?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET name = COALESCE(excluded.name, name)`
  ).bind(customerId, email, name || null).run();
  const customer = await env.DB.prepare(`SELECT id FROM customers WHERE email = ?`).bind(email).first();

  await env.DB.prepare(
    `INSERT INTO orders (id, customer_id, template_id, status, amount_cents)
     VALUES (?, ?, ?, 'pending', ?)`
  ).bind(orderId, customer.id, template_id, template.price_cents).run();

  await env.DB.prepare(
    `INSERT INTO cards (id, order_id, customer_id, template_id, slug, config, status, edit_token)
     VALUES (?, ?, ?, ?, ?, ?, 'draft', ?)`
  ).bind(cardId, orderId, customer.id, template_id, slug, JSON.stringify(defaults), editToken).run();

  return json({
    order_id: orderId,
    card_id: cardId,
    slug,
    edit_token: editToken, // shown once; store it client-side
    preview_url: (env.SERVE_BASE_URL || '') + '/' + slug + '/',
  }, 201);
}

async function getOrder(env, id) {
  const row = await env.DB.prepare(
    `SELECT o.id, o.status, o.amount_cents, o.template_id, o.created_at,
            c.slug AS card_slug, c.status AS card_status
       FROM orders o LEFT JOIN cards c ON c.order_id = o.id
      WHERE o.id = ?`
  ).bind(id).first();
  if (!row) return err(404, 'order not found');
  return json({ order: row });
}

async function getCard(env, slug) {
  const row = await env.DB.prepare(
    `SELECT id, slug, template_id, config, status, published_at, created_at, updated_at
       FROM cards WHERE slug = ?`
  ).bind(slug).first();
  if (!row) return err(404, 'card not found');
  let config = {};
  try { config = JSON.parse(row.config || '{}'); } catch {}
  return json({ card: { ...row, config } });
}

async function requireCardWithToken(env, request, slug) {
  const row = await env.DB.prepare(
    `SELECT id, template_id, status, edit_token FROM cards WHERE slug = ?`
  ).bind(slug).first();
  if (!row) return { response: err(404, 'card not found') };
  const token = request.headers.get('x-edit-token');
  if (!token || token !== row.edit_token) return { response: err(403, 'invalid edit token') };
  return { card: row };
}

async function putConfig(env, request, slug) {
  const { card, response } = await requireCardWithToken(env, request, slug);
  if (response) return response;

  const body = await readJson(request);
  if (!body) return err(400, 'invalid JSON body');

  const manifest = await loadTemplateFile(env, request.url, card.template_id, 'manifest.json');
  if (!manifest) return err(500, 'template manifest unavailable');

  const { config, errors } = validateConfig(manifest, body);
  if (errors.length) return err(422, 'config validation failed', errors);

  await env.DB.prepare(
    `UPDATE cards SET config = ?, updated_at = datetime('now') WHERE id = ?`
  ).bind(JSON.stringify(config), card.id).run();

  return json({ ok: true, config });
}

async function publishCard(env, request, slug) {
  const { card, response } = await requireCardWithToken(env, request, slug);
  if (response) return response;
  if (card.status === 'suspended') return err(409, 'card is suspended');

  await env.DB.prepare(
    `UPDATE cards SET status = 'published', published_at = COALESCE(published_at, datetime('now')),
            updated_at = datetime('now') WHERE id = ?`
  ).bind(card.id).run();

  return json({ ok: true, status: 'published' });
}

// ---- router ----

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

    const url = new URL(request.url);
    const seg = url.pathname.split('/').filter(Boolean);
    const m = request.method;

    try {
      if (seg[0] !== 'api') return err(404, 'not found');

      if (m === 'GET' && seg[1] === 'templates' && seg.length === 2) return await listTemplates(env);
      if (m === 'GET' && seg[1] === 'templates' && seg.length === 3) return await getTemplate(env, request.url, seg[2]);
      if (m === 'POST' && seg[1] === 'orders' && seg.length === 2) return await createOrder(env, request);
      if (m === 'GET' && seg[1] === 'orders' && seg.length === 3) return await getOrder(env, seg[2]);
      if (m === 'GET' && seg[1] === 'cards' && seg.length === 3) return await getCard(env, seg[2]);
      if (m === 'PUT' && seg[1] === 'cards' && seg.length === 4 && seg[3] === 'config') return await putConfig(env, request, seg[2]);
      if (m === 'PUT' && seg[1] === 'cards' && seg.length === 4 && seg[3] === 'publish') return await publishCard(env, request, seg[2]);

      return err(404, 'not found');
    } catch (e) {
      console.error(e);
      return err(500, 'internal error');
    }
  },
};
