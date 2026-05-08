import ColorTool from './ColorTool';
import DataTool from './DataTool';
import DeveloperTool from './DeveloperTool';
import EncodeCryptoTool from './EncodeCryptoTool';
import GenericTool from './GenericTool';
import ImageCanvasTool from './ImageCanvasTool';
import QrTool from './QrTool';
import ReflectionQuizTool from './ReflectionQuizTool';
import SeoTool from './SeoTool';
import SvgTool from './SvgTool';
import TextTool from './TextTool';
import UnitConverterTool from './UnitConverterTool';
import { getToolRegistryKind } from './registryKind';

type Props = {
  component: string;
  title: string;
  privacyNote: string;
  ymylDisclaimer: string;
};

export { getToolRegistryKind, type ToolRegistryKind } from './registryKind';

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
  if (kind === 'qr') return <QrTool component={component} title={title} privacyNote={privacyNote} />;
  if (kind === 'svg') return <SvgTool component={component} title={title} />;
  return <GenericTool component={component} title={title} privacyNote={privacyNote} />;
}
