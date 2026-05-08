import { useMemo, useState } from 'react';
import { buildUtmUrl, titleAdvice } from '@/lib/tools/seo';
import { analyzeMetaDescription, buildOpenGraphTags, buildSerpPreview, buildTwitterCardTags } from '@/lib/tools/seoPreview';
import { generateBreadcrumbSchema, generateCanonicalTag, generateFaqSchema, generateHreflangTags, generateRobotsTxt } from '@/lib/tools/schemaGenerators';
import { CopyActions, OutputBox, ToolPanel } from './shared';

const modes = ['meta-title-checker', 'meta-description-checker', 'serp-preview', 'open-graph-preview', 'twitter-card-preview', 'canonical-tag-generator', 'hreflang-tag-generator', 'robots-txt-generator', 'faq-schema-generator', 'breadcrumb-schema-generator', 'utm-builder'] as const;
export function getSeoMode(component: string): string { return modes.includes(component as never) ? component : 'generic'; }

export default function SeoTool({ component, title }: { component: string; title: string }) {
  const mode = getSeoMode(component);
  const [input, setInput] = useState('https://tovolbox.hsn8086.com/tools/json-formatter/');
  const output = useMemo(() => {
    try {
      if (mode === 'meta-title-checker') return JSON.stringify(titleAdvice(input), null, 2);
      if (mode === 'meta-description-checker') return JSON.stringify(analyzeMetaDescription(input), null, 2);
      if (mode === 'serp-preview') return JSON.stringify(buildSerpPreview({ title: 'TovolBox tools', url: input, description: 'Fast private browser tools for developers, SEO, images, and everyday work.' }), null, 2);
      if (mode === 'open-graph-preview') return buildOpenGraphTags({ title: 'TovolBox', description: 'Private browser tools', url: input });
      if (mode === 'twitter-card-preview') return buildTwitterCardTags({ title: 'TovolBox', description: input });
      if (mode === 'canonical-tag-generator') return generateCanonicalTag(input);
      if (mode === 'hreflang-tag-generator') return generateHreflangTags([{ hreflang: 'en', href: input }, { hreflang: 'zh-CN', href: 'https://tovolbox.hsn8086.com/zh-CN/' }]);
      if (mode === 'robots-txt-generator') return generateRobotsTxt({ allow: ['/'], disallow: ['/private/'], sitemap: input });
      if (mode === 'faq-schema-generator') return JSON.stringify(generateFaqSchema([{ question: 'Is it free?', answer: 'Yes.' }]), null, 2);
      if (mode === 'breadcrumb-schema-generator') return JSON.stringify(generateBreadcrumbSchema([{ name: 'Home', url: 'https://tovolbox.hsn8086.com/' }, { name: 'Tools', url: input }]), null, 2);
      if (mode === 'utm-builder') return buildUtmUrl({ url: input, source: 'newsletter', medium: 'email', campaign: 'launch' });
      return input;
    } catch (error) { return error instanceof Error ? error.message : 'Unable to generate SEO output.'; }
  }, [input, mode]);
  return <ToolPanel title={title}><label style={{ display: 'block', marginBottom: '.75rem' }}>Input<input className="input ltr-only" value={input} onChange={(event) => setInput(event.target.value)} /></label><OutputBox value={output} /><CopyActions output={output} onClear={() => setInput('')} /></ToolPanel>;
}
