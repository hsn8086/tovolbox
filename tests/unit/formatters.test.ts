import { describe, expect, it } from 'vitest';
import { formatCss, formatHtml, formatXml } from '@/lib/tools/formatters';

describe('markup and CSS formatters', () => {
  it('formats XML-style markup', () => {
    expect(formatXml('<root><item id="1">Hello</item><item id="2" /></root>').output).toBe(
      ['<root>', '  <item id="1">', '    Hello', '  </item>', '  <item id="2" />', '</root>'].join('\n'),
    );
  });

  it('formats HTML while keeping void tags self-contained', () => {
    expect(formatHtml('<article><h1>Hello</h1><p>World<br></p></article>').output).toBe(
      ['<article>', '  <h1>', '    Hello', '  </h1>', '  <p>', '    World', '    <br>', '  </p>', '</article>'].join('\n'),
    );
  });

  it('formats CSS rules and declarations', () => {
    expect(formatCss('body{color:#111;margin:0}.card{padding:1rem;}').output).toBe(
      ['body {', '  color:#111;', '  margin:0', '}', '.card {', '  padding:1rem;', '}'].join('\n'),
    );
  });
});
