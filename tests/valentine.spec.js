const { test, expect } = require('@playwright/test');

test.describe('Valentine Card', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows music prompt first, then reveals card on click', async ({ page }) => {
    // Music prompt visible first
    await expect(page.locator('#music-prompt')).toBeVisible();
    await expect(page.locator('#page-question')).not.toHaveClass(/active/);

    // Click Open
    await page.locator('#btn-start').click();
    await page.waitForTimeout(800);

    // Prompt gone, card visible
    await expect(page.locator('#page-question')).toHaveClass(/active/);
    await expect(page.locator('#page-question h1')).toContainText('Hallie');
    await expect(page.locator('.subtitle')).toContainText('Will you be my Valentine?');
    await expect(page.locator('#btn-yes')).toBeVisible();
    await expect(page.locator('#btn-no')).toBeVisible();
  });

  test('No button dodges the mouse cursor', async ({ page }) => {
    // Get past the music prompt
    await page.locator('#btn-start').click();
    await page.waitForTimeout(800);

    const btnNo = page.locator('#btn-no');
    const initialBox = await btnNo.boundingBox();

    await page.mouse.move(
      initialBox.x + initialBox.width / 2,
      initialBox.y + initialBox.height / 2
    );
    await page.waitForTimeout(500);

    const newBox = await btnNo.boundingBox();
    const moved = (
      Math.abs(newBox.x - initialBox.x) > 10 ||
      Math.abs(newBox.y - initialBox.y) > 10
    );
    expect(moved).toBe(true);
  });

  test('clicking Yes shows confetti and transitions to details page', async ({ page }) => {
    await page.locator('#btn-start').click();
    await page.waitForTimeout(800);

    await page.locator('#btn-yes').click();

    const canvas = page.locator('#confetti-canvas');
    await expect(canvas).toBeVisible();

    await page.waitForTimeout(2500);

    await expect(page.locator('#page-details')).toHaveClass(/active/);
    await expect(page.locator('.celebrate-title')).toContainText('She said YES');
  });

  test('details page shows date info and floating photos', async ({ page }) => {
    await page.locator('#btn-start').click();
    await page.waitForTimeout(800);

    await page.locator('#btn-yes').click();
    await page.waitForTimeout(2500);

    await expect(page.locator('.date-details')).toBeVisible();
    await expect(page.locator('.date-details')).toContainText('February 14th');
    await expect(page.locator('.date-details')).toContainText('February 15th');

    // Carousel photos are present
    const photoCount = await page.locator('.carousel img').count();
    expect(photoCount).toBe(5);
  });

  test('floating hearts are being generated', async ({ page }) => {
    await page.locator('#btn-start').click();
    await page.waitForTimeout(2000);

    const hearts = await page.locator('.floating-heart').count();
    expect(hearts).toBeGreaterThan(0);
  });
});
