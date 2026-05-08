import { useMemo, useState } from 'react';
import { formatSvg, minifySvg, sanitizeSvgForPreview, svgToDataUri, svgToJsx } from '@/lib/tools/svg';
import { CopyActions, OutputBox, ToolPanel } from './shared';

export function getSvgMode(component: string): string { return component.startsWith('svg-') ? component : 'generic'; }

export default function SvgTool({ component, title }: { component: string; title: string }) {
  const [input, setInput] = useState('<svg class="icon"><script>alert(1)</script><path fill-rule="evenodd" d="M0 0h10v10z" /></svg>');
  const output = useMemo(() => {
    if (component === 'svg-formatter') return formatSvg(input);
    if (component === 'svg-minifier') return minifySvg(input);
    if (component === 'svg-data-uri') return svgToDataUri(input);
    if (component === 'svg-to-jsx') return svgToJsx(input);
    if (component === 'svg-sanitizer') return sanitizeSvgForPreview(input);
    return input;
  }, [component, input]);
  return <ToolPanel title={title}><p style={{ color: 'var(--muted)' }}>SVG is sanitized before preview-oriented transformations.</p><textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} /><OutputBox value={output} /><CopyActions output={output} onClear={() => setInput('')} /></ToolPanel>;
}
