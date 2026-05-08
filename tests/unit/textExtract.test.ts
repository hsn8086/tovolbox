import { describe, expect, it } from 'vitest';
import {
  deduplicateLines,
  extractEmails,
  extractNumbers,
  extractUrls,
  findAndReplace,
  removeEmptyLines,
  sortLines,
  trimLines,
} from '@/lib/tools/textExtract';

describe('text extract pure functions', () => {
  it('extracts basic email addresses', () => {
    expect(extractEmails('Contact A.User+tag@example.com or support@test.co.uk.')).toEqual([
      'A.User+tag@example.com',
      'support@test.co.uk',
    ]);
  });

  it('extracts basic HTTP and HTTPS URLs', () => {
    expect(extractUrls('Open https://example.com/path?q=1 and http://localhost:3000/test.')).toEqual([
      'https://example.com/path?q=1',
      'http://localhost:3000/test',
    ]);
  });

  it('extracts integer, decimal, and signed numbers', () => {
    expect(extractNumbers('Values: -10, +2.5, 0 and 42px')).toEqual(['-10', '+2.5', '0', '42']);
  });

  it('removes blank and whitespace-only lines', () => {
    expect(removeEmptyLines(['alpha', '', '   ', 'beta'].join('\n'))).toBe(['alpha', 'beta'].join('\n'));
  });

  it('deduplicates repeated lines while preserving first occurrence order', () => {
    expect(deduplicateLines(['one', 'two', 'one', '', '', 'three'].join('\n'))).toBe(['one', 'two', '', 'three'].join('\n'));
  });

  it('sorts lines case-insensitively by default', () => {
    expect(sortLines(['banana', 'Apple', 'cherry', 'apricot'].join('\n'))).toBe(
      ['Apple', 'apricot', 'banana', 'cherry'].join('\n'),
    );
  });

  it('sorts lines descending when requested', () => {
    expect(sortLines(['a', 'C', 'b'].join('\n'), 'desc')).toBe(['C', 'b', 'a'].join('\n'));
  });

  it('trims whitespace around each line without removing empty lines', () => {
    expect(trimLines(['  alpha ', '   ', '\tbeta'].join('\n'))).toBe(['alpha', '', 'beta'].join('\n'));
  });

  it('replaces all matches case-insensitively by default', () => {
    expect(findAndReplace('Hello hello HELLO', 'hello', 'hi')).toBe('hi hi hi');
  });

  it('supports case-sensitive and whole-word replacement', () => {
    expect(findAndReplace('cat catalog Cat cat', 'cat', 'dog', { caseSensitive: true, wholeWord: true })).toBe(
      'dog catalog Cat dog',
    );
  });

  it('returns the original text when the find value is empty', () => {
    expect(findAndReplace('unchanged', '', 'x')).toBe('unchanged');
  });
});
