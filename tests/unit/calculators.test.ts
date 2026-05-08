import { describe, expect, it } from 'vitest';
import {
  compoundInterest,
  convertNumberBase,
  discountPrice,
  loanPayment,
  percentageChange,
  percentageOf,
} from '@/lib/tools/calculators';

describe('calculator pure functions', () => {
  it('calculates percentages of totals', () => {
    expect(percentageOf(25, 200)).toBe(12.5);
    expect(percentageOf(0, 200)).toBe(0);
    expect(percentageOf(-25, 200)).toBe(-12.5);
  });

  it('calculates percentage changes', () => {
    expect(percentageChange(100, 125)).toBe(25);
    expect(percentageChange(100, 75)).toBe(-25);
    expect(percentageChange(-100, -50)).toBe(-50);
  });

  it('calculates discounted prices at boundaries', () => {
    expect(discountPrice(100, 25)).toBe(75);
    expect(discountPrice(100, 0)).toBe(100);
    expect(discountPrice(100, 100)).toBe(0);
    expect(discountPrice(0, 50)).toBe(0);
  });

  it('calculates loan payments with and without interest', () => {
    expect(loanPayment(100_000, 6, 30)).toBeCloseTo(599.55, 2);
    expect(loanPayment(12_000, 0, 1)).toBe(1_000);
    expect(loanPayment(0, 5, 30)).toBe(0);
    expect(loanPayment(10_000, 12, 1, 4)).toBeCloseTo(2_690.27, 2);
  });

  it('calculates compound interest amounts', () => {
    expect(compoundInterest(1_000, 5, 10, 1)).toBeCloseTo(1_628.894626777442);
    expect(compoundInterest(1_000, 5, 10, 12)).toBeCloseTo(1_647.00949769028);
    expect(compoundInterest(1_000, 0, 10)).toBe(1_000);
    expect(compoundInterest(1_000, 5, 0)).toBe(1_000);
    expect(compoundInterest(1_000, -12, 1, 12)).toBeCloseTo(886.3848717161291);
  });

  it('converts numbers between bases', () => {
    expect(convertNumberBase('1010', 2, 10)).toBe('10');
    expect(convertNumberBase('255', 10, 16)).toBe('FF');
    expect(convertNumberBase('ff', 16, 2)).toBe('11111111');
    expect(convertNumberBase('0', 10, 36)).toBe('0');
    expect(convertNumberBase('-1010', 2, 10)).toBe('-10');
    expect(convertNumberBase('ZZZZZZZZZZ', 36, 10)).toBe('3656158440062975');
  });

  it('rejects invalid percentage inputs', () => {
    expect(() => percentageOf(Number.NaN, 100)).toThrow(RangeError);
    expect(() => percentageOf(1, 0)).toThrow(RangeError);
    expect(() => percentageChange(0, 1)).toThrow(RangeError);
    expect(() => percentageChange(1, Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });

  it('rejects invalid financial inputs', () => {
    expect(() => discountPrice(-1, 10)).toThrow(RangeError);
    expect(() => discountPrice(100, -1)).toThrow(RangeError);
    expect(() => discountPrice(100, 101)).toThrow(RangeError);
    expect(() => loanPayment(-1, 5, 30)).toThrow(RangeError);
    expect(() => loanPayment(1, -1, 30)).toThrow(RangeError);
    expect(() => loanPayment(1, 5, 0)).toThrow(RangeError);
    expect(() => loanPayment(1, 5, 1, 0)).toThrow(RangeError);
    expect(() => loanPayment(1, 5, 0.5, 5)).toThrow(RangeError);
    expect(() => compoundInterest(-1, 5, 1)).toThrow(RangeError);
    expect(() => compoundInterest(1, Number.NaN, 1)).toThrow(RangeError);
    expect(() => compoundInterest(1, 5, -1)).toThrow(RangeError);
    expect(() => compoundInterest(1, 5, 1, 0)).toThrow(RangeError);
    expect(() => compoundInterest(1, -1_300, 1, 12)).toThrow(RangeError);
  });

  it('rejects invalid base conversion inputs', () => {
    expect(() => convertNumberBase('', 10, 2)).toThrow(RangeError);
    expect(() => convertNumberBase('-', 10, 2)).toThrow(RangeError);
    expect(() => convertNumberBase('2', 2, 10)).toThrow(RangeError);
    expect(() => convertNumberBase('10', 1, 10)).toThrow(RangeError);
    expect(() => convertNumberBase('10', 10, 37)).toThrow(RangeError);
    expect(() => convertNumberBase('10', 10.5, 2)).toThrow(RangeError);
    expect(() => convertNumberBase('1_0', 10, 2)).toThrow(RangeError);
  });
});
