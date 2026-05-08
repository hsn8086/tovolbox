export type MetaDescriptionStatus = 'short' | 'good' | 'long';

export type MetaDescriptionAnalysis = {
  length: number;
  status: MetaDescriptionStatus;
  message: string;
  recommendedMin: number;
  recommendedMax: number;
};

export type SerpPreview = {
  title: string;
  url: string;
  displayUrl: string;
  description: string;
  descriptionAnalysis: MetaDescriptionAnalysis;
};

export type SerpPreviewInput = {
  title: string;
  url: string;
  description: string;
};

export type OpenGraphInput = {
  title: string;
  description: string;
  url: string;
  image?: string;
  siteName?: string;
  type?: string;
};

export type TwitterCardInput = {
  title: string;
  description: string;
  image?: string;
  site?: string;
  creator?: string;
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
};

const META_DESCRIPTION_MIN = 120;
const META_DESCRIPTION_MAX = 160;

export function analyzeMetaDescription(description: string): MetaDescriptionAnalysis {
  const length = description.trim().length;

  if (length < META_DESCRIPTION_MIN) {
    return {
      length,
      status: 'short',
      message: 'The meta description may be too short for a useful search result snippet.',
      recommendedMin: META_DESCRIPTION_MIN,
      recommendedMax: META_DESCRIPTION_MAX,
    };
  }

  if (length > META_DESCRIPTION_MAX) {
    return {
      length,
      status: 'long',
      message: 'The meta description may be truncated in search results.',
      recommendedMin: META_DESCRIPTION_MIN,
      recommendedMax: META_DESCRIPTION_MAX,
    };
  }

  return {
    length,
    status: 'good',
    message: 'The meta description length is within a common SEO range.',
    recommendedMin: META_DESCRIPTION_MIN,
    recommendedMax: META_DESCRIPTION_MAX,
  };
}

export function buildSerpPreview(input: SerpPreviewInput): SerpPreview {
  const title = input.title.trim();
  const url = input.url.trim();
  const description = input.description.trim();

  return {
    title,
    url,
    displayUrl: buildDisplayUrl(url),
    description,
    descriptionAnalysis: analyzeMetaDescription(description),
  };
}

export function buildOpenGraphTags(input: OpenGraphInput): string {
  const type = input.type?.trim() || 'website';
  const tags = [
    metaTag('property', 'og:type', type),
    metaTag('property', 'og:title', input.title),
    metaTag('property', 'og:description', input.description),
    metaTag('property', 'og:url', input.url),
  ];

  if (input.image?.trim()) tags.push(metaTag('property', 'og:image', input.image));
  if (input.siteName?.trim()) tags.push(metaTag('property', 'og:site_name', input.siteName));

  return tags.join('\n');
}

export function buildTwitterCardTags(input: TwitterCardInput): string {
  const card = input.card?.trim() || (input.image?.trim() ? 'summary_large_image' : 'summary');
  const tags = [
    metaTag('name', 'twitter:card', card),
    metaTag('name', 'twitter:title', input.title),
    metaTag('name', 'twitter:description', input.description),
  ];

  if (input.image?.trim()) tags.push(metaTag('name', 'twitter:image', input.image));
  if (input.site?.trim()) tags.push(metaTag('name', 'twitter:site', input.site));
  if (input.creator?.trim()) tags.push(metaTag('name', 'twitter:creator', input.creator));

  return tags.join('\n');
}

function buildDisplayUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname === '/' ? '' : parsed.pathname.replace(/\/$/, '');
    return `${parsed.hostname}${path}`;
  } catch {
    return url;
  }
}

function metaTag(attributeName: 'name' | 'property', key: string, content: string): string {
  return `<meta ${attributeName}="${escapeHtmlAttribute(key)}" content="${escapeHtmlAttribute(content.trim())}">`;
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
