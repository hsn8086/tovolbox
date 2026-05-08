import { categories, tools } from '@/data/content';
import { locales, type Locale } from '@/data/locales';
import { getLocalizedPath } from '@/lib/i18n/routing';

export function getStaticPaths() {
  return locales.map((locale) => ({ params: { locale } }));
}

export function GET({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const categoryTitles = new Map(categories.map((category) => [category.slug, category.seo[locale].h1]));
  const items = [
    ...categories.map((category) => ({
      slug: category.slug,
      type: 'category',
      title: category.seo[locale].h1,
      description: category.seo[locale].description,
      categorySlug: category.slug,
      categoryTitle: category.seo[locale].h1,
      url: getLocalizedPath({ locale, kind: 'category', slug: category.slug }),
      keywords: category.seo[locale].keywords,
      tags: [category.slug],
      popularity: 120,
    })),
    ...tools.map((tool) => ({
      slug: tool.slug,
      type: 'tool',
      title: tool.seo[locale].h1,
      description: tool.seo[locale].description,
      categorySlug: tool.categorySlug,
      categoryTitle: categoryTitles.get(tool.categorySlug) ?? tool.categorySlug,
      url: getLocalizedPath({ locale, kind: 'tool', slug: tool.slug }),
      keywords: [tool.slug, tool.categorySlug, ...(tool.seo[locale].keywords ?? [])],
      tags: tool.tags,
      popularity: tool.popularity,
    })),
  ];

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json' },
  });
}
