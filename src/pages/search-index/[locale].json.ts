import { categories, tools } from '@/data/content';
import { locales, type Locale } from '@/data/locales';
import { getLocalizedPath } from '@/lib/i18n/routing';

export function getStaticPaths() {
  return locales.map((locale) => ({ params: { locale } }));
}

export function GET({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const items = [
    ...categories.map((category) => ({
      type: 'category',
      title: category.seo[locale].h1,
      description: category.seo[locale].description,
      url: getLocalizedPath({ locale, kind: 'category', slug: category.slug }),
      keywords: category.seo[locale].keywords,
    })),
    ...tools.map((tool) => ({
      type: 'tool',
      title: tool.seo[locale].h1,
      description: tool.seo[locale].description,
      url: getLocalizedPath({ locale, kind: 'tool', slug: tool.slug }),
      keywords: tool.seo[locale].keywords,
      tags: tool.tags,
      popularity: tool.popularity,
    })),
  ];

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json' },
  });
}
