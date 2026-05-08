import { describe, expect, it } from 'vitest';
import { categories, tools } from '@/data/content';
import { locales } from '@/data/locales';

describe('content data', () => {
  it('has localized SEO for every category and tool', () => {
    for (const item of [...categories, ...tools]) {
      for (const locale of locales) {
        expect(item.seo[locale].title.length).toBeGreaterThan(5);
        expect(item.seo[locale].description.length).toBeGreaterThan(10);
        expect(item.seo[locale].faq.length).toBeGreaterThan(0);
      }
    }
  });

  it('keeps MMPI and SCL pages content-only', () => {
    expect(tools.find((tool) => tool.slug === 'what-is-mmpi')?.status).toBe('content-only');
    expect(tools.find((tool) => tool.slug === 'scl-90-overview')?.status).toBe('content-only');
  });
});
