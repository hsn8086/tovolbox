import { describe, expect, it } from 'vitest';
import { categories, tools } from '@/data/content';
import { locales } from '@/data/locales';
import { GET } from '@/pages/sitemap.xml';

describe('sitemap', () => {
  it('generates canonical production URLs for every locale', async () => {
    const response = GET();
    const xml = await response.text();
    const urls = xml.match(/<url><loc>/g) ?? [];

    expect(response.headers.get('Content-Type')).toBe('application/xml');
    expect(urls).toHaveLength(locales.length * (7 + categories.length + tools.length));
    expect(xml).toContain('<loc>https://tovolbox.hsn8086.com/</loc>');
    expect(xml).toContain('<loc>https://tovolbox.hsn8086.com/tools/json-formatter/</loc>');
    expect(xml).toContain('<loc>https://tovolbox.hsn8086.com/zh-CN/tools/json-formatter/</loc>');
    expect(xml).toContain('<loc>https://tovolbox.hsn8086.com/ar/tools/json-formatter/</loc>');
    expect(xml).not.toContain('https://tovolbox.hsn8086.com/en/');
    expect(xml).not.toContain('https://tovolbox.com');
  });
});
