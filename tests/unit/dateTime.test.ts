import { describe, expect, it } from 'vitest';
import { dateDifference, isoToUnix, unixToIso } from '@/lib/tools/dateTime';

describe('date time pure functions', () => {
  it('converts Unix seconds to ISO strings', () => {
    expect(unixToIso(1_700_000_000)).toBe('2023-11-14T22:13:20.000Z');
    expect(unixToIso('1700000000')).toBe('2023-11-14T22:13:20.000Z');
  });

  it('converts Unix milliseconds to ISO strings', () => {
    expect(unixToIso(1_700_000_000_123)).toBe('2023-11-14T22:13:20.123Z');
    expect(unixToIso('1700000000123')).toBe('2023-11-14T22:13:20.123Z');
  });

  it('converts ISO strings to Unix seconds', () => {
    expect(isoToUnix('2023-11-14T22:13:20.123Z')).toBe(1_700_000_000);
  });

  it('calculates date differences from start to end', () => {
    expect(dateDifference('2024-01-01T00:00:00.000Z', '2024-01-03T12:30:15.500Z')).toEqual({
      milliseconds: 217_815_500,
      seconds: 217_815.5,
      minutes: 3_630.258333333333,
      hours: 60.504305555555554,
      days: 2.5210127314814814,
    });
  });

  it('keeps negative differences when end is before start', () => {
    expect(dateDifference('2024-01-02T00:00:00.000Z', '2024-01-01T00:00:00.000Z')).toMatchObject({
      milliseconds: -86_400_000,
      seconds: -86_400,
      days: -1,
    });
  });

  it('throws controlled errors for invalid inputs', () => {
    expect(() => unixToIso('not-a-number')).toThrow(TypeError);
    expect(() => isoToUnix('not-a-date')).toThrow(TypeError);
    expect(() => dateDifference('not-a-date', '2024-01-01T00:00:00.000Z')).toThrow(TypeError);
    expect(() => dateDifference('2024-01-01T00:00:00.000Z', 'not-a-date')).toThrow(TypeError);
  });
});
