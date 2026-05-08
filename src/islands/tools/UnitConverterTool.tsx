import { useMemo, useState } from 'react';
import { convertDataSize, convertLength, convertTemperature, convertWeight } from '@/lib/tools/units';
import { OutputBox, ToolPanel } from './shared';

export type UnitMode = 'length' | 'weight' | 'temperature' | 'data-size' | 'generic';

const units = {
  length: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'],
  weight: ['mg', 'g', 'kg', 'oz', 'lb', 'st', 't'],
  temperature: ['c', 'f', 'k'],
  'data-size': ['bit', 'B', 'KB', 'MB', 'GB', 'TB', 'KiB', 'MiB', 'GiB', 'TiB'],
} as const;

export function getUnitMode(component: string): UnitMode {
  if (component.includes('length')) return 'length';
  if (component.includes('weight')) return 'weight';
  if (component.includes('temperature')) return 'temperature';
  if (component.includes('data-size')) return 'data-size';
  return 'generic';
}

export default function UnitConverterTool({ component, title }: { component: string; title: string }) {
  const mode = getUnitMode(component) as Exclude<UnitMode, 'generic'>;
  const [value, setValue] = useState('1');
  const [from, setFrom] = useState<string>(units[mode][0]);
  const [to, setTo] = useState<string>(units[mode][1]);
  const output = useMemo(() => {
    try {
      const numeric = Number(value);
      if (mode === 'length') return String(convertLength(numeric, from as never, to as never));
      if (mode === 'weight') return String(convertWeight(numeric, from as never, to as never));
      if (mode === 'temperature') return String(convertTemperature(numeric, from as never, to as never));
      return String(convertDataSize(numeric, from as never, to as never));
    } catch (error) { return error instanceof Error ? error.message : 'Unable to convert.'; }
  }, [from, mode, to, value]);

  return <ToolPanel title={title}><div className="grid-auto"><label>Value<input className="input" value={value} onChange={(event) => setValue(event.target.value)} /></label><label>From<select className="select" value={from} onChange={(event) => setFrom(event.target.value)}>{units[mode].map((unit) => <option key={unit}>{unit}</option>)}</select></label><label>To<select className="select" value={to} onChange={(event) => setTo(event.target.value)}>{units[mode].map((unit) => <option key={unit}>{unit}</option>)}</select></label></div><OutputBox value={output} /></ToolPanel>;
}
