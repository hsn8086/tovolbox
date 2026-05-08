import { expect, test } from '@playwright/test';

test('search filters tools from the static index', async ({ page }) => {
  await page.goto('/search/');
  await page.getByRole('searchbox').fill('sha256');
  await expect(page.getByRole('link', { name: /SHA-256 Generator/i })).toBeVisible();
});

test('reflection quiz records answers and shows result', async ({ page }) => {
  await page.goto('/tools/big-five-lite-reflection/');
  await expect(page.locator('aside').filter({ hasText: /personal insight/i })).toBeVisible();
  await page.locator('input[type="radio"][value="4"]').first().check();
  await expect(page.getByText(/1 \/ 10 answered/)).toBeVisible();
  await expect(page.getByText(/Reflection result/)).toBeVisible();
});

test('hash and unit tools render specialized outputs', async ({ page }) => {
  await page.goto('/tools/sha256-generator/');
  await page.getByLabel('Input').fill('abc');
  await expect(page.getByLabel('Output')).toContainText('ba7816bf');

  await page.goto('/tools/temperature-converter/');
  await page.getByLabel('Value').fill('100');
  await expect(page.getByLabel('Output')).toContainText('212');
});

test('image canvas tool loads local processing UI', async ({ page }) => {
  await page.goto('/tools/image-grayscale-converter/');
  const tool = page.locator('section.card').filter({ has: page.getByRole('heading', { name: /Local image grayscale/i }) });
  await expect(tool).toBeVisible();
  await expect(tool.getByText(/processed locally/i)).toBeVisible();
  await expect(tool.getByRole('button', { name: /Download PNG/i })).toBeVisible();
});
