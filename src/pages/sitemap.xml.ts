import { categories, tools } from '@/data/content';
import { locales } from '@/data/locales';
import { getCanonicalUrl } from '@/lib/i18n/routing';

export function GET() {
  const urls = locales.flatMap((locale) => [
    getCanonicalUrl({ locale, kind: 'home' }),
    getCanonicalUrl({ locale, kind: 'search' }),
    getCanonicalUrl({ locale, kind: 'categories' }),
    getCanonicalUrl({ locale, kind: 'about' }),
    getCanonicalUrl({ locale, kind: 'privacy' }),
    getCanonicalUrl({ locale, kind: 'terms' }),
    getCanonicalUrl({ locale, kind: 'contact' }),
    ...categories.map((category) => getCanonicalUrl({ locale, kind: 'category', slug: category.slug })),
    ...tools.map((tool) => getCanonicalUrl({ locale, kind: 'tool', slug: tool.slug })),
  ]);

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc></url>`).join('')}</urlset>`, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
