import { describe, expect, it } from 'vitest';
import { contrastRatio, hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from '@/lib/tools/color';

describe('color pure functions', () => {
  it('converts short and long hex colors to RGB', () => {
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('000000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('#1a2b3c')).toEqual({ r: 26, g: 43, b: 60 });
  });

  it('converts RGB boundary values to hex', () => {
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');
    expect(rgbToHex({ r: 1, g: 16, b: 255 })).toBe('#0110ff');
  });

  it('converts RGB colors to HSL', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 });
    expect(rgbToHsl({ r: 0, g: 255, b: 0 })).toEqual({ h: 120, s: 100, l: 50 });
    expect(rgbToHsl({ r: 0, g: 0, b: 255 })).toEqual({ h: 240, s: 100, l: 50 });
    expect(rgbToHsl({ r: 128, g: 128, b: 128 })).toEqual({ h: 0, s: 0, l: 50.2 });
  });

  it('converts HSL colors to RGB', () => {
    expect(hslToRgb({ h: 0, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0 });
    expect(hslToRgb({ h: 120, s: 100, l: 50 })).toEqual({ r: 0, g: 255, b: 0 });
    expect(hslToRgb({ h: 240, s: 100, l: 50 })).toEqual({ r: 0, g: 0, b: 255 });
    expect(hslToRgb({ h: 360, s: 0, l: 100 })).toEqual({ r: 255, g: 255, b: 255 });
    expect(hslToRgb({ h: -120, s: 100, l: 50 })).toEqual({ r: 0, g: 0, b: 255 });
  });

  it('calculates contrast ratios', () => {
    expect(contrastRatio('#000', '#fff')).toBe(21);
    expect(contrastRatio({ r: 255, g: 255, b: 255 }, { r: 255, g: 255, b: 255 })).toBe(1);
  });

  it('throws controlled errors for invalid input', () => {
    expect(() => hexToRgb('#ffff')).toThrow('Invalid hex color');
    expect(() => rgbToHex({ r: -1, g: 0, b: 0 })).toThrow(RangeError);
    expect(() => rgbToHsl({ r: 0.5, g: 0, b: 0 })).toThrow(RangeError);
    expect(() => hslToRgb({ h: 0, s: 101, l: 50 })).toThrow(RangeError);
    expect(() => contrastRatio('#000', { r: 0, g: 0, b: 256 })).toThrow(RangeError);
  });
});
