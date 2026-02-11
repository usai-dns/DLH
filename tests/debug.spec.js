const { test, expect } = require('@playwright/test');

test('debug page2 content', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 2000 });
  await page.goto('/');
  await page.locator('#btn-yes').click();
  await page.waitForTimeout(3000);

  // Check what's in the collage
  const collageHTML = await page.locator('#collage').innerHTML();
  console.log('COLLAGE HTML:', collageHTML);

  const imgCount = await page.locator('#collage img').count();
  console.log('IMAGE COUNT:', imgCount);

  // Check page height
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log('BODY HEIGHT:', bodyHeight);

  await page.screenshot({ path: 'screenshot-debug.png', fullPage: true });
});
