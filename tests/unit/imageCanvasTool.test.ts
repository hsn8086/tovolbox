import { describe, expect, it } from 'vitest';
import { applyImageAdjustment, normalizeImageMode } from '@/islands/tools/ImageCanvasTool';

describe('image canvas tool helpers', () => {
  it('normalizes component names into canvas modes', () => {
    expect(normalizeImageMode('image-resize-calculator')).toBe('resizer');
    expect(normalizeImageMode('image-crop')).toBe('crop');
    expect(normalizeImageMode('image-grayscale')).toBe('grayscale');
    expect(normalizeImageMode('image-rotate')).toBe('rotate');
    expect(normalizeImageMode('image-flip')).toBe('flip');
    expect(normalizeImageMode('image-brightness')).toBe('brightness');
    expect(normalizeImageMode('image-contrast')).toBe('contrast');
    expect(normalizeImageMode('image-saturation')).toBe('saturation');
    expect(normalizeImageMode('image-watermark')).toBe('watermark');
    expect(normalizeImageMode('image-metadata')).toBe('inspect');
  });

  it('applies and clamps brightness and contrast adjustments', () => {
    expect(applyImageAdjustment(100, 'brightness')).toBe(132);
    expect(applyImageAdjustment(250, 'brightness')).toBe(255);
    expect(applyImageAdjustment(100, 'contrast')).toBe(92);
    expect(applyImageAdjustment(300, 'contrast')).toBe(255);
    expect(applyImageAdjustment(-20, 'inspect')).toBe(0);
  });
});
