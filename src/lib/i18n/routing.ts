import { defaultLocale, locales, type Locale } from '@/data/locales';

export type RouteKind =
  | 'home'
  | 'search'
  | 'categories'
  | 'category'
  | 'tool'
  | 'about'
  | 'privacy'
  | 'terms'
  | 'contact';

export type RouteInput = {
  locale: Locale;
  kind: RouteKind;
  slug?: string;
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function localePrefix(locale: Locale): string {
  return locale === defaultLocale ? '' : `/${locale}`;
}

export function getLocalizedPath({ locale, kind, slug }: RouteInput): string {
  const prefix = localePrefix(locale);

  if (kind === 'home') return `${prefix || '/'}`;
  if (kind === 'search') return `${prefix}/search/`;
  if (kind === 'categories') return `${prefix}/categories/`;
  if (kind === 'category') return `${prefix}/categories/${slug}/`;
  if (kind === 'tool') return `${prefix}/tools/${slug}/`;
  return `${prefix}/${kind}/`;
}

export function getCanonicalUrl(input: RouteInput, site = 'https://tovolbox.hsn8086.com'): string {
  return new URL(getLocalizedPath(input), site).toString();
}

export function getHreflangLinks(input: Omit<RouteInput, 'locale'>, site = 'https://tovolbox.hsn8086.com') {
  const links = locales.map((locale) => ({
    hreflang: locale,
    href: getCanonicalUrl({ ...input, locale }, site),
  }));

  return [
    { hreflang: 'x-default', href: getCanonicalUrl({ ...input, locale: defaultLocale }, site) },
    ...links,
  ];
}
