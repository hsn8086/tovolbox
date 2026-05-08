import { describe, expect, it } from 'vitest';
import { normalizeImageMode } from '@/islands/tools/ImageCanvasTool';
import { selectQuizByComponent } from '@/islands/tools/ReflectionQuizTool';

describe('specialized tool modes', () => {
  it('maps quiz components to quiz ids', () => {
    expect(selectQuizByComponent('quiz-big-five-lite')).toBe('big-five-lite');
    expect(selectQuizByComponent('quiz-communication-style')).toBe('communication-style');
    expect(selectQuizByComponent('quiz-unknown')).toBe('big-five-lite');
  });

  it('normalizes image modes', () => {
    expect(normalizeImageMode('image-resize-calculator')).toBe('resizer');
    expect(normalizeImageMode('image-grayscale')).toBe('grayscale');
    expect(normalizeImageMode('image-rotate')).toBe('rotate');
    expect(normalizeImageMode('image-flip')).toBe('flip');
    expect(normalizeImageMode('image-crop')).toBe('crop');
    expect(normalizeImageMode('image-brightness')).toBe('brightness');
    expect(normalizeImageMode('image-contrast')).toBe('contrast');
    expect(normalizeImageMode('image-saturation')).toBe('saturation');
    expect(normalizeImageMode('image-watermark')).toBe('watermark');
    expect(normalizeImageMode('image-size-checker')).toBe('inspect');
  });
});
