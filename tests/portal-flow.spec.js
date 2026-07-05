const { test, expect } = require('@playwright/test');

// Full customer journey through the portal. Requires the local stack:
//   PORTAL_E2E=1 PORTAL_URL=http://127.0.0.1:8090 \
//   E2E_API=http://127.0.0.1:8788 E2E_SERVE=http://127.0.0.1:8787 \
//   npx playwright test tests/portal-flow.spec.js
// (see scripts/e2e-local.sh)

const PORTAL_URL = process.env.PORTAL_URL;
const E2E_API = process.env.E2E_API;
const E2E_SERVE = process.env.E2E_SERVE;

test.describe('Portal customer flow', () => {
  test.skip(!process.env.PORTAL_E2E, 'set PORTAL_E2E=1 with a running local stack');

  test('catalog -> order -> live edit both ways -> save -> preview -> publish', async ({ page }) => {
    test.setTimeout(180000);
    const slug = 'e2e-portal-' + Date.now().toString(36);

    // --- catalog ---
    await page.goto(`${PORTAL_URL}/?api=${E2E_API}&serve=${E2E_SERVE}`);
    const catalogCard = page.getByTestId('catalog-card').first();
    await expect(catalogCard).toBeVisible();

    // --- claim card ---
    await catalogCard.click();
    await expect(page.getByTestId('order-setup')).toBeVisible();
    await page.getByTestId('order-email').fill('e2e@example.com');
    await page.getByTestId('order-slug').fill(slug);
    await page.getByTestId('order-create').click();

    // --- configurator appears, card loads in edit mode ---
    await expect(page.getByTestId('configurator')).toBeVisible();
    const frame = page.frameLocator('#card-frame');
    await expect(frame.locator('.dlh-editable').first()).toBeVisible({ timeout: 20000 });
    // dlh:ready handshake sets the status line
    await expect(page.getByTestId('status-line')).toHaveText(/Editing live/, { timeout: 10000 });

    // --- panel -> card live sync ---
    const titleInput = page.getByTestId('field-card_title');
    await titleInput.fill('Panel Title Sync');
    await expect(frame.locator('.card-title')).toHaveText('Panel Title Sync');

    // --- card -> panel live sync (tap-to-edit on the card itself) ---
    const introOnCard = frame.locator('[data-testid=edit-intro_text]');
    await introOnCard.click();
    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.type('Tapped on the card');
    await frame.locator('.music-prompt-card').click({ position: { x: 5, y: 5 } });
    await expect(page.getByTestId('field-intro_text')).toHaveValue('Tapped on the card', { timeout: 5000 });

    // --- style toggling reflects in the card ---
    await page.getByTestId('field-dance_styles-hiphop').uncheck();
    await page.getByTestId('field-dance_styles-country').uncheck();
    await expect(frame.locator('.dcard:not([hidden])')).toHaveCount(4);

    // --- save draft ---
    await page.getByTestId('btn-save').click();
    await expect(page.getByTestId('status-line')).toHaveText(/Saved/);

    // --- preview mode: excluded styles are gone, no edit affordances ---
    await page.getByTestId('btn-preview').click();
    await expect(frame.locator('.dcard')).toHaveCount(4, { timeout: 20000 });
    await expect(frame.locator('.dlh-editable')).toHaveCount(0);
    await expect(frame.locator('.card-title')).toHaveText('Panel Title Sync');

    // --- publish ---
    await page.getByTestId('btn-preview').click(); // back to editing
    await expect(frame.locator('.dlh-editable').first()).toBeVisible({ timeout: 20000 });
    await page.getByTestId('btn-publish').click();
    await expect(page.getByTestId('published-box')).toBeVisible({ timeout: 15000 });
    const publishedUrl = await page.getByTestId('published-url').getAttribute('href');
    expect(publishedUrl).toBe(`${E2E_SERVE}/${slug}/`);

    // --- published card is live with the customer's config ---
    await page.goto(publishedUrl);
    await expect(page.getByTestId('gate-open')).toBeVisible();
    await page.getByTestId('gate-open').click();
    await expect(page.locator('.card-title')).toHaveText('Panel Title Sync');
    await page.getByTestId('reveal-continue').click();
    await expect(page.getByTestId('choice-option')).toHaveCount(4);
  });
});
