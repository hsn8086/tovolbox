import { locales, type Locale } from '@/data/locales';
import { buildSearchItems } from '@/lib/search/indexItems';

export function getStaticPaths() {
  return locales.map((locale) => ({ params: { locale } }));
}

export function GET({ params }: { params: { locale: Locale } }) {
  return new Response(JSON.stringify(buildSearchItems(params.locale)), {
    headers: { 'Content-Type': 'application/json' },
  });
}
