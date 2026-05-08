export type ParsedQueryParam = {
  key: string;
  values: string[];
};

export type UrlParseResult =
  | {
      ok: true;
      output: ParsedUrl;
    }
  | {
      ok: false;
      error: string;
    };

export type ParsedUrl = {
  input: string;
  href: string;
  protocol: string;
  origin: string;
  username: string;
  passwordPresent: boolean;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  pathSegments: string[];
  search: string;
  hash: string;
  query: ParsedQueryParam[];
};

function normalizeUrlInput(input: string): string {
  const trimmed = input.trim();
  if (trimmed.length === 0) throw new Error('URL input cannot be empty');
  if (/^[a-z][a-z\d+.-]*:/i.test(trimmed) || trimmed.startsWith('/')) return trimmed;
  if (/^[\w.-]+(?:\:\d+)?(?:[/?#]|$)/.test(trimmed)) return `https://${trimmed}`;
  throw new Error('URL input must be absolute, domain-like, or root-relative');
}

export function parseUrl(input: string): UrlParseResult {
  try {
    const normalized = normalizeUrlInput(input);
    const url = new URL(normalized, 'https://example.com');
    const queryKeys = Array.from(new Set(Array.from(url.searchParams.keys())));

    return {
      ok: true,
      output: {
        input: input.trim(),
        href: url.href,
        protocol: url.protocol,
        origin: url.origin,
        username: url.username,
        passwordPresent: url.password.length > 0,
        host: url.host,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        pathSegments: url.pathname.split('/').filter(Boolean).map(decodeURIComponent),
        search: url.search,
        hash: url.hash,
        query: queryKeys.map((key) => ({ key, values: url.searchParams.getAll(key) })),
      },
    };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Invalid URL' };
  }
}
