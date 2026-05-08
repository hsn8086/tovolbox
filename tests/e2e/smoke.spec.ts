import { expect, test } from '@playwright/test';

test('home, locale, category, and tool pages render', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/TovolBox/);
  await page.goto('/zh-CN/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await page.goto('/ar/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.goto('/tools/json-formatter/');
  await expect(page.locator('h1')).toHaveText(/JSON Formatter/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/tools\/json-formatter\/$/);
});
