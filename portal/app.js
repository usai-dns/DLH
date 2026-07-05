// DLH portal — catalog + live card configurator.
// Talks to dlh-api; iframes cards from dlh-serve with ?edit=true and syncs
// config both ways over postMessage (dlh:ready / dlh:config_update / dlh:set_config).

(function () {
  const qs = new URLSearchParams(location.search);
  const API_BASE = qs.get('api') || localStorage.getItem('DLH_API') || 'https://dlh-api.usai-dlh.workers.dev';
  const SERVE_BASE = qs.get('serve') || localStorage.getItem('DLH_SERVE') || 'https://dlh-serve.usai-dlh.workers.dev';
  if (qs.get('api')) localStorage.setItem('DLH_API', qs.get('api'));
  if (qs.get('serve')) localStorage.setItem('DLH_SERVE', qs.get('serve'));

  const api = async (path, opts = {}) => {
    const res = await fetch(API_BASE + path, {
      ...opts,
      headers: { 'content-type': 'application/json', ...(opts.headers || {}) },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw Object.assign(new Error(body.error || res.statusText), { status: res.status, details: body.details });
    return body;
  };

  const el = (id) => document.getElementById(id);

  // ---------- catalog ----------

  async function renderCatalog() {
    const catalog = el('catalog');
    try {
      const { templates } = await api('/api/templates');
      el('catalog-loading').remove();
      for (const t of templates) {
        const card = document.createElement('a');
        card.className = 'catalog-card';
        card.setAttribute('data-testid', 'catalog-card');
        // Extensionless: `serve` and CF Pages clean-URL redirects drop query strings on .html
        card.href = 'configure?template=' + encodeURIComponent(t.id) + keepOverrides();
        card.innerHTML =
          '<div class="catalog-card-name">' + esc(t.name) + '</div>' +
          '<div class="catalog-card-desc">' + esc(t.description || '') + '</div>' +
          '<div class="catalog-card-price">$' + (t.price_cents / 100).toFixed(2) + ' / ' + esc(t.billing) + '</div>' +
          '<div class="catalog-card-cta">Customize &rarr;</div>';
        catalog.appendChild(card);
      }
    } catch (e) {
      el('catalog-loading').textContent = 'Could not load cards: ' + e.message;
    }
  }

  function keepOverrides() {
    const parts = [];
    if (qs.get('api')) parts.push('api=' + encodeURIComponent(qs.get('api')));
    if (qs.get('serve')) parts.push('serve=' + encodeURIComponent(qs.get('serve')));
    return parts.length ? '&' + parts.join('&') : '';
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---------- configurator ----------

  const state = {
    templateId: null,
    manifest: null,
    slug: null,
    editToken: null,
    config: {},
    editMode: true,
    published: false,
  };

  function cardKey(slug) { return 'DLH_CARD_' + slug; }

  let templateReady = null;

  async function initConfigurator() {
    state.templateId = qs.get('template');
    if (!state.templateId) { location.href = './'; return; }

    // Attach the handler before any await so an early submit can't do a
    // native form navigation; onCreateOrder waits for the template load.
    el('order-form').addEventListener('submit', onCreateOrder);
    const submitBtn = el('order-form').querySelector('[data-testid=order-create]');
    submitBtn.disabled = true;

    templateReady = (async () => {
      const { template, manifest, default_config } = await api('/api/templates/' + encodeURIComponent(state.templateId));
      state.manifest = manifest;
      state.config = Object.assign({}, default_config);
      el('configure-title').textContent = template.name;
      el('slug-suffix').textContent = ' on ' + new URL(SERVE_BASE).host;
    })();
    await templateReady;
    submitBtn.disabled = false;

    // Resume an existing draft for this template if we have one.
    const resumeSlug = qs.get('slug');
    if (resumeSlug && localStorage.getItem(cardKey(resumeSlug))) {
      const saved = JSON.parse(localStorage.getItem(cardKey(resumeSlug)));
      state.slug = resumeSlug;
      state.editToken = saved.edit_token;
      state.checkoutUrl = saved.checkout_url || null;
      const { card } = await api('/api/cards/' + encodeURIComponent(resumeSlug));
      Object.assign(state.config, card.config);
      enterConfigurator();
    }
  }

  async function onCreateOrder(e) {
    e.preventDefault();
    el('order-error').textContent = '';
    await templateReady;
    try {
      const body = {
        email: el('order-email').value.trim(),
        name: el('order-name').value.trim() || undefined,
        template_id: state.templateId,
        slug: el('order-slug').value.trim(),
      };
      const res = await api('/api/orders', { method: 'POST', body: JSON.stringify(body) });
      state.slug = res.slug;
      state.editToken = res.edit_token;
      state.checkoutUrl = res.checkout_url || null;
      localStorage.setItem(cardKey(res.slug), JSON.stringify({
        edit_token: res.edit_token, order_id: res.order_id, checkout_url: res.checkout_url || null,
      }));
      enterConfigurator();
    } catch (err) {
      el('order-error').textContent = err.message + (err.status === 409 ? ' — try another address' : '');
    }
  }

  function cardUrl(edit) {
    return SERVE_BASE + '/' + state.slug + '/' + (edit ? '?edit=true' : '');
  }

  function enterConfigurator() {
    el('order-setup').hidden = true;
    el('configurator').hidden = false;
    el('panel-template-name').textContent = state.manifest.name;
    el('stage-slug').textContent = '/' + state.slug + '/';
    renderFields();
    setEditMode(true);

    window.addEventListener('message', (e) => {
      const msg = e.data;
      if (!msg || typeof msg !== 'object') return;
      if (msg.type === 'dlh:ready') {
        // Card loaded: push our current config into it.
        frameSend({ type: 'dlh:set_config', config: state.config });
        setStatus(state.editMode ? 'Editing live' : 'Previewing');
      }
      if (msg.type === 'dlh:config_update' && msg.config) {
        // In-card edits: merge and refresh the panel inputs.
        for (const f of state.manifest.fields) {
          if (msg.config[f.key] !== undefined) state.config[f.key] = msg.config[f.key];
        }
        renderFields();
        setStatus('Edited on card — unsaved');
      }
    });

    el('btn-save').addEventListener('click', saveConfig);
    el('btn-preview').addEventListener('click', () => setEditMode(!state.editMode));
    el('btn-publish').addEventListener('click', publish);
  }

  function setEditMode(on) {
    state.editMode = on;
    el('stage-mode').textContent = on ? 'EDIT MODE' : 'PREVIEW';
    el('btn-preview').textContent = on ? 'Preview' : 'Back to editing';
    el('card-frame').src = cardUrl(on);
    setStatus('Loading card…');
  }

  function frameSend(msg) {
    const frame = el('card-frame');
    if (frame.contentWindow) frame.contentWindow.postMessage(msg, '*');
  }

  function setStatus(text) { el('status-line').textContent = text; }

  // Build panel inputs from the manifest.
  function renderFields() {
    const wrap = el('panel-fields');
    wrap.textContent = '';
    for (const f of state.manifest.fields) {
      const value = state.config[f.key] !== undefined ? state.config[f.key] : f.default;
      const row = document.createElement('div');
      row.className = 'field-row';

      const label = document.createElement('label');
      label.textContent = f.label;
      row.appendChild(label);

      if (f.type === 'text') {
        const multiline = String(f.default || '').includes('\n');
        const input = document.createElement(multiline ? 'textarea' : 'input');
        if (multiline) input.rows = 2;
        input.value = value || '';
        if (f.max_length) input.maxLength = f.max_length;
        input.setAttribute('data-testid', 'field-' + f.key);
        input.addEventListener('input', () => {
          state.config[f.key] = input.value;
          frameSend({ type: 'dlh:set_config', config: { [f.key]: input.value } });
          setStatus('Unsaved changes');
        });
        row.appendChild(input);
      } else if (f.type === 'multi_select') {
        const box = document.createElement('div');
        box.className = 'checks';
        const selected = Array.isArray(value) ? value.slice() : [];
        for (const opt of f.options) {
          const lab = document.createElement('label');
          lab.className = 'check';
          const cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.value = opt.value;
          cb.checked = selected.includes(opt.value);
          cb.setAttribute('data-testid', 'field-' + f.key + '-' + opt.value);
          cb.addEventListener('change', () => {
            const now = [...box.querySelectorAll('input:checked')].map(i => i.value);
            if (f.min && now.length < f.min) { cb.checked = true; return; }
            if (f.max && now.length > f.max) { cb.checked = false; return; }
            state.config[f.key] = [...box.querySelectorAll('input:checked')].map(i => i.value);
            frameSend({ type: 'dlh:set_config', config: { [f.key]: state.config[f.key] } });
            setStatus('Unsaved changes');
          });
          lab.appendChild(cb);
          lab.appendChild(document.createTextNode(opt.label));
          box.appendChild(lab);
        }
        row.appendChild(box);
      } else if (f.type === 'image') {
        const note = document.createElement('div');
        note.className = 'hint';
        note.textContent = 'Photo: ' + (value || f.default) + ' (custom uploads coming soon)';
        row.appendChild(note);
      }
      wrap.appendChild(row);
    }
  }

  async function saveConfig() {
    el('panel-error').textContent = '';
    try {
      await api('/api/cards/' + encodeURIComponent(state.slug) + '/config', {
        method: 'PUT',
        headers: { 'x-edit-token': state.editToken },
        body: JSON.stringify(state.config),
      });
      setStatus('Saved');
    } catch (err) {
      el('panel-error').textContent = 'Save failed: ' + err.message +
        (err.details ? ' — ' + err.details.map(d => d.field + ': ' + d.reason).join('; ') : '');
    }
  }

  async function publish() {
    el('panel-error').textContent = '';
    try {
      await saveConfig();
      await api('/api/cards/' + encodeURIComponent(state.slug) + '/publish', {
        method: 'PUT',
        headers: { 'x-edit-token': state.editToken },
      });
      state.published = true;
      const url = cardUrl(false);
      const link = el('published-url');
      link.href = url;
      link.textContent = url;
      el('published-box').hidden = false;
      setStatus('Published');
      setEditMode(false);
    } catch (err) {
      if (err.status === 402 && state.checkoutUrl) {
        el('panel-error').innerHTML =
          'Payment needed to publish — <a href="' + esc(state.checkoutUrl) + '" style="color:#fff">complete checkout</a>, then publish again.';
      } else {
        el('panel-error').textContent = 'Publish failed: ' + err.message;
      }
    }
  }

  window.DLH = { renderCatalog, initConfigurator };
})();
