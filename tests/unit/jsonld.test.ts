import { describe, expect, it } from 'vitest';
import { breadcrumbJsonLd, faqJsonLd, toolJsonLd, websiteJsonLd } from '@/lib/seo/jsonld';

describe('page JSON-LD helpers', () => {
  it('builds WebSite and WebApplication JSON-LD', () => {
    expect(websiteJsonLd('https://tovolbox.hsn8086.com')).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: 'https://tovolbox.hsn8086.com',
    });
    expect(toolJsonLd('JSON Formatter', 'Format JSON.', 'https://tovolbox.hsn8086.com/tools/json-formatter/')).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      applicationCategory: 'UtilitiesApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    });
  });

  it('builds FAQPage JSON-LD from localized FAQ entries', () => {
    expect(faqJsonLd([{ question: 'Is it local?', answer: 'Whenever possible.' }])).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is it local?',
          acceptedAnswer: { '@type': 'Answer', text: 'Whenever possible.' },
        },
      ],
    });
  });

  it('builds BreadcrumbList JSON-LD with stable positions', () => {
    expect(
      breadcrumbJsonLd([
        { name: 'TovolBox', url: 'https://tovolbox.hsn8086.com/' },
        { name: 'JSON and Data Tools', url: 'https://tovolbox.hsn8086.com/categories/json-data-tools/' },
        { name: 'JSON Formatter', url: 'https://tovolbox.hsn8086.com/tools/json-formatter/' },
      ]),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'TovolBox', item: 'https://tovolbox.hsn8086.com/' },
        { '@type': 'ListItem', position: 2, name: 'JSON and Data Tools', item: 'https://tovolbox.hsn8086.com/categories/json-data-tools/' },
        { '@type': 'ListItem', position: 3, name: 'JSON Formatter', item: 'https://tovolbox.hsn8086.com/tools/json-formatter/' },
      ],
    });
  });
});
