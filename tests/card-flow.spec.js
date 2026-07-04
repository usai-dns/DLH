const { test, expect } = require('@playwright/test');

// Flow contract for every DLH card: gate -> reveal -> choose -> commit -> celebrate.
// Asserts via data-testid only, never copy text, so cards can change content freely.
// Uses page.goto('./') so the suite runs against path-prefixed URLs (/{slug}/).

test.describe('Card flow contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('gate is shown first and opens the reveal stage', async ({ page }) => {
    await expect(page.getByTestId('gate-open')).toBeVisible();
    await expect(page.getByTestId('stage-reveal')).not.toBeVisible();

    await page.getByTestId('gate-open').click();

    await expect(page.getByTestId('stage-reveal')).toBeVisible();
    await expect(page.getByTestId('reveal-continue')).toBeVisible();
  });

  test('reveal advances to the choose stage', async ({ page }) => {
    await page.getByTestId('gate-open').click();
    await expect(page.getByTestId('reveal-continue')).toBeVisible();

    await page.getByTestId('reveal-continue').click();

    await expect(page.getByTestId('stage-choose')).toBeVisible();
    await expect(page.getByTestId('choice-option').first()).toBeVisible();
  });

  test('commit is disabled until a choice is made', async ({ page }) => {
    await page.getByTestId('gate-open').click();
    await page.getByTestId('reveal-continue').click();
    await expect(page.getByTestId('stage-choose')).toBeVisible();

    await expect(page.getByTestId('commit')).toBeDisabled();

    await page.getByTestId('choice-option').first().click();

    await expect(page.getByTestId('commit')).toBeEnabled();
  });

  test('selecting a choice marks it selected and shows its info', async ({ page }) => {
    await page.getByTestId('gate-open').click();
    await page.getByTestId('reveal-continue').click();
    await expect(page.getByTestId('stage-choose')).toBeVisible();

    const first = page.getByTestId('choice-option').first();
    await first.click();

    await expect(first).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('choice-info')).toBeVisible();
  });

  test('switching choices moves the selected state', async ({ page }) => {
    await page.getByTestId('gate-open').click();
    await page.getByTestId('reveal-continue').click();
    await expect(page.getByTestId('stage-choose')).toBeVisible();

    const options = page.getByTestId('choice-option');
    await options.nth(0).click();
    await expect(options.nth(0)).toHaveAttribute('aria-pressed', 'true');

    await options.nth(1).click();
    await expect(options.nth(1)).toHaveAttribute('aria-pressed', 'true');
    await expect(options.nth(0)).toHaveAttribute('aria-pressed', 'false');
  });

  test('committing a choice fires the celebrate stage', async ({ page }) => {
    await page.getByTestId('gate-open').click();
    await page.getByTestId('reveal-continue').click();
    await expect(page.getByTestId('stage-choose')).toBeVisible();

    await page.getByTestId('choice-option').first().click();
    await expect(page.getByTestId('commit')).toBeEnabled();
    await page.getByTestId('commit').click();

    await expect(page.getByTestId('stage-celebrate')).toBeVisible({ timeout: 10000 });
  });

  test('all choice options are visible on the choose stage', async ({ page }) => {
    await page.getByTestId('gate-open').click();
    await page.getByTestId('reveal-continue').click();
    await expect(page.getByTestId('stage-choose')).toBeVisible();

    const count = await page.getByTestId('choice-option').count();
    expect(count).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < count; i++) {
      await expect(page.getByTestId('choice-option').nth(i)).toBeVisible();
    }
  });
});
