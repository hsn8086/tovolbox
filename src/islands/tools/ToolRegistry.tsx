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
};

const canvasTools = new Set(['image-resize-calculator', 'image-grayscale', 'image-rotate', 'image-flip', 'image-crop', 'image-brightness', 'image-contrast', 'image-saturation', 'image-watermark']);

export default function ToolRegistry({ component, title }: Props) {
  if (component.startsWith('quiz-')) return <ReflectionQuizTool component={component} />;
  if (canvasTools.has(component)) return <ImageCanvasTool component={component} />;
  if (getDataMode(component) !== 'generic') return <DataTool component={component} title={title} />;
  if (getTextMode(component) !== 'generic') return <TextTool component={component} title={title} />;
  if (getUnitMode(component) !== 'generic') return <UnitConverterTool component={component} title={title} />;
  if (getColorMode(component) !== 'generic') return <ColorTool component={component} title={title} />;
  if (getEncodeCryptoMode(component) !== 'generic') return <EncodeCryptoTool component={component} title={title} />;
  if (getSeoMode(component) !== 'generic') return <SeoTool component={component} title={title} />;
  if (getDeveloperMode(component) !== 'generic') return <DeveloperTool component={component} title={title} />;
  if (getSvgMode(component) !== 'generic') return <SvgTool component={component} title={title} />;
  return <GenericTool component={component} title={title} />;
}
