import { describe, expect, it } from 'vitest';
import { decodeHtmlEntities, encodeHtmlEntities } from '@/lib/tools/htmlEntity';

describe('HTML entity pure functions', () => {
    it('encodes reserved HTML characters', () => {
        expect(encodeHtmlEntities(`Tom & Jerry <tag attr="value">it's</tag>`)).toBe(
            'Tom &amp; Jerry &lt;tag attr=&quot;value&quot;&gt;it&#39;s&lt;/tag&gt;',
        );
    });

    it('decodes reserved and common named entities', () => {
        expect(decodeHtmlEntities('&amp;&lt;&gt;&quot;&apos;')).toBe('&<>"\'');
        expect(decodeHtmlEntities('&copy; &reg; &trade; &euro; &pound; &yen; &cent;')).toBe('© ® ™ € £ ¥ ¢');
        expect(decodeHtmlEntities('&laquo;quote&raquo; &ldquo;text&rdquo; &lsquo;word&rsquo;')).toBe('«quote» “text” ‘word’');
        expect(decodeHtmlEntities('a&nbsp;b &ndash; c&mdash;d')).toBe('a\u00a0b – c—d');
    });

    it('decodes decimal and hexadecimal numeric entities', () => {
        expect(decodeHtmlEntities('A: &#65; hex: &#x41; emoji: &#128512;')).toBe('A: A hex: A emoji: 😀');
        expect(decodeHtmlEntities('upper hex: &#X41;')).toBe('upper hex: &#X41;');
    });

    it('leaves unknown and invalid entities unchanged', () => {
        expect(decodeHtmlEntities('&unknown; &#notNumber; &#99999999; &amp')).toBe('&unknown; &#notNumber; &#99999999; &amp');
    });

    it('round trips encoded special characters', () => {
        const input = `5 > 3 && 2 < 4, "quoted" and 'single'`;

        expect(decodeHtmlEntities(encodeHtmlEntities(input))).toBe(input);
    });
});
