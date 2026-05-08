import { describe, expect, it } from 'vitest';
import { formatSvg, minifySvg, sanitizeSvgForPreview, svgToDataUri, svgToJsx } from '@/lib/tools/svg';

describe('SVG pure functions', () => {
  const unsafeSvg = [
    '<svg viewBox="0 0 10 10" onclick="alert(1)">',
    '  <script>alert("xss")</script>',
    '  <a href="javascript:alert(2)" xlink:href="java&#x73;cript:alert(3)">',
    '    <circle cx="5" cy="5" r="4" onmouseover="alert(4)" />',
    '  </a>',
    '</svg>',
  ].join('\n');

  it('removes scripts, event handlers, and javascript hrefs', () => {
    const result = sanitizeSvgForPreview(unsafeSvg);

    expect(result).not.toMatch(/<script/i);
    expect(result).not.toMatch(/on(?:click|mouseover)=/i);
    expect(result).not.toMatch(/javascript:/i);
    expect(result).not.toMatch(/xlink:href=/i);
    expect(result).toContain('<circle cx="5" cy="5" r="4" />');
  });

  it('keeps safe href values while sanitizing', () => {
    const result = sanitizeSvgForPreview('<svg><a href="#icon" xlink:href="https://example.com/icon.svg"><use href="#icon" /></a></svg>');

    expect(result).toContain('href="#icon"');
    expect(result).toContain('xlink:href="https://example.com/icon.svg"');
  });

  it('minifies sanitized SVG', () => {
    expect(minifySvg(' <svg>\n  <!-- comment -->\n  <path d="M0 0" />\n</svg> ')).toBe('<svg><path d="M0 0"/></svg>');
    expect(minifySvg(unsafeSvg)).not.toMatch(/script|onclick|javascript:/i);
  });

  it('formats sanitized SVG with indentation', () => {
    expect(formatSvg('<svg><g><path d="M0 0" /></g></svg>')).toBe(['<svg>', '  <g>', '    <path d="M0 0"/>', '  </g>', '</svg>'].join('\n'));
  });

  it('converts sanitized SVG to a data URI', () => {
    const result = svgToDataUri(unsafeSvg);

    expect(result.startsWith('data:image/svg+xml,')).toBe(true);
    expect(decodeURIComponent(result.replace('data:image/svg+xml,', '').replace(/'/g, '%22'))).not.toMatch(/script|onclick|javascript:/i);
  });

  it('converts sanitized SVG attributes to JSX names', () => {
    const result = svgToJsx('<svg viewBox="0 0 10 10" class="icon"><path fill-rule="evenodd" stroke-width="2" onclick="bad()" /></svg>');

    expect(result).toContain('viewBox="0 0 10 10"');
    expect(result).toContain('className="icon"');
    expect(result).toContain('fillRule="evenodd"');
    expect(result).toContain('strokeWidth="2"');
    expect(result).not.toContain('onclick');
  });
});
