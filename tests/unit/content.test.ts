import { describe, expect, it } from 'vitest';
import { categories, tools } from '@/data/content';
import { locales } from '@/data/locales';
import { getPageCopy, getSearchCopy } from '@/data/pageCopy';
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

  it('localizes priority Japanese and Korean category content', () => {
    for (const category of categories) {
      expect(category.seo.ja.title).not.toBe(category.seo.en.title);
      expect(category.seo.ko.title).not.toBe(category.seo.en.title);
      expect(category.seo.ja.description).not.toBe(category.seo.en.description);
      expect(category.seo.ko.description).not.toBe(category.seo.en.description);
    }
  });

  it('localizes priority Japanese and Korean core tools', () => {
    const prioritySlugs = [
      'json-formatter',
      'json-minifier',
      'json-to-csv',
      'csv-to-json',
      'query-string-parser',
      'query-string-builder',
      'base64-encode-decode',
      'url-encode-decode',
      'html-entity-encode-decode',
      'word-counter',
      'case-converter',
      'slug-generator',
      'jwt-decoder',
      'uuid-generator',
      'ulid-generator',
      'utm-builder',
      'meta-title-checker',
      'sha256-generator',
      'image-resize-calculator',
      'introvert-extrovert-test',
    ];

    for (const slug of prioritySlugs) {
      const tool = tools.find((item) => item.slug === slug);
      expect(tool).toBeDefined();
      expect(tool!.seo.ja.title).not.toBe(tool!.seo.en.title);
      expect(tool!.seo.ko.title).not.toBe(tool!.seo.en.title);
      expect(tool!.seo.ja.description).not.toBe(tool!.seo.en.description);
      expect(tool!.seo.ko.description).not.toBe(tool!.seo.en.description);
    }
  });

  it('provides localized page and search copy for priority languages', () => {
    for (const locale of ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'] as const) {
      expect(getPageCopy(locale).privacyTitle).toBeTruthy();
      expect(getPageCopy(locale).ymylDisclaimer).toMatch(/diagnosis|诊断|診斷|診断|진단/i);
      expect(getSearchCopy(locale).label).toBeTruthy();
      expect(getSearchCopy(locale).resultSummary(2, 'json', 'seo', true)).toContain('2');
    }

    expect(getPageCopy('ja').privacyTitle).not.toBe(getPageCopy('en').privacyTitle);
    expect(getPageCopy('ko').privacyTitle).not.toBe(getPageCopy('en').privacyTitle);
    expect(getSearchCopy('ja').placeholder).not.toBe(getSearchCopy('en').placeholder);
    expect(getSearchCopy('ko').placeholder).not.toBe(getSearchCopy('en').placeholder);
  });

  it('localizes fallback SEO section headings for priority languages', () => {
    const tool = tools.find((item) => item.slug === 'word-counter');
    expect(tool).toBeDefined();

    expect(getToolSeoSections(tool!, 'ja')[0].heading).toBe('このツールでできること');
    expect(getToolSeoSections(tool!, 'ko')[0].heading).toBe('이 도구로 할 수 있는 일');
    expect(getToolSeoSections(tool!, 'zh-CN')[1].heading).toBe('隐私和处理说明');
    expect(getToolSeoSections(tool!, 'zh-TW')[1].heading).toBe('隱私和處理說明');
  });
});
