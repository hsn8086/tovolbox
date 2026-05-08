import { useMemo, useState, type ReactNode } from 'react';
import { buildUtmUrl, titleAdvice } from '@/lib/tools/seo';
import { analyzeMetaDescription, buildOpenGraphTags, buildSerpPreview, buildTwitterCardTags } from '@/lib/tools/seoPreview';
import { generateBreadcrumbSchema, generateCanonicalTag, generateFaqSchema, generateHreflangTags, generateRobotsTxt, type BreadcrumbItem, type FaqItem, type HreflangLink } from '@/lib/tools/schemaGenerators';
import { CopyActions, OutputBox, ToolPanel } from './shared';

const modes = ['meta-title-checker', 'meta-description-checker', 'serp-preview', 'open-graph-preview', 'twitter-card-preview', 'canonical-tag-generator', 'hreflang-tag-generator', 'robots-txt-generator', 'faq-schema-generator', 'breadcrumb-schema-generator', 'utm-builder'] as const;
export function getSeoMode(component: string): string { return modes.includes(component as never) ? component : 'generic'; }

type UtmState = {
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
};

type RobotsState = {
  userAgent: string;
  allow: string;
  disallow: string;
  sitemap: string;
};

const defaultUrl = 'https://tovolbox.hsn8086.com/tools/json-formatter/';
const defaultUtm: UtmState = { url: defaultUrl, source: 'newsletter', medium: 'email', campaign: 'launch', term: '', content: '' };
const defaultRobots: RobotsState = { userAgent: '*', allow: '/', disallow: '/private/', sitemap: 'https://tovolbox.hsn8086.com/sitemap.xml' };
const defaultHreflang = `en|https://tovolbox.hsn8086.com/tools/json-formatter/\nzh-CN|https://tovolbox.hsn8086.com/zh-CN/tools/json-formatter/\nx-default|https://tovolbox.hsn8086.com/tools/json-formatter/`;
const defaultFaq = 'Is TovolBox free?|Yes. TovolBox tools are free to use in the browser.';
const defaultBreadcrumb = `Home|https://tovolbox.hsn8086.com/\nTools|https://tovolbox.hsn8086.com/tools/json-formatter/`;

export function splitListInput(input: string): string[] {
  return input
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parsePipeRows(input: string): Array<[string, string]> {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf('|');
      if (separatorIndex === -1) return [line, ''] as [string, string];
      return [line.slice(0, separatorIndex).trim(), line.slice(separatorIndex + 1).trim()];
    });
}

export function parseHreflangRows(input: string): HreflangLink[] {
  return parsePipeRows(input).map(([hreflang, href]) => ({ hreflang, href }));
}

export function parseFaqRows(input: string): FaqItem[] {
  return parsePipeRows(input).map(([question, answer]) => ({ question, answer }));
}

export function parseBreadcrumbRows(input: string): BreadcrumbItem[] {
  return parsePipeRows(input).map(([name, url]) => ({ name, url }));
}

export default function SeoTool({ component, title }: { component: string; title: string }) {
  const mode = getSeoMode(component);
  const [input, setInput] = useState(defaultUrl);
  const [utm, setUtm] = useState(defaultUtm);
  const [hreflangRows, setHreflangRows] = useState(defaultHreflang);
  const [robots, setRobots] = useState(defaultRobots);
  const [faqRows, setFaqRows] = useState(defaultFaq);
  const [breadcrumbRows, setBreadcrumbRows] = useState(defaultBreadcrumb);
  const output = useMemo(() => {
    try {
      if (mode === 'meta-title-checker') return JSON.stringify(titleAdvice(input), null, 2);
      if (mode === 'meta-description-checker') return JSON.stringify(analyzeMetaDescription(input), null, 2);
      if (mode === 'serp-preview') return JSON.stringify(buildSerpPreview({ title: 'TovolBox tools', url: input, description: 'Fast private browser tools for developers, SEO, images, and everyday work.' }), null, 2);
      if (mode === 'open-graph-preview') return buildOpenGraphTags({ title: 'TovolBox', description: 'Private browser tools', url: input });
      if (mode === 'twitter-card-preview') return buildTwitterCardTags({ title: 'TovolBox', description: input });
      if (mode === 'canonical-tag-generator') return generateCanonicalTag(input);
      if (mode === 'hreflang-tag-generator') return generateHreflangTags(parseHreflangRows(hreflangRows));
      if (mode === 'robots-txt-generator') return generateRobotsTxt({ userAgent: robots.userAgent, allow: splitListInput(robots.allow), disallow: splitListInput(robots.disallow), sitemap: splitListInput(robots.sitemap) });
      if (mode === 'faq-schema-generator') return JSON.stringify(generateFaqSchema(parseFaqRows(faqRows)), null, 2);
      if (mode === 'breadcrumb-schema-generator') return JSON.stringify(generateBreadcrumbSchema(parseBreadcrumbRows(breadcrumbRows)), null, 2);
      if (mode === 'utm-builder') return buildUtmUrl({ url: utm.url, source: utm.source, medium: utm.medium, campaign: utm.campaign, term: utm.term, content: utm.content });
      return input;
    } catch (error) { return error instanceof Error ? error.message : 'Unable to generate SEO output.'; }
  }, [breadcrumbRows, faqRows, hreflangRows, input, mode, robots, utm]);

  function clearCurrentInput() {
    if (mode === 'utm-builder') setUtm({ url: '', source: '', medium: '', campaign: '', term: '', content: '' });
    else if (mode === 'hreflang-tag-generator') setHreflangRows('');
    else if (mode === 'robots-txt-generator') setRobots({ userAgent: '*', allow: '', disallow: '', sitemap: '' });
    else if (mode === 'faq-schema-generator') setFaqRows('');
    else if (mode === 'breadcrumb-schema-generator') setBreadcrumbRows('');
    else setInput('');
  }

  return (
    <ToolPanel title={title}>
      {mode === 'utm-builder' ? (
        <>
          <Field label="Campaign URL"><input className="input ltr-only" value={utm.url} onChange={(event) => setUtm((current) => ({ ...current, url: event.target.value }))} /></Field>
          <Field label="Campaign source"><input className="input ltr-only" value={utm.source} onChange={(event) => setUtm((current) => ({ ...current, source: event.target.value }))} /></Field>
          <Field label="Campaign medium"><input className="input ltr-only" value={utm.medium} onChange={(event) => setUtm((current) => ({ ...current, medium: event.target.value }))} /></Field>
          <Field label="Campaign name"><input className="input ltr-only" value={utm.campaign} onChange={(event) => setUtm((current) => ({ ...current, campaign: event.target.value }))} /></Field>
          <Field label="Campaign term"><input className="input ltr-only" value={utm.term} onChange={(event) => setUtm((current) => ({ ...current, term: event.target.value }))} /></Field>
          <Field label="Campaign content"><input className="input ltr-only" value={utm.content} onChange={(event) => setUtm((current) => ({ ...current, content: event.target.value }))} /></Field>
        </>
      ) : mode === 'hreflang-tag-generator' ? (
        <Field label="Hreflang rows"><textarea className="textarea ltr-only" value={hreflangRows} onChange={(event) => setHreflangRows(event.target.value)} /></Field>
      ) : mode === 'robots-txt-generator' ? (
        <>
          <Field label="User agent"><input className="input ltr-only" value={robots.userAgent} onChange={(event) => setRobots((current) => ({ ...current, userAgent: event.target.value }))} /></Field>
          <Field label="Allow paths"><textarea className="textarea ltr-only" value={robots.allow} onChange={(event) => setRobots((current) => ({ ...current, allow: event.target.value }))} /></Field>
          <Field label="Disallow paths"><textarea className="textarea ltr-only" value={robots.disallow} onChange={(event) => setRobots((current) => ({ ...current, disallow: event.target.value }))} /></Field>
          <Field label="Sitemap URLs"><textarea className="textarea ltr-only" value={robots.sitemap} onChange={(event) => setRobots((current) => ({ ...current, sitemap: event.target.value }))} /></Field>
        </>
      ) : mode === 'faq-schema-generator' ? (
        <Field label="FAQ rows"><textarea className="textarea ltr-only" value={faqRows} onChange={(event) => setFaqRows(event.target.value)} /></Field>
      ) : mode === 'breadcrumb-schema-generator' ? (
        <Field label="Breadcrumb rows"><textarea className="textarea ltr-only" value={breadcrumbRows} onChange={(event) => setBreadcrumbRows(event.target.value)} /></Field>
      ) : (
        <Field label="Input"><input className="input ltr-only" value={input} onChange={(event) => setInput(event.target.value)} /></Field>
      )}
      <p style={{ color: 'var(--muted)', marginTop: 0 }}>For row-based generators, enter one row per line using <code>label|value</code>.</p>
      <OutputBox value={output} />
      <CopyActions output={output} onClear={clearCurrentInput} />
    </ToolPanel>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label style={{ display: 'block', marginBottom: '.75rem' }}>{label}{children}</label>;
}
