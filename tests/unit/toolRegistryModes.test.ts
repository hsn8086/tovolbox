import { describe, expect, it } from 'vitest';
import { normalizeImageMode } from '@/islands/tools/ImageCanvasTool';
import { selectQuizByComponent } from '@/islands/tools/ReflectionQuizTool';
import { getToolRegistryKind } from '@/islands/tools/ToolRegistry';

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

  it('routes tool components to specialized islands', () => {
    expect(getToolRegistryKind('quiz-big-five-lite')).toBe('quiz');
    expect(getToolRegistryKind('image-brightness')).toBe('image-canvas');
    expect(getToolRegistryKind('json-formatter')).toBe('data');
    expect(getToolRegistryKind('word-counter')).toBe('text');
    expect(getToolRegistryKind('temperature-converter')).toBe('unit');
    expect(getToolRegistryKind('hex-to-rgb')).toBe('color');
    expect(getToolRegistryKind('hash-sha256')).toBe('encode-crypto');
    expect(getToolRegistryKind('robots-txt-generator')).toBe('seo');
    expect(getToolRegistryKind('cron-explainer')).toBe('developer');
    expect(getToolRegistryKind('svg-to-jsx')).toBe('svg');
    expect(getToolRegistryKind('unknown-tool')).toBe('generic');
  });
});
