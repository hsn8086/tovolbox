const canvasTools = new Set(['image-resize-calculator', 'image-grayscale', 'image-rotate', 'image-flip', 'image-crop', 'image-brightness', 'image-contrast', 'image-saturation', 'image-watermark']);
const dataTools = new Set(['json-formatter', 'json-minifier', 'json-to-csv', 'csv-to-json', 'query-string-parser', 'query-string-builder', 'url-parser', 'csv-delimiter-converter', 'yaml-to-json', 'json-to-yaml', 'xml-formatter', 'html-formatter', 'css-formatter']);
const textTools = new Set(['word-counter', 'case-converter', 'slug-generator', 'extract-emails', 'extract-urls', 'extract-numbers', 'remove-empty-lines', 'deduplicate-lines', 'sort-lines', 'trim-lines', 'find-replace', 'markdown-toc', 'markdown-previewer', 'diff-checker', 'lorem-ipsum-generator']);
const colorTools = new Set(['hex-to-rgb', 'rgb-to-hex', 'rgb-to-hsl', 'hsl-to-rgb', 'contrast-ratio']);
const encodeCryptoTools = new Set(['base64', 'url-codec', 'html-entity', 'jwt-decoder', 'password-generator', 'random-string-generator', 'uuid-generator', 'ulid-generator']);
const seoTools = new Set(['meta-title-checker', 'meta-description-checker', 'serp-preview', 'open-graph-preview', 'twitter-card-preview', 'canonical-tag-generator', 'hreflang-tag-generator', 'robots-txt-generator', 'faq-schema-generator', 'breadcrumb-schema-generator', 'utm-builder']);
const developerTools = new Set(['regex-tester', 'cron-explainer', 'percentage-calculator', 'percentage-change', 'discount-calculator', 'loan-calculator', 'compound-interest', 'number-base-converter', 'wifi-qr-payload', 'vcard-payload', 'mailto-builder', 'ean13-validator', 'file-summary', 'base64-size-estimator']);
const qrTools = new Set(['qr-code-generator', 'qr-code-reader']);

export type ToolRegistryKind = 'quiz' | 'image-canvas' | 'data' | 'text' | 'unit' | 'color' | 'encode-crypto' | 'seo' | 'developer' | 'qr' | 'svg' | 'generic';

export function getToolRegistryKind(component: string): ToolRegistryKind {
  if (component.startsWith('quiz-')) return 'quiz';
  if (canvasTools.has(component)) return 'image-canvas';
  if (dataTools.has(component)) return 'data';
  if (textTools.has(component)) return 'text';
  if (component.includes('length') || component.includes('weight') || component.includes('temperature') || component.includes('data-size')) return 'unit';
  if (colorTools.has(component)) return 'color';
  if (component.startsWith('hash-') || encodeCryptoTools.has(component)) return 'encode-crypto';
  if (seoTools.has(component)) return 'seo';
  if (developerTools.has(component)) return 'developer';
  if (qrTools.has(component)) return 'qr';
  if (component.startsWith('svg-')) return 'svg';
  return 'generic';
}
