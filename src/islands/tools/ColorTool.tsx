import { useMemo, useState } from 'react';
import { contrastRatio, hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from '@/lib/tools/color';
import { OutputBox, ToolPanel } from './shared';

export type ColorMode = 'hex-to-rgb' | 'rgb-to-hex' | 'rgb-to-hsl' | 'hsl-to-rgb' | 'contrast-ratio' | 'generic';

export function getColorMode(component: string): ColorMode {
  if (['hex-to-rgb', 'rgb-to-hex', 'rgb-to-hsl', 'hsl-to-rgb', 'contrast-ratio'].includes(component)) return component as ColorMode;
  return 'generic';
}

export default function ColorTool({ component, title }: { component: string; title: string }) {
  const mode = getColorMode(component);
  const [input, setInput] = useState(mode === 'contrast-ratio' ? '#000000,#ffffff' : mode.startsWith('rgb') ? '37,99,235' : mode === 'hsl-to-rgb' ? '221,83,53' : '#2563eb');
  const output = useMemo(() => {
    try {
      if (mode === 'hex-to-rgb') return JSON.stringify(hexToRgb(input), null, 2);
      if (mode === 'rgb-to-hex') return rgbToHex(parseRgb(input));
      if (mode === 'rgb-to-hsl') return JSON.stringify(rgbToHsl(parseRgb(input)), null, 2);
      if (mode === 'hsl-to-rgb') return JSON.stringify(hslToRgb(parseHsl(input)), null, 2);
      if (mode === 'contrast-ratio') { const [a, b] = input.split(',').map((part) => part.trim()); return String(contrastRatio(a, b)); }
      return input;
    } catch (error) { return error instanceof Error ? error.message : 'Invalid color input.'; }
  }, [input, mode]);
  return <ToolPanel title={title}><label style={{ display: 'block', marginBottom: '.75rem' }}>Color input<input className="input ltr-only" value={input} onChange={(event) => setInput(event.target.value)} /></label><OutputBox value={output} /></ToolPanel>;
}

function parseRgb(input: string) { const [r, g, b] = input.split(',').map((part) => Number(part.trim())); return { r, g, b }; }
function parseHsl(input: string) { const [h, s, l] = input.split(',').map((part) => Number(part.trim())); return { h, s, l }; }
