import ColorTool, { getColorMode } from './ColorTool';
import DataTool, { getDataMode } from './DataTool';
import DeveloperTool, { getDeveloperMode } from './DeveloperTool';
import EncodeCryptoTool, { getEncodeCryptoMode } from './EncodeCryptoTool';
import GenericTool from './GenericTool';
import ImageCanvasTool from './ImageCanvasTool';
import ReflectionQuizTool from './ReflectionQuizTool';
import SeoTool, { getSeoMode } from './SeoTool';
import SvgTool, { getSvgMode } from './SvgTool';
import TextTool, { getTextMode } from './TextTool';
import UnitConverterTool, { getUnitMode } from './UnitConverterTool';

type Props = {
  component: string;
  title: string;
  privacyNote: string;
  ymylDisclaimer: string;
};

const canvasTools = new Set(['image-resize-calculator', 'image-grayscale', 'image-rotate', 'image-flip', 'image-crop', 'image-brightness', 'image-contrast', 'image-saturation', 'image-watermark']);

export type ToolRegistryKind = 'quiz' | 'image-canvas' | 'data' | 'text' | 'unit' | 'color' | 'encode-crypto' | 'seo' | 'developer' | 'svg' | 'generic';

export function getToolRegistryKind(component: string): ToolRegistryKind {
  if (component.startsWith('quiz-')) return 'quiz';
  if (canvasTools.has(component)) return 'image-canvas';
  if (getDataMode(component) !== 'generic') return 'data';
  if (getTextMode(component) !== 'generic') return 'text';
  if (getUnitMode(component) !== 'generic') return 'unit';
  if (getColorMode(component) !== 'generic') return 'color';
  if (getEncodeCryptoMode(component) !== 'generic') return 'encode-crypto';
  if (getSeoMode(component) !== 'generic') return 'seo';
  if (getDeveloperMode(component) !== 'generic') return 'developer';
  if (getSvgMode(component) !== 'generic') return 'svg';
  return 'generic';
}

export default function ToolRegistry({ component, title, privacyNote, ymylDisclaimer }: Props) {
  const kind = getToolRegistryKind(component);

  if (kind === 'quiz') return <ReflectionQuizTool component={component} disclaimer={ymylDisclaimer} privacyNote={privacyNote} />;
  if (kind === 'image-canvas') return <ImageCanvasTool component={component} privacyNote={privacyNote} />;
  if (kind === 'data') return <DataTool component={component} title={title} privacyNote={privacyNote} />;
  if (kind === 'text') return <TextTool component={component} title={title} privacyNote={privacyNote} />;
  if (kind === 'unit') return <UnitConverterTool component={component} title={title} />;
  if (kind === 'color') return <ColorTool component={component} title={title} />;
  if (kind === 'encode-crypto') return <EncodeCryptoTool component={component} title={title} privacyNote={privacyNote} />;
  if (kind === 'seo') return <SeoTool component={component} title={title} />;
  if (kind === 'developer') return <DeveloperTool component={component} title={title} />;
  if (kind === 'svg') return <SvgTool component={component} title={title} />;
  return <GenericTool component={component} title={title} privacyNote={privacyNote} />;
}
