import { describe, expect, it } from 'vitest';
import {
  generateBreadcrumbSchema,
  generateCanonicalTag,
  generateFaqSchema,
  generateHreflangTags,
  generateRobotsTxt,
} from '@/lib/tools/schemaGenerators';

describe('SEO schema generators', () => {
  it('generates FAQ JSON-LD and filters incomplete entries', () => {
    expect(
      generateFaqSchema([
        { question: ' What is TovolBox? ', answer: ' A collection of browser tools. ' },
        { question: '', answer: 'Missing question' },
        { question: 'Missing answer', answer: ' ' },
      ]),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is TovolBox?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A collection of browser tools.',
          },
        },
      ],
    });
  });

  it('generates breadcrumb JSON-LD with one-based positions', () => {
    expect(
      generateBreadcrumbSchema([
        { name: ' Home ', url: ' https://tovolbox.com/ ' },
        { name: 'Tools', url: 'https://tovolbox.com/tools/' },
        { name: ' ', url: 'https://tovolbox.com/ignored/' },
      ]),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://tovolbox.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Tools',
          item: 'https://tovolbox.com/tools/',
        },
      ],
    });
  });

  it('generates an escaped canonical link tag', () => {
    expect(generateCanonicalTag(' https://example.com/tools?a=1&b="two" ')).toBe(
      '<link rel="canonical" href="https://example.com/tools?a=1&amp;b=&quot;two&quot;">',
    );
  });

  it('generates escaped hreflang link tags and filters empty entries', () => {
    expect(
      generateHreflangTags([
        { hreflang: 'en', href: 'https://tovolbox.com/tools/' },
        { hreflang: 'zh-CN', href: 'https://tovolbox.com/zh-CN/tools/?q=a&b=c' },
        { hreflang: '', href: 'https://tovolbox.com/ignored/' },
      ]),
    ).toBe(
      '<link rel="alternate" hreflang="en" href="https://tovolbox.com/tools/">\n' +
        '<link rel="alternate" hreflang="zh-CN" href="https://tovolbox.com/zh-CN/tools/?q=a&amp;b=c">',
    );
  });

  it('generates robots.txt with defaults, allow, disallow, and sitemap lines', () => {
    expect(
      generateRobotsTxt({
        allow: [' /tools/ ', ''],
        disallow: ['/admin/'],
        sitemap: [' https://tovolbox.com/sitemap-index.xml ', ' '],
      }),
    ).toBe('User-agent: *\nAllow: /tools/\nDisallow: /admin/\nSitemap: https://tovolbox.com/sitemap-index.xml\n');
  });

  it('supports a custom robots user agent and a single sitemap', () => {
    expect(generateRobotsTxt({ userAgent: 'Googlebot', sitemap: 'https://tovolbox.com/sitemap.xml' })).toBe(
      'User-agent: Googlebot\nSitemap: https://tovolbox.com/sitemap.xml\n',
    );
  });
});
