import { useEffect, useMemo, useState } from 'react';
import { compoundInterest, convertNumberBase, discountPrice, loanPayment, percentageChange, percentageOf } from '@/lib/tools/calculators';
import { decodeBase64, decodeJwt, encodeBase64, safeDecodeURIComponent } from '@/lib/tools/codec';
import { contrastRatio, hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from '@/lib/tools/color';
import { explainCron } from '@/lib/tools/cron';
import { generateBorderRadius, generateBoxShadow, generateClamp, generateLinearGradient } from '@/lib/tools/cssGenerators';
import { isoToUnix, unixToIso } from '@/lib/tools/dateTime';
import { humanFileSummary, estimateBase64Size } from '@/lib/tools/fileTools';
import { hashText } from '@/lib/tools/hash';
import { decodeHtmlEntities, encodeHtmlEntities } from '@/lib/tools/htmlEntity';
import { generateUlid, generateUuidV4 } from '@/lib/tools/ids';
import { formatBytes, aspectRatio, calculateResizeDimensions, normalizeRotation } from '@/lib/tools/image';
import { formatJson, minifyJson } from '@/lib/tools/json';
import { csvToJson, jsonToCsv } from '@/lib/tools/jsonCsv';
import { extractHeadings, generateMarkdownToc, markdownToPlainText } from '@/lib/tools/markdown';
import { buildQueryString, parseQueryString } from '@/lib/tools/queryString';
import { buildMailtoPayload, buildVCardPayload, buildWifiQrPayload, validateEan13 } from '@/lib/tools/qr';
import { generatePassword, generateRandomString } from '@/lib/tools/random';
import { scoreReflectionQuiz, type ReflectionQuizId } from '@/lib/tools/reflectionQuizzes';
import { testRegex } from '@/lib/tools/regex';
import { buildUtmUrl, titleAdvice } from '@/lib/tools/seo';
import { analyzeMetaDescription, buildOpenGraphTags, buildSerpPreview, buildTwitterCardTags } from '@/lib/tools/seoPreview';
import { generateBreadcrumbSchema, generateCanonicalTag, generateFaqSchema, generateHreflangTags, generateRobotsTxt } from '@/lib/tools/schemaGenerators';
import { checkSocialImageSize } from '@/lib/tools/socialImage';
import { formatSvg, minifySvg, sanitizeSvgForPreview, svgToDataUri, svgToJsx } from '@/lib/tools/svg';
import { countWords, slugify, toCamelCase, toTitleCase } from '@/lib/tools/text';
import { deduplicateLines, extractEmails, extractNumbers, extractUrls, findAndReplace, removeEmptyLines, sortLines, trimLines } from '@/lib/tools/textExtract';
import { convertDataSize, convertLength, convertTemperature, convertWeight } from '@/lib/tools/units';

type Props = {
  component: string;
  title: string;
};

export default function GenericTool({ component, title, privacyNote }: Props & { privacyNote: string }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('encode');
  const [fileInfo, setFileInfo] = useState<string>('');
  const [asyncOutput, setAsyncOutput] = useState('');

  const output = useMemo(() => {
    try {
      if (component === 'json-formatter') return formatJson(input || '{"hello":"world"}').output;
      if (component === 'json-minifier') return minifyJson(input || '{"hello": "world"}').output;
      if (component === 'json-to-csv') return jsonToCsv(input || '[{"name":"Ada","role":"engineer"}]').output;
      if (component === 'csv-to-json') return csvToJson(input || 'name,role\nAda,engineer').output;
      if (component === 'query-string-parser') return JSON.stringify(parseQueryString(input || '?q=tovolbox&tag=tools&tag=seo'), null, 2);
      if (component === 'query-string-builder') return buildQueryString((input || 'q=tovolbox\ntag=tools').split('\n').map((line) => { const [key, ...rest] = line.split('='); return { key: key.trim(), value: rest.join('=').trim() }; }));
      if (component === 'base64') return mode === 'encode' ? encodeBase64(input) : decodeBase64(input);
      if (component === 'url-codec') return mode === 'encode' ? encodeURIComponent(input) : safeDecodeURIComponent(input).output;
      if (component === 'html-entity') return mode === 'encode' ? encodeHtmlEntities(input) : decodeHtmlEntities(input);
      if (component === 'word-counter') return JSON.stringify(countWords(input), null, 2);
      if (component === 'case-converter') return [input.toUpperCase(), input.toLowerCase(), toTitleCase(input), toCamelCase(input)].join('\n');
      if (component === 'slug-generator') return slugify(input);
      if (component === 'extract-emails') return extractEmails(input).join('\n');
      if (component === 'extract-urls') return extractUrls(input).join('\n');
      if (component === 'extract-numbers') return extractNumbers(input).join('\n');
      if (component === 'remove-empty-lines') return removeEmptyLines(input);
      if (component === 'deduplicate-lines') return deduplicateLines(input);
      if (component === 'sort-lines') return sortLines(input || 'Beta\nalpha\nGamma');
      if (component === 'trim-lines') return trimLines(input);
      if (component === 'find-replace') return findAndReplace(input || 'Hello tools, hello web.', 'hello', 'Hi');
      if (component === 'jwt-decoder') return JSON.stringify(decodeJwt(input), null, 2);
      if (component === 'uuid-generator') return generateUuidV4();
      if (component === 'ulid-generator') return generateUlid();
      if (component === 'meta-title-checker') return JSON.stringify(titleAdvice(input), null, 2);
      if (component === 'utm-builder') return buildUtmUrl({ url: input || 'https://example.com/', source: 'newsletter', medium: 'email', campaign: 'launch' });
      if (component === 'hex-to-rgb') return JSON.stringify(hexToRgb(input || '#2563eb'), null, 2);
      if (component === 'rgb-to-hex') return rgbToHex(parseRgb(input || '37,99,235'));
      if (component === 'rgb-to-hsl') return JSON.stringify(rgbToHsl(parseRgb(input || '37,99,235')), null, 2);
      if (component === 'hsl-to-rgb') return JSON.stringify(hslToRgb(parseHsl(input || '221,83,53')), null, 2);
      if (component === 'contrast-ratio') return String(contrastRatio(...parseColorPair(input || '#000000,#ffffff')));
      if (component === 'timestamp-converter') return /^\d+$/.test(input.trim()) ? unixToIso(input.trim()) : String(isoToUnix(input || new Date().toISOString()));
      if (component === 'length-converter') return String(convertLength(Number(input || 1), 'm', 'ft'));
      if (component === 'weight-converter') return String(convertWeight(Number(input || 1), 'kg', 'lb'));
      if (component === 'temperature-converter') return String(convertTemperature(Number(input || 0), 'c', 'f'));
      if (component === 'data-size-converter') return String(convertDataSize(Number(input || 1), 'MB', 'MiB'));
      if (component === 'percentage-calculator') return String(percentageOf(Number(input || 25), 200));
      if (component === 'percentage-change') return String(percentageChange(100, Number(input || 125)));
      if (component === 'discount-calculator') return String(discountPrice(100, Number(input || 20)));
      if (component === 'loan-calculator') return String(loanPayment(Number(input || 100000), 5, 30).toFixed(2));
      if (component === 'compound-interest') return String(compoundInterest(Number(input || 1000), 6, 10).toFixed(2));
      if (component === 'number-base-converter') return convertNumberBase(input || 'FF', 16, 10);
      if (component === 'regex-tester') return JSON.stringify(testRegex('\\b\\w{4,}\\b', 'gi', input || 'Test every useful word.'), null, 2);
      if (component === 'markdown-toc') return [generateMarkdownToc(input || '# Intro\n## Details'), '', markdownToPlainText(input || '# Intro\n## Details'), '', JSON.stringify(extractHeadings(input || '# Intro\n## Details'), null, 2)].join('\n');
      if (component === 'css-clamp') return generateClamp(16, Number(input || 32), 320, 1280);
      if (component === 'box-shadow') return generateBoxShadow({ offsetX: 0, offsetY: 12, blurRadius: 28, spreadRadius: 0, color: input || 'rgba(15, 23, 42, 0.18)' });
      if (component === 'border-radius') return generateBorderRadius((input || '8,16,24,32').split(',').map(Number) as [number, number, number, number]);
      if (component === 'gradient-generator') return generateLinearGradient({ direction: '135deg', stops: [{ color: input || '#2563eb' }, { color: '#7c3aed' }] });
      if (component === 'faq-schema-generator') return JSON.stringify(generateFaqSchema([{ question: 'Is TovolBox free?', answer: 'Yes, the tools are free to use.' }]), null, 2);
      if (component === 'breadcrumb-schema-generator') return JSON.stringify(generateBreadcrumbSchema([{ name: 'Home', url: 'https://tovolbox.hsn8086.com/' }, { name: 'Tools', url: 'https://tovolbox.hsn8086.com/tools/' }]), null, 2);
      if (component === 'canonical-tag-generator') return generateCanonicalTag(input || 'https://tovolbox.hsn8086.com/tools/json-formatter/');
      if (component === 'hreflang-tag-generator') return generateHreflangTags([{ hreflang: 'en', href: 'https://tovolbox.hsn8086.com/' }, { hreflang: 'zh-CN', href: 'https://tovolbox.hsn8086.com/zh-CN/' }]);
      if (component === 'robots-txt-generator') return generateRobotsTxt({ allow: ['/'], disallow: ['/private/'], sitemap: 'https://tovolbox.hsn8086.com/sitemap.xml' });
      if (component === 'meta-description-checker') return JSON.stringify(analyzeMetaDescription(input), null, 2);
      if (component === 'serp-preview') return JSON.stringify(buildSerpPreview({ title: 'TovolBox tools', url: 'https://tovolbox.hsn8086.com/tools/', description: input || 'Fast private browser tools for developers, SEO, images, and everyday work.' }), null, 2);
      if (component === 'open-graph-preview') return buildOpenGraphTags({ title: 'TovolBox', description: input || 'Private browser tools', url: 'https://tovolbox.hsn8086.com/' });
      if (component === 'twitter-card-preview') return buildTwitterCardTags({ title: 'TovolBox', description: input || 'Private browser tools' });
      if (component === 'cron-explainer') return JSON.stringify(explainCron(input || '*/5 9-17 * * 1-5'), null, 2);
      if (component === 'password-generator') return generatePassword({ length: Number(input || 16), symbols: true });
      if (component === 'random-string-generator') return generateRandomString(Number(input || 24));
      if (component.startsWith('hash-')) return asyncOutput || 'Hash will appear here.';
      if (component === 'svg-formatter') return formatSvg(input || '<svg><g onclick="alert(1)"><path fill-rule="evenodd" d="M0 0h10v10z"/></g></svg>');
      if (component === 'svg-minifier') return minifySvg(input || '<svg>\n  <path d="M0 0h10v10z" />\n</svg>');
      if (component === 'svg-data-uri') return svgToDataUri(input || '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0h10v10z"/></svg>');
      if (component === 'svg-to-jsx') return svgToJsx(input || '<svg class="icon"><path fill-rule="evenodd" /></svg>');
      if (component === 'svg-sanitizer') return sanitizeSvgForPreview(input || '<svg><script>alert(1)</script><a href="javascript:alert(1)"><path /></a></svg>');
      if (component === 'image-resize-calculator') return JSON.stringify(calculateResizeDimensions(1920, 1080, Number(input || 800), 600), null, 2);
      if (component === 'image-rotation-normalizer') return String(normalizeRotation(Number(input || 450)));
      if (component === 'social-image-checker') return JSON.stringify(checkSocialImageSize('open-graph', 1200, Number(input || 630)), null, 2);
      if (component === 'wifi-qr-payload') return buildWifiQrPayload({ ssid: input || 'TovolBox WiFi', password: 'secret-pass' });
      if (component === 'vcard-payload') return buildVCardPayload({ firstName: 'Ada', lastName: 'Lovelace', email: input || 'ada@example.com' });
      if (component === 'mailto-builder') return buildMailtoPayload({ to: input || 'hello@example.com', subject: 'Hello from TovolBox' });
      if (component === 'ean13-validator') return String(validateEan13(input || '4006381333931'));
      if (component === 'file-summary') return humanFileSummary({ name: input || 'report.final.pdf', size: 1536000, type: 'application/pdf' });
      if (component === 'base64-size-estimator') return String(estimateBase64Size(Number(input || 1536)));
      if (component === 'quiz-big-five-lite') return JSON.stringify(scoreReflectionQuiz('big-five-lite', {}), null, 2);
      if (component === 'quiz-work-style') return JSON.stringify(scoreReflectionQuiz('work-style', {}), null, 2);
      if (component === 'quiz-digital-wellbeing') return JSON.stringify(scoreReflectionQuiz('digital-wellbeing', {}), null, 2);
      if (component.startsWith('quiz-')) return JSON.stringify(scoreReflectionQuiz(component.replace('quiz-', '') as ReflectionQuizId, {}), null, 2);
      if (component.startsWith('image-')) return fileInfo || 'Choose an image to inspect or convert locally.';
      return input;
    } catch (error) {
      return error instanceof Error ? error.message : 'Unable to process input.';
    }
  }, [asyncOutput, component, fileInfo, input, mode]);

  useEffect(() => {
    if (!component.startsWith('hash-')) return;

    const algorithm = component === 'hash-sha1' ? 'SHA-1' : component === 'hash-sha512' ? 'SHA-512' : 'SHA-256';
    let cancelled = false;
    setAsyncOutput('Hashing...');
    void hashText(input || 'hello', algorithm).then((hash) => {
      if (!cancelled) setAsyncOutput(hash);
    }).catch((error: unknown) => {
      if (!cancelled) setAsyncOutput(error instanceof Error ? error.message : 'Unable to hash input.');
    });

    return () => {
      cancelled = true;
    };
  }, [component, input]);

  async function handleFile(file: File) {
    if (component === 'image-to-base64') {
      const reader = new FileReader();
      reader.onload = () => setFileInfo(String(reader.result));
      reader.readAsDataURL(file);
      return;
    }

    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      setFileInfo(JSON.stringify({ name: file.name, type: file.type, size: formatBytes(file.size), width: image.width, height: image.height, aspectRatio: aspectRatio(image.width, image.height) }, null, 2));
      URL.revokeObjectURL(url);
    };
    image.src = url;
  }

  return (
    <section className="card" style={{ padding: '1.25rem' }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{privacyNote}</p>
      {(component === 'base64' || component === 'url-codec' || component === 'html-entity') && (
        <label style={{ display: 'block', marginBottom: '.75rem' }}>
          Mode
          <select className="select" value={mode} onChange={(event) => setMode(event.target.value)}>
            <option value="encode">Encode</option>
            <option value="decode">Decode</option>
          </select>
        </label>
      )}
      {component.startsWith('image-') ? (
        <label style={{ display: 'block', marginBottom: '.75rem' }}>
          Image file
          <input className="input" type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && void handleFile(event.target.files[0])} />
        </label>
      ) : (
        <label style={{ display: 'block', marginBottom: '.75rem' }}>
          Input
          <textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Paste input here" />
        </label>
      )}
      <label style={{ display: 'block' }}>
        Output
        <textarea className="textarea ltr-only" readOnly value={output} />
      </label>
      <div style={{ display: 'flex', gap: '.75rem', marginTop: '.9rem', flexWrap: 'wrap' }}>
        <button className="btn" type="button" onClick={() => void navigator.clipboard.writeText(output)}>Copy result</button>
        <button className="btn btn-secondary" type="button" onClick={() => setInput('')}>Clear</button>
      </div>
    </section>
  );
}

function parseRgb(input: string) {
  const [r, g, b] = input.split(',').map((part) => Number(part.trim()));
  return { r, g, b };
}

function parseHsl(input: string) {
  const [h, s, l] = input.split(',').map((part) => Number(part.trim()));
  return { h, s, l };
}

function parseColorPair(input: string): [string, string] {
  const [foreground, background] = input.split(',').map((part) => part.trim());
  return [foreground || '#000000', background || '#ffffff'];
}
