import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function samplePngPath(): string {
  const source = path.join(process.cwd(), 'tests/fixtures/sample.png.base64');
  const target = path.join(os.tmpdir(), 'sample.png');
  fs.writeFileSync(target, Buffer.from(fs.readFileSync(source, 'utf8').trim(), 'base64'));
  return target;
}

async function waitForToolReady(page: Page): Promise<void> {
  await expect(page.locator('[data-tool-ready="true"]').first()).toBeVisible();
}

test('search filters tools from the static index', async ({ page }) => {
  await page.goto('/search/');
  await page.getByRole('searchbox').fill('sha256');
  await expect(page.getByRole('link', { name: /SHA-256 Generator/i })).toBeVisible();
});

test('search exposes discovery filters tags and shortcuts', async ({ page }) => {
  await page.goto('/search/');
  await expect(page.getByRole('heading', { name: 'Popular tools' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Recently added' })).toBeVisible();
  await expect(page.locator('[data-search-ready="true"]')).toBeVisible();

  await page.keyboard.press('/');
  await expect(page.getByRole('searchbox')).toBeFocused();

  await page.getByLabel('Category').selectOption('image-tools');
  await expect(page.getByRole('link', { name: /Image Resize Calculator/i })).toBeVisible();

  await page.getByRole('button', { name: /Clear filters/i }).click();
  await page.getByRole('button', { name: /^json /i }).click();
  await expect(page.getByRole('link', { name: /JSON Formatter/i })).toBeVisible();

  await page.getByRole('searchbox').fill('definitely-no-tool');
  await expect(page.getByText(/No matching tools found/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Recommended tools' })).toBeVisible();
});

test('localized search matches Chinese content', async ({ page }) => {
  await page.goto('/zh-CN/search/');
  await page.getByRole('searchbox').fill('压力');
  await expect(page.getByRole('link', { name: /压力水平自查/i })).toBeVisible();
});

test('priority localized search and privacy pages avoid English fallback', async ({ page }) => {
  await page.goto('/ja/search/');
  await expect(page.getByText('/ でフォーカス')).toBeVisible();
  await page.getByRole('searchbox').fill('JSON');
  await expect(page.getByRole('link', { name: /JSONフォーマッター/i })).toBeVisible();

  await page.goto('/ko/privacy/');
  await expect(page.getByRole('heading', { name: '개인정보 처리방침' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '로컬 처리' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '도구 입력' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '분석 데이터 원칙' })).toBeVisible();
  await expect(page.getByText(/심리 관련 답변을 수집하지 않습니다/)).toBeVisible();
});

test('reflection quiz records answers and shows result', async ({ page }) => {
  await page.goto('/tools/big-five-lite-reflection/');
  await expect(page.getByText(/Files, text, JSON, hashes, and reflection answers are not uploaded/i)).toBeVisible();
  const quizTool = page.locator('astro-island').filter({ has: page.getByRole('heading', { name: 'Big Five Lite Reflection' }) });
  await expect(quizTool.locator('aside').filter({ hasText: /not a medical diagnosis/i })).toBeVisible();
  await page.locator('input[type="radio"][value="4"]').first().check();
  await expect(page.getByText(/1 \/ 10 answered/)).toBeVisible();
  await expect(page.getByText(/Reflection result/)).toBeVisible();
});

test('hash and unit tools render specialized outputs', async ({ page }) => {
  await page.goto('/tools/sha256-generator/');
  await waitForToolReady(page);
  await page.getByLabel('Input').fill('abc');
  await expect(page.getByLabel('Output')).toContainText('ba7816bf');

  await page.goto('/tools/temperature-converter/');
  await waitForToolReady(page);
  await page.getByLabel('Value').fill('100');
  await expect(page.getByLabel('Output')).toContainText('212');
});

test('image canvas tool loads local processing UI', async ({ page }) => {
  await page.goto('/tools/image-grayscale-converter/');
  const tool = page.locator('section.card').filter({ has: page.getByRole('heading', { name: /Local image grayscale/i }) });
  await expect(tool).toBeVisible();
  await expect(tool.getByText(/Files, text, JSON, hashes, and reflection answers are not uploaded/i)).toBeVisible();
  await expect(tool.getByLabel(/Upload image/i)).toBeVisible();
  await expect(tool.getByRole('button', { name: /Download PNG/i })).toBeDisabled();
});

test('image adjustment tools expose editable controls', async ({ page }) => {
  await page.goto('/tools/image-brightness-adjuster/');
  const brightnessTool = page.locator('section.card').filter({ has: page.getByRole('heading', { name: /Local image brightness/i }) });
  await expect(brightnessTool.getByLabel(/Brightness/i)).toBeVisible();
  await brightnessTool.getByLabel(/Brightness/i).fill('12');
  await expect(brightnessTool.getByText(/Brightness:\s+\+12/i)).toBeVisible();

  await page.goto('/tools/image-crop/');
  const cropTool = page.locator('section.card').filter({ has: page.getByRole('heading', { name: /Local image crop/i }) });
  await cropTool.getByLabel(/Crop ratio/i).selectOption('16:9');
  await expect(cropTool.getByLabel(/Crop ratio/i)).toHaveValue('16:9');
});

test('image tools process uploaded fixtures and expose output controls', async ({ page }) => {
  await page.goto('/tools/image-resize-calculator/');
  const tool = page.locator('section.card').filter({ has: page.getByRole('heading', { name: /Local image resizer/i }) });
  await tool.getByLabel(/Upload image/i).setInputFiles(samplePngPath());
  const sourceDetails = tool.locator('p').filter({ hasText: /Source:/i });
  await expect(sourceDetails).toContainText('sample.png');
  await expect(sourceDetails).toContainText('4x3');
  await tool.getByLabel(/Output format/i).selectOption('image/jpeg');
  await expect(tool.getByLabel(/Quality/i)).toBeVisible();
  await tool.getByLabel(/Quality/i).fill('0.7');
  await expect(tool.locator('p').filter({ hasText: /Output:/i })).toContainText('JPEG');
  await expect(tool.getByRole('button', { name: /Download JPEG/i })).toBeEnabled();

  await page.goto('/tools/add-text-watermark/');
  const watermarkTool = page.locator('section.card').filter({ has: page.getByRole('heading', { name: /Local image watermark/i }) });
  await expect(watermarkTool.getByLabel(/Watermark position/i)).toBeVisible();
  await watermarkTool.getByLabel(/Watermark position/i).selectOption('center');
  await watermarkTool.getByLabel(/Font size/i).fill('24');
  await watermarkTool.getByLabel(/Watermark color/i).fill('#ff0000');
});

test('SEO generators expose dedicated fields and outputs', async ({ page }) => {
  await page.goto('/tools/utm-builder/');
  await waitForToolReady(page);
  await page.getByLabel('Campaign source').fill('organic');
  await page.getByLabel('Campaign medium').fill('social');
  await page.getByLabel('Campaign name').fill('spring launch');
  await expect(page.getByLabel('Output')).toContainText('utm_source=organic');
  await expect(page.getByLabel('Output')).toContainText('utm_medium=social');
  await expect(page.getByLabel('Output')).toContainText('utm_campaign=spring+launch');

  await page.goto('/tools/hreflang-tag-generator/');
  await waitForToolReady(page);
  await page.getByLabel('Hreflang rows').fill('en|https://example.com/\nfr|https://example.com/fr/');
  await expect(page.getByLabel('Output')).toContainText('hreflang="fr"');

  await page.goto('/tools/robots-txt-generator/');
  await waitForToolReady(page);
  await page.getByLabel('Disallow paths').fill('/admin/\n/private/');
  await expect(page.getByLabel('Output')).toContainText('Disallow: /admin/');
  await expect(page.getByLabel('Output')).toContainText('Disallow: /private/');

  await page.goto('/tools/faq-schema-generator/');
  await waitForToolReady(page);
  await page.getByLabel('FAQ rows').fill('Is it local?|Whenever possible.');
  await expect(page.getByLabel('Output')).toContainText('FAQPage');
  await expect(page.getByLabel('Output')).toContainText('Is it local?');

  await page.goto('/tools/breadcrumb-schema-generator/');
  await waitForToolReady(page);
  await page.getByLabel('Breadcrumb rows').fill('Home|https://example.com/\nTools|https://example.com/tools/');
  await expect(page.getByLabel('Output')).toContainText('BreadcrumbList');
  await expect(page.getByLabel('Output')).toContainText('"position": 2');
});

test('calculator tools expose dedicated numeric fields and readable outputs', async ({ page }) => {
  await page.goto('/tools/percentage-calculator/');
  await waitForToolReady(page);
  await page.getByLabel('Value').fill('30');
  await page.getByLabel('Total').fill('120');
  await expect(page.getByLabel('Output')).toContainText('25%');

  await page.goto('/tools/percentage-change-calculator/');
  await waitForToolReady(page);
  await page.getByLabel('Previous value').fill('80');
  await page.getByLabel('Current value').fill('100');
  await expect(page.getByLabel('Output')).toContainText('+25%');

  await page.goto('/tools/discount-calculator/');
  await waitForToolReady(page);
  await page.getByLabel('Original price').fill('80');
  await page.getByLabel('Discount percent').fill('25');
  await expect(page.getByLabel('Output')).toContainText('Final price: 60.00');
  await expect(page.getByLabel('Output')).toContainText('You save: 20.00');

  await page.goto('/tools/loan-payment-calculator/');
  await waitForToolReady(page);
  await page.getByLabel('Principal').fill('12000');
  await page.getByLabel('Annual rate').fill('0');
  await page.getByLabel('Years').fill('1');
  await page.getByLabel('Payments per year').fill('12');
  await expect(page.getByLabel('Output')).toContainText('Payment per period: 1000.00');

  await page.goto('/tools/compound-interest-calculator/');
  await waitForToolReady(page);
  await page.getByLabel('Principal').fill('1000');
  await page.getByLabel('Annual rate').fill('5');
  await page.getByLabel('Years').fill('10');
  await page.getByLabel('Compounds per year').fill('1');
  await expect(page.getByLabel('Output')).toContainText('Final amount: 1628.89');
});

test('developer tools expose dedicated regex cron and base fields', async ({ page }) => {
  await page.goto('/tools/regex-tester/');
  await waitForToolReady(page);
  await page.getByLabel('Pattern').fill('(?<key>\\w+)=(\\d+)');
  await page.getByLabel('Flags').fill('g');
  await page.getByLabel('Test text').fill('a=1 b=22');
  await expect(page.getByLabel('Output')).toContainText('"value": "a=1"');
  await expect(page.getByLabel('Output')).toContainText('"key": "b"');

  await page.goto('/tools/cron-expression-explainer/');
  await waitForToolReady(page);
  await page.getByLabel('Cron expression').fill('*/15 9-17 1,15 * 1-5');
  await expect(page.getByLabel('Output')).toContainText('every 15 minutes');
  await expect(page.getByLabel('Output')).toContainText('from hour 9 through 17');

  await page.goto('/tools/number-base-converter/');
  await waitForToolReady(page);
  await page.getByLabel('Value').fill('1010');
  await page.getByLabel('From base').fill('2');
  await page.getByLabel('To base').fill('10');
  await expect(page.getByLabel('Output')).toContainText('10');
});

test('new stage 12 data and text tools expose useful outputs', async ({ page }) => {
  await page.goto('/tools/url-parser/');
  await waitForToolReady(page);
  await page.getByRole('textbox', { name: 'Input' }).fill('https://example.com/a/b?tag=json&tag=seo#top');
  await expect(page.getByLabel('Output')).toContainText('"hostname": "example.com"');
  await expect(page.getByLabel('Output')).toContainText('"values": [');

  await page.goto('/tools/csv-delimiter-converter/');
  await waitForToolReady(page);
  await page.getByLabel('To delimiter').selectOption('|');
  await page.getByRole('textbox', { name: 'Input' }).fill('name,role\nAda,Engineer');
  await expect(page.getByLabel('Output')).toContainText('name|role');

  await page.goto('/tools/xml-formatter/');
  await waitForToolReady(page);
  await page.getByRole('textbox', { name: 'Input' }).fill('<root><item>Hello</item></root>');
  await expect(page.getByLabel('Output')).toContainText('  <item>');

  await page.goto('/tools/yaml-to-json/');
  await waitForToolReady(page);
  await page.getByRole('textbox', { name: 'Input' }).fill('name: Ada\nskills:\n  - JSON\n  - YAML');
  await expect(page.getByLabel('Output')).toContainText('"name": "Ada"');
  await expect(page.getByLabel('Output')).toContainText('"YAML"');

  await page.goto('/tools/json-to-yaml/');
  await waitForToolReady(page);
  await page.getByRole('textbox', { name: 'Input' }).fill('{"name":"Ada","skills":["JSON","YAML"]}');
  await expect(page.getByLabel('Output')).toContainText('name: Ada');
  await expect(page.getByLabel('Output')).toContainText('- YAML');

  await page.goto('/tools/diff-checker/');
  await waitForToolReady(page);
  await page.getByLabel('Original text').fill('alpha\nbeta');
  await page.getByLabel('Changed text').fill('alpha\ngamma');
  await expect(page.getByLabel('Output')).toContainText('- beta');
  await expect(page.getByLabel('Output')).toContainText('+ gamma');

  await page.goto('/tools/lorem-ipsum-generator/');
  await waitForToolReady(page);
  await page.getByLabel('Paragraphs').fill('2');
  await page.getByLabel('Sentences per paragraph').fill('1');
  await expect(page.getByLabel('Output')).toContainText('Lorem ipsum dolor sit amet');

  await page.goto('/tools/markdown-previewer/');
  await waitForToolReady(page);
  await page.getByRole('textbox', { name: 'Input' }).fill('# Preview\n\nUse **bold** and `code`.');
  await expect(page.getByRole('region', { name: 'Markdown preview' })).toContainText('Preview');
  await expect(page.getByRole('region', { name: 'Markdown preview' }).locator('strong')).toContainText('bold');
});
