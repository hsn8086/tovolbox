import { describe, expect, it } from 'vitest';
import { applyImageAdjustment, applySaturationChannel, cropRatioToNumber, getDefaultImageSettings, imageOutputExtension, normalizeCropOffset, normalizeImageMode, normalizeImageQuality, outputFormatLabel } from '@/islands/tools/ImageCanvasTool';

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

  it('uses custom image settings for pixel adjustments', () => {
    expect(applyImageAdjustment(100, 'brightness', { brightness: -40 })).toBe(60);
    expect(applyImageAdjustment(100, 'contrast', { contrast: 2 })).toBe(72);
    expect(applySaturationChannel(150, 100, 0)).toBe(100);
    expect(applySaturationChannel(150, 100, 2)).toBe(200);
  });

  it('maps crop ratios and returns independent default settings', () => {
    expect(cropRatioToNumber('16:9')).toBeCloseTo(16 / 9);
    expect(cropRatioToNumber('4:5')).toBeCloseTo(4 / 5);
    expect(cropRatioToNumber('9:16')).toBeCloseTo(9 / 16);
    expect(cropRatioToNumber('1:1')).toBe(1);
    expect(cropRatioToNumber('custom', 3, 2)).toBe(1.5);

    const first = getDefaultImageSettings();
    const second = getDefaultImageSettings();
    first.watermarkText = 'Changed';
    expect(second.watermarkText).toBe('TovolBox');
  });

  it('labels output formats and normalizes quality settings', () => {
    expect(outputFormatLabel('image/png')).toBe('PNG');
    expect(outputFormatLabel('image/jpeg')).toBe('JPEG');
    expect(outputFormatLabel('image/webp')).toBe('WebP');
    expect(imageOutputExtension('image/png')).toBe('png');
    expect(imageOutputExtension('image/jpeg')).toBe('jpg');
    expect(imageOutputExtension('image/webp')).toBe('webp');
    expect(normalizeImageQuality(2)).toBe(1);
    expect(normalizeImageQuality(0)).toBe(0.1);
    expect(normalizeImageQuality(Number.NaN)).toBe(getDefaultImageSettings().outputQuality);
  });

  it('normalizes crop offsets', () => {
    expect(normalizeCropOffset(120)).toBe(100);
    expect(normalizeCropOffset(-120)).toBe(-100);
    expect(normalizeCropOffset(12.4)).toBe(12);
    expect(normalizeCropOffset(Number.NaN)).toBe(0);
  });
});
