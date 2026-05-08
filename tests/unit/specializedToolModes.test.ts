import { describe, expect, it } from 'vitest';
import { getColorMode } from '@/islands/tools/ColorTool';
import { getDataMode } from '@/islands/tools/DataTool';
import { getDeveloperMode } from '@/islands/tools/DeveloperTool';
import { getEncodeCryptoMode } from '@/islands/tools/EncodeCryptoTool';
import { getSeoMode } from '@/islands/tools/SeoTool';
import { getSvgMode } from '@/islands/tools/SvgTool';
import { getTextMode } from '@/islands/tools/TextTool';
import { getUnitMode } from '@/islands/tools/UnitConverterTool';

describe('specialized tool mode routing', () => {
  it('maps data tools', () => expect(getDataMode('json-formatter')).toBe('json-formatter'));
  it('maps new data tools', () => {
    expect(getDataMode('url-parser')).toBe('url-parser');
    expect(getDataMode('yaml-to-json')).toBe('yaml-to-json');
    expect(getDataMode('json-to-yaml')).toBe('json-to-yaml');
  });
  it('maps text tools', () => expect(getTextMode('extract-emails')).toBe('extract-emails'));
  it('maps new text tools', () => {
    expect(getTextMode('diff-checker')).toBe('diff-checker');
    expect(getTextMode('markdown-previewer')).toBe('markdown-previewer');
  });
  it('maps unit tools', () => expect(getUnitMode('temperature-converter')).toBe('temperature'));
  it('maps color tools', () => expect(getColorMode('contrast-ratio')).toBe('contrast-ratio'));
  it('maps encode and crypto tools', () => expect(getEncodeCryptoMode('hash-sha256')).toBe('hash-sha256'));
  it('maps seo tools', () => expect(getSeoMode('robots-txt-generator')).toBe('robots-txt-generator'));
  it('maps developer tools', () => expect(getDeveloperMode('cron-explainer')).toBe('cron-explainer'));
  it('maps svg tools', () => expect(getSvgMode('svg-to-jsx')).toBe('svg-to-jsx'));
});
