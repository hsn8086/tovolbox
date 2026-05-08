import { useMemo, useState } from 'react';
import { formatJson, minifyJson } from '@/lib/tools/json';
import { csvToJson, jsonToCsv } from '@/lib/tools/jsonCsv';
import { buildQueryString, parseQueryString } from '@/lib/tools/queryString';
import { CopyActions, Field, OutputBox, ToolPanel } from './shared';

export type DataMode = 'json-formatter' | 'json-minifier' | 'json-to-csv' | 'csv-to-json' | 'query-string-parser' | 'query-string-builder' | 'generic';

export function getDataMode(component: string): DataMode {
  if (['json-formatter', 'json-minifier', 'json-to-csv', 'csv-to-json', 'query-string-parser', 'query-string-builder'].includes(component)) return component as DataMode;
  return 'generic';
}

export default function DataTool({ component, title, privacyNote }: { component: string; title: string; privacyNote: string }) {
  const mode = getDataMode(component);
  const [input, setInput] = useState(sample(mode));
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
      return input;
    } catch (error) {
      return error instanceof Error ? error.message : 'Unable to process input.';
    }
  }, [input, mode]);

  return <ToolPanel title={title} privacyNote={privacyNote}><Field label="Input"><textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} /></Field><OutputBox value={output} /><CopyActions output={output} onClear={() => setInput('')} /></ToolPanel>;
}

function sample(mode: DataMode): string {
  if (mode === 'json-to-csv') return '[{"name":"Ada","role":"engineer"}]';
  if (mode === 'csv-to-json') return 'name,role\nAda,engineer';
  if (mode === 'query-string-parser') return '?q=tovolbox&tag=tools&tag=seo';
  if (mode === 'query-string-builder') return 'q=tovolbox\ntag=tools';
  return '{"hello":"world","items":[1,2,3]}';
}
