// Minimal Stripe client for Workers — raw REST via fetch, no SDK.
// Configured entirely by secrets/vars:
//   STRIPE_SECRET_KEY   (secret)  enables payment enforcement when present
//   STRIPE_WEBHOOK_SECRET (secret) verifies webhook signatures
//   STRIPE_PRICE_ID     (var)     the $19.97/yr price
//   STRIPE_MODE         (var)     'subscription' (default) | 'payment'

export function stripeEnabled(env) {
  return Boolean(env.STRIPE_SECRET_KEY);
}

export async function createCheckoutSession(env, { orderId, email, successUrl, cancelUrl }) {
  const params = new URLSearchParams({
    mode: env.STRIPE_MODE || 'subscription',
    customer_email: email,
    success_url: successUrl,
    cancel_url: cancelUrl,
    'line_items[0][price]': env.STRIPE_PRICE_ID,
    'line_items[0][quantity]': '1',
    'metadata[order_id]': orderId,
  });
  if ((env.STRIPE_MODE || 'subscription') === 'subscription') {
    params.set('subscription_data[metadata][order_id]', orderId);
  }

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      authorization: 'Bearer ' + env.STRIPE_SECRET_KEY,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error('stripe checkout session failed: ' + (body.error && body.error.message || res.status));
  }
  return body; // { id, url, ... }
}

// Stripe-Signature: t=<ts>,v1=<hmac_sha256(ts + '.' + payload, secret)>
export async function verifyWebhookSignature(payload, sigHeader, secret, toleranceSec = 300) {
  if (!sigHeader) return false;
  const parts = Object.fromEntries(
    sigHeader.split(',').map(kv => kv.split('=', 2)).filter(p => p.length === 2)
  );
  const ts = parseInt(parts.t, 10);
  if (!ts || !parts.v1) return false;
  if (Math.abs(Date.now() / 1000 - ts) > toleranceSec) return false;

  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ts + '.' + payload));
  const expected = [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('');

  // Constant-time comparison.
  const given = parts.v1;
  if (given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0;
}
