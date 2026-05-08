import { describe, expect, it } from 'vitest';
import { buildQueryString, parseQueryString } from '@/lib/tools/queryString';

describe('query string pure functions', () => {
  it('parses query strings with or without a leading question mark', () => {
    expect(parseQueryString('?name=Alice&city=New%20York')).toMatchObject({
      ok: true,
      entries: [
        { key: 'name', value: 'Alice' },
        { key: 'city', value: 'New York' },
      ],
      params: { name: 'Alice', city: 'New York' },
    });

    expect(parseQueryString('name=Alice').params).toEqual({ name: 'Alice' });
  });

  it('keeps repeated keys in order and exposes grouped params', () => {
    expect(parseQueryString('tag=ts&tag=vitest&tag=tools')).toMatchObject({
      ok: true,
      entries: [
        { key: 'tag', value: 'ts' },
        { key: 'tag', value: 'vitest' },
        { key: 'tag', value: 'tools' },
      ],
      params: { tag: ['ts', 'vitest', 'tools'] },
    });
  });

  it('handles empty values, missing equals signs, and plus spaces', () => {
    expect(parseQueryString('empty=&flag&message=hello+world')).toMatchObject({
      ok: true,
      params: { empty: '', flag: '', message: 'hello world' },
    });
  });

  it('reports URL decode errors without throwing', () => {
    const result = parseQueryString('valid=yes&bad=%E0%A4%A');

    expect(result.ok).toBe(false);
    expect(result.entries).toEqual([{ key: 'valid', value: 'yes' }]);
    expect(result.params).toEqual({ valid: 'yes' });
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.input).toBe('%E0%A4%A');
  });

  it('builds encoded query strings while preserving duplicate entries', () => {
    expect(
      buildQueryString([
        { key: 'q', value: 'hello world' },
        { key: 'tag', value: 'ts' },
        { key: 'tag', value: 'vitest' },
        { key: 'symbol', value: '&=' },
      ]),
    ).toBe('q=hello%20world&tag=ts&tag=vitest&symbol=%26%3D');
  });
});
