import { describe, expect, it } from 'vitest';
import {
  aspectRatio,
  calculateCropRect,
  calculateResizeDimensions,
  estimateCompressedSize,
  formatBytes,
  imageMimeToExtension,
  normalizeRotation,
} from '@/lib/tools/image';

describe('image pure functions', () => {
  it('keeps existing aspect ratio and byte formatting behavior', () => {
    expect(aspectRatio(1920, 1080)).toBe('16:9');
    expect(aspectRatio(0, 1080)).toBe('unknown');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(2 * 1024 * 1024)).toBe('2.00 MB');
  });

  it('calculates contained, covered, and stretched resize dimensions', () => {
    expect(calculateResizeDimensions(4000, 3000, 1000, 1000)).toEqual({ width: 1000, height: 750 });
    expect(calculateResizeDimensions(4000, 3000, 1000, 1000, 'cover')).toEqual({ width: 1333, height: 1000 });
    expect(calculateResizeDimensions(4000, 3000, 1000, 1000, 'stretch')).toEqual({ width: 1000, height: 1000 });
    expect(calculateResizeDimensions(300, 200, 75.5, 50.5)).toEqual({ width: 76, height: 50 });
  });

  it('rejects invalid resize dimensions', () => {
    expect(() => calculateResizeDimensions(0, 100, 50, 50)).toThrow(RangeError);
    expect(() => calculateResizeDimensions(100, Number.NaN, 50, 50)).toThrow(RangeError);
    expect(() => calculateResizeDimensions(100, 100, Number.POSITIVE_INFINITY, 50)).toThrow(RangeError);
  });

  it('calculates centered crop rectangles for target aspect ratios', () => {
    expect(calculateCropRect(4000, 3000, 1)).toEqual({ x: 500, y: 0, width: 3000, height: 3000 });
    expect(calculateCropRect(3000, 4000, 1)).toEqual({ x: 0, y: 500, width: 3000, height: 3000 });
    expect(calculateCropRect(1920, 1080, 16 / 9)).toEqual({ x: 0, y: 0, width: 1920, height: 1080 });
  });

  it('rejects invalid crop input', () => {
    expect(() => calculateCropRect(-1, 100, 1)).toThrow(RangeError);
    expect(() => calculateCropRect(100, 100, 0)).toThrow(RangeError);
    expect(() => calculateCropRect(100, 100, Number.NaN)).toThrow(RangeError);
  });

  it('normalizes rotation degrees into a positive 0 to 359 range', () => {
    expect(normalizeRotation(0)).toBe(0);
    expect(normalizeRotation(360)).toBe(0);
    expect(normalizeRotation(450)).toBe(90);
    expect(normalizeRotation(-90)).toBe(270);
    expect(normalizeRotation(-720)).toBe(0);
    expect(() => normalizeRotation(Number.NaN)).toThrow(RangeError);
  });

  it('maps common image MIME types to file extensions', () => {
    expect(imageMimeToExtension('image/jpeg')).toBe('jpg');
    expect(imageMimeToExtension(' IMAGE/PNG ')).toBe('png');
    expect(imageMimeToExtension('image/webp')).toBe('webp');
    expect(imageMimeToExtension('image/gif')).toBe('gif');
    expect(imageMimeToExtension('image/svg+xml')).toBe('svg');
    expect(imageMimeToExtension('image/avif')).toBe('avif');
    expect(imageMimeToExtension('application/octet-stream')).toBe('bin');
  });

  it('estimates compressed output sizes by quality and MIME type', () => {
    expect(estimateCompressedSize(1_000, 1, 'image/jpeg')).toBe(700);
    expect(estimateCompressedSize(1_000, 0.5, 'image/webp')).toBe(300);
    expect(estimateCompressedSize(1_000, 0, 'image/avif')).toBe(70);
    expect(estimateCompressedSize(0, 0.8, 'image/png')).toBe(0);
    expect(() => estimateCompressedSize(-1, 0.8, 'image/jpeg')).toThrow(RangeError);
    expect(() => estimateCompressedSize(1_000, 1.1, 'image/jpeg')).toThrow(RangeError);
  });
});
