import { describe, expect, it } from 'vitest';
import { analyzeMetaDescription, buildOpenGraphTags, buildSerpPreview, buildTwitterCardTags } from '@/lib/tools/seoPreview';

describe('SEO preview pure functions', () => {
  it('analyzes meta description length recommendations', () => {
    expect(analyzeMetaDescription('Too short.')).toMatchObject({
      length: 10,
      status: 'short',
      recommendedMin: 120,
      recommendedMax: 160,
    });

    expect(analyzeMetaDescription('A'.repeat(120))).toMatchObject({ length: 120, status: 'good' });
    expect(analyzeMetaDescription('A'.repeat(160))).toMatchObject({ length: 160, status: 'good' });
    expect(analyzeMetaDescription('A'.repeat(161))).toMatchObject({ length: 161, status: 'long' });
  });

  it('builds a normalized SERP preview with description analysis', () => {
    expect(
      buildSerpPreview({
        title: '  Example Title  ',
        url: 'https://example.com/tools/seo-preview/?ref=test',
        description: ` ${'A'.repeat(130)} `,
      }),
    ).toEqual({
      title: 'Example Title',
      url: 'https://example.com/tools/seo-preview/?ref=test',
      displayUrl: 'example.com/tools/seo-preview',
      description: 'A'.repeat(130),
      descriptionAnalysis: {
        length: 130,
        status: 'good',
        message: 'The meta description length is within a common SEO range.',
        recommendedMin: 120,
        recommendedMax: 160,
      },
    });
  });

  it('builds escaped Open Graph meta tags', () => {
    expect(
      buildOpenGraphTags({
        title: `Tom & Jerry <Best "Cat's">`,
        description: 'Use <strong>safe</strong> previews & snippets.',
        url: 'https://example.com/?q=seo&mode="preview"',
        image: 'https://example.com/image?a=1&b=2',
        siteName: `Dev's Toolbox`,
      }),
    ).toBe(
      [
        '<meta property="og:type" content="website">',
        '<meta property="og:title" content="Tom &amp; Jerry &lt;Best &quot;Cat&#39;s&quot;&gt;">',
        '<meta property="og:description" content="Use &lt;strong&gt;safe&lt;/strong&gt; previews &amp; snippets.">',
        '<meta property="og:url" content="https://example.com/?q=seo&amp;mode=&quot;preview&quot;">',
        '<meta property="og:image" content="https://example.com/image?a=1&amp;b=2">',
        '<meta property="og:site_name" content="Dev&#39;s Toolbox">',
      ].join('\n'),
    );
  });

  it('builds escaped Twitter card meta tags', () => {
    expect(
      buildTwitterCardTags({
        title: 'SEO "Preview" & Tags',
        description: `Don't render <script>alert(1)</script>.`,
        image: 'https://example.com/card.png?size=large&v=1',
        site: '@tools_site',
        creator: '@dev_creator',
      }),
    ).toBe(
      [
        '<meta name="twitter:card" content="summary_large_image">',
        '<meta name="twitter:title" content="SEO &quot;Preview&quot; &amp; Tags">',
        '<meta name="twitter:description" content="Don&#39;t render &lt;script&gt;alert(1)&lt;/script&gt;.">',
        '<meta name="twitter:image" content="https://example.com/card.png?size=large&amp;v=1">',
        '<meta name="twitter:site" content="@tools_site">',
        '<meta name="twitter:creator" content="@dev_creator">',
      ].join('\n'),
    );
  });
});
