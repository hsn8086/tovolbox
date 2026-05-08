import { describe, expect, it } from 'vitest';
import { categories, tools } from '@/data/content';
import { locales } from '@/data/locales';
import { getToolSeoSections } from '@/data/seoContent';

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

  it('keeps English titles and descriptions unique enough for indexing', () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();

    for (const item of [...categories, ...tools]) {
      expect(titles.has(item.seo.en.title)).toBe(false);
      expect(descriptions.has(item.seo.en.description)).toBe(false);
      titles.add(item.seo.en.title);
      descriptions.add(item.seo.en.description);
    }
  });

  it('adds specific SEO sections for core tools', () => {
    for (const slug of ['json-formatter', 'utm-builder', 'image-resize-calculator', 'sha256-generator']) {
      const tool = tools.find((item) => item.slug === slug);
      expect(tool).toBeDefined();
      const sections = getToolSeoSections(tool!, 'en');
      expect(sections).toHaveLength(2);
      expect(sections.flatMap((section) => section.items).length).toBeGreaterThanOrEqual(6);
      expect(sections.map((section) => section.body).join(' ')).not.toMatch(/Use this browser-based tool for everyday work/i);
    }
  });
});
