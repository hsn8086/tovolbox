import { describe, expect, it } from 'vitest';
import { generateUlid, generateUuidV4, isUlid, isUuidV4 } from '@/lib/tools/ids';

describe('ID pure functions', () => {
  it('generates and validates UUID v4 values', () => {
    const value = generateUuidV4();

    expect(value).toHaveLength(36);
    expect(value[14]).toBe('4');
    expect(['8', '9', 'a', 'b']).toContain(value[19]);
    expect(isUuidV4(value)).toBe(true);
  });

  it('rejects invalid UUID v4 values', () => {
    expect(isUuidV4('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    expect(isUuidV4('550e8400-e29b-11d4-a716-446655440000')).toBe(false);
    expect(isUuidV4('550E8400-E29B-41D4-A716-446655440000')).toBe(true);
    expect(isUuidV4('not-a-uuid')).toBe(false);
  });

  it('generates and validates ULID values', () => {
    const value = generateUlid(1_700_000_000_000);

    expect(value).toHaveLength(26);
    expect(value.slice(0, 10)).toBe('01HF7YAT00');
    expect(isUlid(value)).toBe(true);
  });

  it('rejects invalid ULID values', () => {
    expect(isUlid('01HF7YAT000000000000000000')).toBe(true);
    expect(isUlid('01HF7YAT00000000000000000I')).toBe(false);
    expect(isUlid('81HF7YAT000000000000000000')).toBe(false);
    expect(isUlid('01hf7yat000000000000000000')).toBe(false);
    expect(isUlid('too-short')).toBe(false);
  });

  it('keeps ULID lexical order for increasing timestamps', () => {
    const earlier = generateUlid(1_700_000_000_000);
    const later = generateUlid(1_700_000_000_001);

    expect(earlier < later).toBe(true);
  });

  it('rejects timestamps outside the ULID time range', () => {
    expect(() => generateUlid(-1)).toThrow(RangeError);
    expect(() => generateUlid(2 ** 48)).toThrow(RangeError);
    expect(() => generateUlid(Number.NaN)).toThrow(RangeError);
  });
});
