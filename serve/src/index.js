// dlh-serve — multi-tenant card serving worker.
//
// Path-based routing (hostname routing comes with the wildcard domain):
//   GET /                     -> health
//   GET /{slug}               -> 301 to /{slug}/ (relative asset resolution)
//   GET /{slug}/              -> card HTML: template index.html + injected __CARD_CONFIG__
//   GET /{slug}/{asset path}  -> template asset via the Workers Assets binding
//
// Template packages are deployed as Workers Assets under /{assets_prefix}/.
// Card configs live in D1 (cards.config) until the account token gains R2.

const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,62}$/;

function notFound() {
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Card not found</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0a;color:#fff;font-family:Georgia,serif;text-align:center}p{opacity:.7;font-style:italic}</style></head>
<body><div><h1>This card isn&rsquo;t here</h1><p>Check the link you were sent &mdash; it may have a typo, or the card may no longer be published.</p></div></body></html>`,
    { status: 404, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } }
  );
}

async function lookupCard(env, slug) {
  return env.DB.prepare(
    `SELECT c.config, c.status, t.assets_prefix
       FROM cards c JOIN templates t ON c.template_id = t.id
      WHERE c.slug = ? AND t.status = 'active'`
  ).bind(slug).first();
}

function injectConfig(html, configJson) {
  // Escape <  so "</script>" inside config values can't break out of the tag.
  const safe = configJson.replace(/</g, '\\u003c');
  const tag = `<script>window.__CARD_CONFIG__ = ${safe};</script>`;
  if (html.includes('<!-- DLH:CONFIG -->')) {
    return html.replace('<!-- DLH:CONFIG -->', tag);
  }
  return html.replace('</head>', tag + '\n</head>');
}

async function fetchTemplateAsset(env, requestUrl, assetPath) {
  const url = new URL('/' + assetPath, requestUrl);
  return env.ASSETS.fetch(new Request(url));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const segments = url.pathname.split('/').filter(Boolean);

    if (segments.length === 0) {
      return new Response('dlh-serve ok', { headers: { 'cache-control': 'no-store' } });
    }

    const slug = segments[0];
    if (!SLUG_RE.test(slug)) return notFound();

    // /{slug} -> /{slug}/ so the card's relative asset paths resolve.
    if (segments.length === 1 && !url.pathname.endsWith('/')) {
      return Response.redirect(url.origin + url.pathname + '/' + url.search, 301);
    }

    const card = await lookupCard(env, slug);
    if (!card || !['draft', 'published'].includes(card.status)) return notFound();

    // Asset request: /{slug}/{rest} -> assets binding /{assets_prefix}/{rest}
    const rest = segments.slice(1).join('/');
    if (rest) {
      const res = await fetchTemplateAsset(env, request.url, `${card.assets_prefix}/${rest}`);
      if (!res.ok) return notFound();
      const headers = new Headers(res.headers);
      headers.set('cache-control', 'public, max-age=86400');
      return new Response(res.body, { status: res.status, headers });
    }

    // Card HTML
    const res = await fetchTemplateAsset(env, request.url, `${card.assets_prefix}/index.html`);
    if (!res.ok) return notFound();

    let config = '{}';
    try {
      config = JSON.stringify(JSON.parse(card.config || '{}'));
    } catch {
      config = '{}';
    }

    const html = injectConfig(await res.text(), config);
    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': card.status === 'published' ? 'public, max-age=60' : 'no-store',
      },
    });
  },
};
