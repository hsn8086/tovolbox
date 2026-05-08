import { describe, expect, it } from 'vitest';
import { convertDataSize, convertLength, convertTemperature, convertWeight } from '@/lib/tools/units';

describe('unit conversion pure functions', () => {
  it('converts metric and imperial length units', () => {
    expect(convertLength(1, 'km', 'm')).toBe(1_000);
    expect(convertLength(12, 'in', 'ft')).toBeCloseTo(1);
    expect(convertLength(1, 'mi', 'km')).toBeCloseTo(1.609344);
    expect(convertLength(0, 'cm', 'm')).toBe(0);
  });

  it('converts metric and imperial weight units', () => {
    expect(convertWeight(1, 'kg', 'g')).toBe(1_000);
    expect(convertWeight(16, 'oz', 'lb')).toBe(1);
    expect(convertWeight(1, 't', 'kg')).toBe(1_000);
    expect(convertWeight(-1, 'kg', 'g')).toBe(-1_000);
  });

  it('converts temperature units across common boundaries', () => {
    expect(convertTemperature(0, 'c', 'f')).toBe(32);
    expect(convertTemperature(32, 'f', 'c')).toBe(0);
    expect(convertTemperature(0, 'k', 'c')).toBe(-273.15);
    expect(convertTemperature(-40, 'c', 'f')).toBe(-40);
    expect(convertTemperature(273.15, 'k', 'f')).toBe(32);
  });

  it('converts decimal and binary data size units', () => {
    expect(convertDataSize(8, 'bit', 'B')).toBe(1);
    expect(convertDataSize(1, 'KB', 'B')).toBe(1_000);
    expect(convertDataSize(1, 'KiB', 'B')).toBe(1_024);
    expect(convertDataSize(1, 'MiB', 'KB')).toBeCloseTo(1_048.576);
    expect(convertDataSize(0, 'GB', 'B')).toBe(0);
  });

  it('rejects non-finite numeric input', () => {
    expect(() => convertLength(Number.NaN, 'm', 'km')).toThrow(RangeError);
    expect(() => convertWeight(Number.POSITIVE_INFINITY, 'g', 'kg')).toThrow(RangeError);
    expect(() => convertTemperature(Number.NEGATIVE_INFINITY, 'c', 'k')).toThrow(RangeError);
    expect(() => convertDataSize(Number.NaN, 'B', 'KB')).toThrow(RangeError);
  });
});
