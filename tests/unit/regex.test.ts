import { describe, expect, it } from 'vitest';
import { extractRegexMatches, testRegex } from '@/lib/tools/regex';

describe('regex pure functions', () => {
  it('extracts all matches with positions', () => {
    expect(extractRegexMatches('\\w+', '', 'one two')).toEqual([
      { value: 'one', index: 0, groups: [], namedGroups: {} },
      { value: 'two', index: 4, groups: [], namedGroups: {} },
    ]);
  });

  it('returns capture groups and named groups', () => {
    const result = testRegex('(?<key>\\w+)=(\\d+)', '', 'a=1 b=22');

    expect(result.error).toBeUndefined();
    expect(result.matches).toEqual([
      { value: 'a=1', index: 0, groups: ['a', '1'], namedGroups: { key: 'a' } },
      { value: 'b=22', index: 4, groups: ['b', '22'], namedGroups: { key: 'b' } },
    ]);
    expect(result.groups).toEqual([
      ['a', '1'],
      ['b', '22'],
    ]);
  });

  it('honors supplied flags', () => {
    expect(testRegex('hello', 'i', 'Hello HELLO').matches.map((match) => match.value)).toEqual(['Hello', 'HELLO']);
  });

  it('handles zero-length matches without looping forever', () => {
    expect(testRegex('(?=a)', '', 'aa').matches).toEqual([
      { value: '', index: 0, groups: [], namedGroups: {} },
      { value: '', index: 1, groups: [], namedGroups: {} },
    ]);
  });

  it('returns an error for invalid patterns', () => {
    const result = testRegex('[', '', 'input');

    expect(result.matches).toEqual([]);
    expect(result.groups).toEqual([]);
    expect(result.error).toContain('Invalid regular expression');
  });

  it('returns an error for invalid flags', () => {
    const result = testRegex('test', 'gg', 'test');

    expect(result.matches).toEqual([]);
    expect(result.groups).toEqual([]);
    expect(result.error).toContain('Invalid flags');
  });
});
