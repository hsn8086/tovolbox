import { categories, tools } from '@/data/content';
import type { Locale } from '@/data/locales';
import { getLocalizedPath } from '@/lib/i18n/routing';
import type { SearchItem } from './filter';

export function buildSearchItems(locale: Locale): SearchItem[] {
  const categoryTitles = new Map(categories.map((category) => [category.slug, category.seo[locale].h1]));

  return [
    ...categories.map((category) => ({
      slug: category.slug,
      type: 'category' as const,
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
      type: 'tool' as const,
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
}
