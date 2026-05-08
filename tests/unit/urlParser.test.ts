import { describe, expect, it } from 'vitest';
import { parseUrl } from '@/lib/tools/urlParser';

describe('parseUrl', () => {
  it('breaks an absolute URL into useful parts', () => {
    const result = parseUrl('https://user:secret@example.com:8443/docs/tools?tag=json&tag=seo#top');

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.output.protocol).toBe('https:');
    expect(result.output.host).toBe('example.com:8443');
    expect(result.output.pathname).toBe('/docs/tools');
    expect(result.output.pathSegments).toEqual(['docs', 'tools']);
    expect(result.output.passwordPresent).toBe(true);
    expect(result.output.query).toEqual([{ key: 'tag', values: ['json', 'seo'] }]);
    expect(result.output.hash).toBe('#top');
  });

  it('accepts domain-like and root-relative inputs', () => {
    const domain = parseUrl('example.com/path?q=1');
    const relative = parseUrl('/tools/json-formatter/?q=1');

    expect(domain.ok && domain.output.href).toBe('https://example.com/path?q=1');
    expect(relative.ok && relative.output.href).toBe('https://example.com/tools/json-formatter/?q=1');
  });

  it('returns a readable error for invalid input', () => {
    expect(parseUrl('not a url')).toEqual({ ok: false, error: 'URL input must be absolute, domain-like, or root-relative' });
  });
});
