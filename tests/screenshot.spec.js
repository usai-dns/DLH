const { test } = require('@playwright/test');

test('capture mobile screenshots', async ({ page }) => {
  // Mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.screenshot({ path: 'screenshots/mobile-prompt.png' });

  await page.locator('#btn-start').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/mobile-card.png' });

  await page.locator('#btn-yes').click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/mobile-details.png', fullPage: true });
});

test('capture desktop screenshots', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await page.locator('#btn-start').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/desktop-card.png' });

  await page.locator('#btn-yes').click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/desktop-details.png', fullPage: true });
});
