export function buildUtmUrl(input: {
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}): string {
  const url = new URL(input.url);
  url.searchParams.set('utm_source', input.source);
  url.searchParams.set('utm_medium', input.medium);
  url.searchParams.set('utm_campaign', input.campaign);
  if (input.term) url.searchParams.set('utm_term', input.term);
  if (input.content) url.searchParams.set('utm_content', input.content);
  return url.toString();
}

export function titleAdvice(title: string): { length: number; status: 'short' | 'good' | 'long'; message: string } {
  const length = title.trim().length;
  if (length < 30) return { length, status: 'short', message: 'The title may be too short for search snippets.' };
  if (length > 60) return { length, status: 'long', message: 'The title may be truncated in search results.' };
  return { length, status: 'good', message: 'The title length is within a common SEO range.' };
}
