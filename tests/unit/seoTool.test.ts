import { describe, expect, it } from 'vitest';
import { parseBreadcrumbRows, parseFaqRows, parseHreflangRows, parsePipeRows, splitListInput } from '@/islands/tools/SeoTool';

describe('SEO tool form helpers', () => {
  it('splits comma and newline lists', () => {
    expect(splitListInput('/, /tools/\n/private/,,')).toEqual(['/', '/tools/', '/private/']);
  });

  it('parses pipe-delimited rows while preserving additional pipes in values', () => {
    expect(parsePipeRows('en|https://example.com/\nQuestion|Answer with | pipe\nmissing')).toEqual([
      ['en', 'https://example.com/'],
      ['Question', 'Answer with | pipe'],
      ['missing', ''],
    ]);
  });

  it('maps rows into hreflang, FAQ, and breadcrumb inputs', () => {
    expect(parseHreflangRows('x-default|https://example.com/')).toEqual([{ hreflang: 'x-default', href: 'https://example.com/' }]);
    expect(parseFaqRows('Is it free?|Yes.')).toEqual([{ question: 'Is it free?', answer: 'Yes.' }]);
    expect(parseBreadcrumbRows('Home|https://example.com/')).toEqual([{ name: 'Home', url: 'https://example.com/' }]);
  });
});
