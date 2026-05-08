import { describe, expect, it } from 'vitest';
import { filterSearchItems, getCategoryFacets, getPopularItems, getRecentItems, getTagFacets, type SearchItem } from '@/lib/search/filter';

const items: SearchItem[] = [
  {
    slug: 'base64',
    title: 'Base64 Encode and Decode',
    description: 'Encode plain text or decode readable Base64 strings.',
    categorySlug: 'encoding-decoding-tools',
    categoryTitle: 'Encoding and Decoding Tools',
    keywords: ['codec', 'binary'],
    tags: ['encode', 'decode'],
    popularity: 30,
  },
  {
    slug: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Format messy JSON into readable indented output.',
    categorySlug: 'json-data-tools',
    categoryTitle: 'JSON and Data Tools',
    keywords: ['json', 'validator'],
    tags: ['formatter'],
    popularity: 100,
  },
  {
    slug: 'url-codec',
    title: 'URL Encoder',
    description: 'Encode links and decode percent encoded strings.',
    categorySlug: 'encoding-decoding-tools',
    categoryTitle: 'Encoding and Decoding Tools',
    keywords: ['url', 'codec'],
    tags: ['web'],
    popularity: 60,
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

  it('filters by category and exact tag', () => {
    expect(filterSearchItems(items, '', { categorySlug: 'encoding-decoding-tools' }).map((item) => item.slug)).toEqual(['base64', 'url-codec']);
    expect(filterSearchItems(items, '', { tag: 'formatter' }).map((item) => item.slug)).toEqual(['json-formatter']);
  });

  it('builds category and tag facets from indexed items', () => {
    expect(getCategoryFacets(items)).toEqual([
      { slug: 'encoding-decoding-tools', title: 'Encoding and Decoding Tools', count: 2 },
      { slug: 'json-data-tools', title: 'JSON and Data Tools', count: 1 },
    ]);
    expect(getTagFacets(items, 2)).toEqual([
      { tag: 'decode', count: 1 },
      { tag: 'encode', count: 1 },
    ]);
  });

  it('returns popular and recent tool suggestions', () => {
    expect(getPopularItems(items, 2).map((item) => item.slug)).toEqual(['json-formatter', 'url-codec']);
    expect(getRecentItems(items, 2).map((item) => item.slug)).toEqual(['url-codec', 'json-formatter']);
  });
});
