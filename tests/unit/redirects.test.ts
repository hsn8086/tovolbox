import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const redirectsPath = fileURLToPath(new URL('../../public/_redirects', import.meta.url));

function redirectLines(): string[] {
  return readFileSync(redirectsPath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

describe('Cloudflare Pages redirects', () => {
  it('keeps favicon compatibility and English prefix redirects', () => {
    expect(redirectLines()).toEqual(['/favicon.ico /favicon.svg 200', '/en /', '/en/ /', '/en/* /:splat']);
  });

  it('uses one catch-all English redirect instead of fragile per-page rules', () => {
    const lines = redirectLines();
    expect(lines).toContain('/en/* /:splat');
    expect(lines.some((line) => line.startsWith('/en/tools/:slug'))).toBe(false);
    expect(lines.some((line) => line.startsWith('/en/categories/:slug'))).toBe(false);
  });
});
