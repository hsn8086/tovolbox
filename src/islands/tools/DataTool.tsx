import { useMemo, useState } from 'react';
import { formatCss, formatHtml, formatXml } from '@/lib/tools/formatters';
import { formatJson, minifyJson } from '@/lib/tools/json';
import { convertCsvDelimiter, csvToJson, jsonToCsv, type Delimiter } from '@/lib/tools/jsonCsv';
import { buildQueryString, parseQueryString } from '@/lib/tools/queryString';
import { parseUrl } from '@/lib/tools/urlParser';
import { CopyActions, Field, FieldGrid, OutputBox, ToolPanel } from './shared';

export type DataMode = 'json-formatter' | 'json-minifier' | 'json-to-csv' | 'csv-to-json' | 'query-string-parser' | 'query-string-builder' | 'url-parser' | 'csv-delimiter-converter' | 'xml-formatter' | 'html-formatter' | 'css-formatter' | 'generic';

const dataModes = ['json-formatter', 'json-minifier', 'json-to-csv', 'csv-to-json', 'query-string-parser', 'query-string-builder', 'url-parser', 'csv-delimiter-converter', 'xml-formatter', 'html-formatter', 'css-formatter'] as const;
const delimiterOptions: { label: string; value: Delimiter }[] = [
  { label: 'Comma (,)', value: ',' },
  { label: 'Semicolon (;)', value: ';' },
  { label: 'Tab', value: '\t' },
  { label: 'Pipe (|)', value: '|' },
];

export function getDataMode(component: string): DataMode {
  if (dataModes.includes(component as (typeof dataModes)[number])) return component as DataMode;
  return 'generic';
}

export default function DataTool({ component, title, privacyNote }: { component: string; title: string; privacyNote: string }) {
  const mode = getDataMode(component);
  const [input, setInput] = useState(sample(mode));
  const [fromDelimiter, setFromDelimiter] = useState<Delimiter>(',');
  const [toDelimiter, setToDelimiter] = useState<Delimiter>(';');
  const output = useMemo(() => {
    try {
      if (mode === 'json-formatter') return formatJson(input).output || formatJson(input).error || '';
      if (mode === 'json-minifier') return minifyJson(input).output || minifyJson(input).error || '';
      if (mode === 'json-to-csv') {
        const result = jsonToCsv(input);
        return result.ok ? result.output : result.error;
      }
      if (mode === 'csv-to-json') {
        const result = csvToJson(input);
        return result.ok ? result.output : result.error;
      }
      if (mode === 'query-string-parser') return JSON.stringify(parseQueryString(input), null, 2);
      if (mode === 'query-string-builder') return buildQueryString(input.split('\n').map((line) => { const [key, ...rest] = line.split('='); return { key: key.trim(), value: rest.join('=').trim() }; }));
      if (mode === 'url-parser') {
        const result = parseUrl(input);
        return result.ok ? JSON.stringify(result.output, null, 2) : result.error;
      }
      if (mode === 'csv-delimiter-converter') {
        const result = convertCsvDelimiter(input, fromDelimiter, toDelimiter);
        return result.ok ? result.output : result.error;
      }
      if (mode === 'xml-formatter') return formatXml(input).output || formatXml(input).error || '';
      if (mode === 'html-formatter') return formatHtml(input).output || formatHtml(input).error || '';
      if (mode === 'css-formatter') return formatCss(input).output || formatCss(input).error || '';
      return input;
    } catch (error) {
      return error instanceof Error ? error.message : 'Unable to process input.';
    }
  }, [fromDelimiter, input, mode, toDelimiter]);

  return <ToolPanel title={title} privacyNote={privacyNote}>{mode === 'csv-delimiter-converter' && <FieldGrid style={{ marginBottom: '.75rem' }}><Field label="From delimiter"><select className="select" value={fromDelimiter} onChange={(event) => setFromDelimiter(event.target.value as Delimiter)}>{delimiterOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field><Field label="To delimiter"><select className="select" value={toDelimiter} onChange={(event) => setToDelimiter(event.target.value as Delimiter)}>{delimiterOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field></FieldGrid>}<Field label="Input"><textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} /></Field><OutputBox value={output} /><CopyActions output={output} onClear={() => setInput('')} /></ToolPanel>;
}

function sample(mode: DataMode): string {
  if (mode === 'json-to-csv') return '[{"name":"Ada","role":"engineer"}]';
  if (mode === 'csv-to-json') return 'name,role\nAda,engineer';
  if (mode === 'query-string-parser') return '?q=tovolbox&tag=tools&tag=seo';
  if (mode === 'query-string-builder') return 'q=tovolbox\ntag=tools';
  if (mode === 'url-parser') return 'https://example.com/docs/tools?tag=json&tag=seo#top';
  if (mode === 'csv-delimiter-converter') return 'name,role\nAda,Engineer\nLinus,Maintainer';
  if (mode === 'xml-formatter') return '<root><item id="1">Hello</item><item id="2" /></root>';
  if (mode === 'html-formatter') return '<article><h1>Hello</h1><p>World<br></p></article>';
  if (mode === 'css-formatter') return 'body{color:#111;margin:0}.card{padding:1rem;border:1px solid #ddd;}';
  return '{"hello":"world","items":[1,2,3]}';
}
