export type QueryStringEntry = {
  key: string;
  value: string;
};

export type QueryStringDecodeError = {
  input: string;
  error: string;
};

export type QueryStringResult = {
  ok: boolean;
  entries: QueryStringEntry[];
  params: Record<string, string | string[]>;
  errors: QueryStringDecodeError[];
};

function decodeQueryPart(input: string): { ok: true; value: string } | { ok: false; error: string } {
  try {
    return { ok: true, value: decodeURIComponent(input.replace(/\+/g, ' ')) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Invalid URL encoding' };
  }
}

export function parseQueryString(input: string): QueryStringResult {
  const query = input.startsWith('?') ? input.slice(1) : input;
  const entries: QueryStringEntry[] = [];
  const params: Record<string, string | string[]> = {};
  const errors: QueryStringDecodeError[] = [];

  for (const segment of query.split('&')) {
    if (segment === '') continue;

    const separatorIndex = segment.indexOf('=');
    const rawKey = separatorIndex === -1 ? segment : segment.slice(0, separatorIndex);
    const rawValue = separatorIndex === -1 ? '' : segment.slice(separatorIndex + 1);
    const decodedKey = decodeQueryPart(rawKey);
    const decodedValue = decodeQueryPart(rawValue);

    if (!decodedKey.ok) errors.push({ input: rawKey, error: decodedKey.error });
    if (!decodedValue.ok) errors.push({ input: rawValue, error: decodedValue.error });
    if (!decodedKey.ok || !decodedValue.ok) continue;

    const entry = { key: decodedKey.value, value: decodedValue.value };
    entries.push(entry);

    const currentValue = params[entry.key];
    if (currentValue === undefined) {
      params[entry.key] = entry.value;
    } else if (Array.isArray(currentValue)) {
      currentValue.push(entry.value);
    } else {
      params[entry.key] = [currentValue, entry.value];
    }
  }

  return { ok: errors.length === 0, entries, params, errors };
}

export function buildQueryString(entries: Array<{ key: string; value: string }>): string {
  return entries.map(({ key, value }) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
}
