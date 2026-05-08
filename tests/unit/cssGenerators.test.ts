import { describe, expect, it } from 'vitest';
import { generateBorderRadius, generateBoxShadow, generateClamp, generateLinearGradient } from '@/lib/tools/cssGenerators';

describe('CSS generator pure functions', () => {
  it('generates clamp expressions from pixel and viewport bounds', () => {
    expect(generateClamp(16, 32, 320, 1280)).toBe('clamp(16px, calc(1.6667vw + 10.6667px), 32px)');
    expect(generateClamp(20, 20, 320, 1280)).toBe('clamp(20px, calc(0vw + 20px), 20px)');
  });

  it('rejects invalid clamp input', () => {
    expect(() => generateClamp(Number.NaN, 32, 320, 1280)).toThrow(RangeError);
    expect(() => generateClamp(32, 16, 320, 1280)).toThrow(RangeError);
    expect(() => generateClamp(16, 32, 1280, 320)).toThrow(RangeError);
    expect(() => generateClamp(16, 32, 0, 1280)).toThrow(RangeError);
  });

  it('generates box-shadow values', () => {
    expect(generateBoxShadow({ offsetX: 0, offsetY: 4, blurRadius: 12, spreadRadius: -2, color: 'rgba(0, 0, 0, 0.2)' })).toBe(
      '0px 4px 12px -2px rgba(0, 0, 0, 0.2)',
    );
    expect(generateBoxShadow({ offsetX: 1.5, offsetY: 2, color: '#000', inset: true })).toBe('inset 1.5px 2px 0px 0px #000');
  });

  it('rejects invalid box-shadow input', () => {
    expect(() => generateBoxShadow({ offsetX: Number.POSITIVE_INFINITY, offsetY: 2, color: '#000' })).toThrow(RangeError);
    expect(() => generateBoxShadow({ offsetX: 0, offsetY: 2, blurRadius: -1, color: '#000' })).toThrow(RangeError);
    expect(() => generateBoxShadow({ offsetX: 0, offsetY: 2, color: '  ' })).toThrow('color must not be empty');
  });

  it('generates border-radius values', () => {
    expect(generateBorderRadius(8)).toBe('8px');
    expect(generateBorderRadius([4, 8])).toBe('4px 8px');
    expect(generateBorderRadius([4, 8, 12, 16])).toBe('4px 8px 12px 16px');
  });

  it('rejects invalid border-radius input', () => {
    expect(() => generateBorderRadius(-1)).toThrow(RangeError);
    expect(() => generateBorderRadius([4, Number.NaN])).toThrow(RangeError);
    expect(() => generateBorderRadius([] as unknown as [number])).toThrow(RangeError);
    expect(() => generateBorderRadius([1, 2, 3, 4, 5] as unknown as [number])).toThrow(RangeError);
  });

  it('generates linear-gradient values', () => {
    expect(
      generateLinearGradient({
        direction: 'to right',
        stops: [
          { color: '#000', position: 0 },
          { color: '#fff', position: '100%' },
        ],
      }),
    ).toBe('linear-gradient(to right, #000 0%, #fff 100%)');
    expect(generateLinearGradient({ stops: [{ color: 'red' }, { color: 'blue' }] })).toBe('linear-gradient(to bottom, red, blue)');
  });

  it('rejects invalid linear-gradient input', () => {
    expect(() => generateLinearGradient({ stops: [{ color: '#000' }] })).toThrow(RangeError);
    expect(() => generateLinearGradient({ stops: [{ color: '#000' }, { color: ' ' }] })).toThrow('color must not be empty');
    expect(() => generateLinearGradient({ stops: [{ color: '#000' }, { color: '#fff', position: Number.NaN }] })).toThrow(RangeError);
    expect(() => generateLinearGradient({ stops: [{ color: '#000' }, { color: '#fff', position: ' ' }] })).toThrow('position must not be empty');
  });
});
