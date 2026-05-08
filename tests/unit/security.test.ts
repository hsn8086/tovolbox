import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const headersPath = fileURLToPath(new URL('../../public/_headers', import.meta.url));
const packageJsonPath = fileURLToPath(new URL('../../package.json', import.meta.url));
const securityDocPath = fileURLToPath(new URL('../../docs/security.md', import.meta.url));

describe('security and privacy configuration', () => {
  it('sets defensive Cloudflare Pages headers', () => {
    const headers = readFileSync(headersPath, 'utf8');

    expect(headers).toContain("Content-Security-Policy: default-src 'self'");
    expect(headers).toContain("connect-src 'self'");
    expect(headers).toContain("object-src 'none'");
    expect(headers).toContain("frame-ancestors 'none'");
    expect(headers).toContain('X-Content-Type-Options: nosniff');
    expect(headers).toContain('X-Frame-Options: DENY');
    expect(headers).toContain('Permissions-Policy: camera=(), microphone=(), geolocation=()');
  });

  it('records the targeted yaml audit override and handling strategy', () => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { overrides?: Record<string, Record<string, string> | string> };
    const securityDoc = readFileSync(securityDocPath, 'utf8');

    const yamlLanguageServerOverride = packageJson.overrides?.['yaml-language-server'];
    expect(typeof yamlLanguageServerOverride === 'object' ? yamlLanguageServerOverride.yaml : undefined).toBe('2.8.3');
    expect(packageJson.overrides?.['fast-uri']).toBe('3.1.2');
    expect(securityDoc).toContain('Do not run `npm audit fix --force`');
    expect(securityDoc).toContain('Confirm `npm audit` reports 0 vulnerabilities');
  });
});
