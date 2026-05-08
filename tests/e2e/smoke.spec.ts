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
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('JSON and Data Tools');
  await expect(page.getByRole('heading', { name: 'When to use this formatter' })).toBeVisible();
  const jsonLd = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) => nodes.map((node) => node.textContent ?? ''));
  expect(jsonLd.some((script) => script.includes('BreadcrumbList'))).toBe(true);

  await page.goto('/categories/image-tools/');
  await expect(page.getByRole('heading', { name: 'Popular tools in Image Tools' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Image Resize Calculator/i }).first()).toBeVisible();
});
