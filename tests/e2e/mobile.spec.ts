import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('mobile home, search, and tool pages render without horizontal overflow', async ({ page }) => {
  for (const path of ['/', '/search/', '/tools/json-formatter/']) {
    await page.goto(path);
    await expect(page.getByRole('banner').getByRole('link', { name: 'TovolBox' })).toBeVisible();
    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(hasHorizontalOverflow).toBe(false);
  }
});

test('mobile RTL locale keeps Arabic direction and navigation usable', async ({ page }) => {
  await page.goto('/ar/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.getByRole('link', { name: 'TovolBox' })).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'الفئات' })).toBeVisible();
});
