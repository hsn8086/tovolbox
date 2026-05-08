import { describe, expect, it } from 'vitest';
import { filterSearchItems, type SearchItem } from '@/lib/search/filter';

const items: SearchItem[] = [
  {
    slug: 'base64',
    title: 'Base64 Encode and Decode',
    description: 'Encode plain text or decode readable Base64 strings.',
    keywords: ['codec', 'binary'],
    tags: ['encode', 'decode'],
  },
  {
    slug: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Format messy JSON into readable indented output.',
    keywords: ['json', 'validator'],
    tags: ['formatter'],
  },
  {
    slug: 'url-codec',
    title: 'URL Encoder',
    description: 'Encode links and decode percent encoded strings.',
    keywords: ['url', 'codec'],
    tags: ['web'],
  },
];

describe('filterSearchItems', () => {
  it('sorts more relevant title matches before weaker field matches', () => {
    const results = filterSearchItems(items, 'json');

    expect(results.map((item) => item.slug)).toEqual(['json-formatter']);
  });

  it('matches queries without case sensitivity', () => {
    const results = filterSearchItems(items, 'bAsE64');

    expect(results.map((item) => item.slug)).toEqual(['base64']);
  });

  it('matches keywords and tags', () => {
    expect(filterSearchItems(items, 'validator').map((item) => item.slug)).toEqual(['json-formatter']);
    expect(filterSearchItems(items, 'web').map((item) => item.slug)).toEqual(['url-codec']);
  });

  it('returns all items for an empty query in original order', () => {
    expect(filterSearchItems(items, '  ').map((item) => item.slug)).toEqual(['base64', 'json-formatter', 'url-codec']);
  });
});
