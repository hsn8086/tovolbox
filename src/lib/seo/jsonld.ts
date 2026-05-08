import type { LocalizedFaq } from '@/data/types';

export type BreadcrumbJsonLdItem = {
  name: string;
  url: string;
};

export function websiteJsonLd(site = 'https://tovolbox.hsn8086.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TovolBox',
    url: site,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${site}/search/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function faqJsonLd(faq: LocalizedFaq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function toolJsonLd(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}

export function breadcrumbJsonLd(items: BreadcrumbJsonLdItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
