const { test, expect } = require('@playwright/test');

test.describe('Anniversary Card', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows music prompt first, then reveals card on click', async ({ page }) => {
    // Music prompt visible first
    await expect(page.locator('#music-prompt')).toBeVisible();
    await expect(page.locator('#page-card')).not.toHaveClass(/active/);

    // Click Open
    await page.locator('#btn-start').click();
    await page.waitForTimeout(800);

    // Prompt gone, card visible
    await expect(page.locator('#page-card')).toHaveClass(/active/);
    await expect(page.locator('.card-title')).toContainText('Happy Anniversary');
    await expect(page.locator('.card-message')).toContainText('moving with my body');
    await expect(page.locator('#btn-open')).toBeVisible();
  });

  test('card opens and reveals dance selection page', async ({ page }) => {
    await page.locator('#btn-start').click();
    await page.waitForTimeout(800);

    await page.locator('#btn-open').click();
    await page.waitForTimeout(2000);

    // Dance page should be active
    await expect(page.locator('#page-dance')).toHaveClass(/active/);
    await expect(page.locator('.mag-title-script')).toContainText('Dance Lessons');

    // All 6 dance options present
    const options = await page.locator('.dcard').count();
    expect(options).toBe(6);
  });

  test('selecting a dance style highlights it and enables lock-in', async ({ page }) => {
    // Get to dance page
    await page.locator('#btn-start').click();
    await page.waitForTimeout(800);
    await page.locator('#btn-open').click();
    await page.waitForTimeout(2000);

    // Lock-in should be disabled initially
    await expect(page.locator('#btn-lockin')).toBeDisabled();

    // Click Tango
    await page.locator('[data-style="tango"]').click();
    await page.waitForTimeout(500);

    // Tango should be selected
    await expect(page.locator('[data-style="tango"]')).toHaveClass(/selected/);
    // Lock-in should be enabled
    await expect(page.locator('#btn-lockin')).not.toBeDisabled();
    await expect(page.locator('#btn-lockin')).toHaveClass(/enabled/);
  });

  test('switching dance styles updates the selection', async ({ page }) => {
    await page.locator('#btn-start').click();
    await page.waitForTimeout(800);
    await page.locator('#btn-open').click();
    await page.waitForTimeout(2000);

    // Select salsa first
    await page.locator('[data-style="salsa"]').click();
    await page.waitForTimeout(300);
    await expect(page.locator('[data-style="salsa"]')).toHaveClass(/selected/);

    // Switch to ballroom
    await page.locator('[data-style="ballroom"]').click();
    await page.waitForTimeout(300);
    await expect(page.locator('[data-style="ballroom"]')).toHaveClass(/selected/);
    await expect(page.locator('[data-style="salsa"]')).not.toHaveClass(/selected/);
  });

  test('locking in shows celebration page with selected dance', async ({ page }) => {
    await page.locator('#btn-start').click();
    await page.waitForTimeout(800);
    await page.locator('#btn-open').click();
    await page.waitForTimeout(2000);

    // Select swing
    await page.locator('[data-style="swing"]').click();
    await page.waitForTimeout(500);

    // Lock in
    await page.locator('#btn-lockin').click();
    await page.waitForTimeout(1500);

    // Celebration page active
    await expect(page.locator('#page-celebrate')).toHaveClass(/active/);
    await expect(page.locator('.celebrate-main')).toContainText("It\u2019s a Date");
    await expect(page.locator('#celebrate-dance-name')).toContainText('Swing');
  });

  test('sparkles are generated after opening', async ({ page }) => {
    await page.locator('#btn-start').click();
    await page.waitForTimeout(2000);

    const sparkles = await page.locator('.sparkle').count();
    expect(sparkles).toBeGreaterThan(0);
  });

  test('all six dance styles are present', async ({ page }) => {
    await page.locator('#btn-start').click();
    await page.waitForTimeout(800);
    await page.locator('#btn-open').click();
    await page.waitForTimeout(2000);

    const styles = ['tango', 'salsa', 'ballroom', 'swing', 'hiphop', 'country'];
    for (const style of styles) {
      await expect(page.locator(`[data-style="${style}"]`)).toBeVisible();
    }
  });
});
