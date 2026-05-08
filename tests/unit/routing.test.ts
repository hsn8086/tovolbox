import { describe, expect, it } from 'vitest';
import { getCanonicalUrl, getHreflangLinks, getLocalizedPath } from '@/lib/i18n/routing';

describe('localized routing', () => {
  it('keeps English URLs unprefixed', () => {
    expect(getLocalizedPath({ locale: 'en', kind: 'home' })).toBe('/');
    expect(getLocalizedPath({ locale: 'en', kind: 'tool', slug: 'json-formatter' })).toBe('/tools/json-formatter/');
  });

  it('prefixes non-English URLs', () => {
    expect(getLocalizedPath({ locale: 'zh-CN', kind: 'tool', slug: 'json-formatter' })).toBe('/zh-CN/tools/json-formatter/');
    expect(getLocalizedPath({ locale: 'ar', kind: 'search' })).toBe('/ar/search/');
  });

  it('generates canonical and full hreflang links', () => {
    expect(getCanonicalUrl({ locale: 'en', kind: 'tool', slug: 'json-formatter' })).toBe('https://tovolbox.hsn8086.com/tools/json-formatter/');
    const links = getHreflangLinks({ kind: 'tool', slug: 'json-formatter' });
    expect(links).toHaveLength(12);
    expect(links[0]).toEqual({ hreflang: 'x-default', href: 'https://tovolbox.hsn8086.com/tools/json-formatter/' });
    expect(links).toContainEqual({ hreflang: 'zh-CN', href: 'https://tovolbox.hsn8086.com/zh-CN/tools/json-formatter/' });
    expect(links).toContainEqual({ hreflang: 'ar', href: 'https://tovolbox.hsn8086.com/ar/tools/json-formatter/' });
    expect(links.some((link) => link.href.includes('/en/'))).toBe(false);
  });
});
