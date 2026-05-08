export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqSchema = {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
};

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export type BreadcrumbSchema = {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
};

export type HreflangLink = {
  hreflang: string;
  href: string;
};

export type RobotsTxtOptions = {
  userAgent?: string;
  allow?: string[];
  disallow?: string[];
  sitemap?: string | string[];
};

const escapeAttribute = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

export function generateFaqSchema(items: FaqItem[]): FaqSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items
      .map((item) => ({ question: item.question.trim(), answer: item.answer.trim() }))
      .filter((item) => item.question.length > 0 && item.answer.length > 0)
      .map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
  };
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
      .map((item) => ({ name: item.name.trim(), url: item.url.trim() }))
      .filter((item) => item.name.length > 0 && item.url.length > 0)
      .map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
  };
}

export function generateCanonicalTag(url: string): string {
  return `<link rel="canonical" href="${escapeAttribute(url.trim())}">`;
}

export function generateHreflangTags(links: HreflangLink[]): string {
  return links
    .map((link) => ({ hreflang: link.hreflang.trim(), href: link.href.trim() }))
    .filter((link) => link.hreflang.length > 0 && link.href.length > 0)
    .map((link) => `<link rel="alternate" hreflang="${escapeAttribute(link.hreflang)}" href="${escapeAttribute(link.href)}">`)
    .join('\n');
}

export function generateRobotsTxt(options: RobotsTxtOptions = {}): string {
  const userAgent = options.userAgent?.trim() || '*';
  const lines = [`User-agent: ${userAgent}`];

  for (const path of options.allow ?? []) {
    const trimmedPath = path.trim();

    if (trimmedPath.length > 0) {
      lines.push(`Allow: ${trimmedPath}`);
    }
  }

  for (const path of options.disallow ?? []) {
    const trimmedPath = path.trim();

    if (trimmedPath.length > 0) {
      lines.push(`Disallow: ${trimmedPath}`);
    }
  }

  const sitemaps = Array.isArray(options.sitemap) ? options.sitemap : options.sitemap ? [options.sitemap] : [];

  for (const sitemap of sitemaps) {
    const trimmedSitemap = sitemap.trim();

    if (trimmedSitemap.length > 0) {
      lines.push(`Sitemap: ${trimmedSitemap}`);
    }
  }

  return `${lines.join('\n')}\n`;
}
