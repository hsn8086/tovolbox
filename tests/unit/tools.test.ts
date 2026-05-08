import { describe, expect, it } from 'vitest';
import { decodeBase64, encodeBase64 } from '@/lib/tools/codec';
import { aspectRatio, formatBytes } from '@/lib/tools/image';
import { formatJson, minifyJson } from '@/lib/tools/json';
import { buildUtmUrl, titleAdvice } from '@/lib/tools/seo';
import { countWords, slugify, toCamelCase } from '@/lib/tools/text';

describe('tool pure functions', () => {
  it('formats and minifies JSON', () => {
    expect(formatJson('{"a":1}').output).toContain('\n  "a"');
    expect(minifyJson('{ "a": 1 }').output).toBe('{"a":1}');
  });

  it('encodes and decodes base64', () => {
    expect(decodeBase64(encodeBase64('hello 世界'))).toBe('hello 世界');
  });

  it('analyzes and transforms text', () => {
    expect(countWords('Hello world.').words).toBe(2);
    expect(toCamelCase('hello world')).toBe('helloWorld');
    expect(slugify('Hello, World!')).toBe('hello-world');
  });

  it('builds UTM URLs and checks titles', () => {
    expect(buildUtmUrl({ url: 'https://example.com', source: 'a', medium: 'b', campaign: 'c' })).toContain('utm_campaign=c');
    expect(titleAdvice('A concise but useful SEO title for testing').status).toBe('good');
  });

  it('calculates image display helpers', () => {
    expect(aspectRatio(1920, 1080)).toBe('16:9');
    expect(formatBytes(1536)).toBe('1.5 KB');
  });
});
