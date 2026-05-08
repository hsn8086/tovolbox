import { useEffect, useMemo, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { create, toDataURL } from 'qrcode';
import { buildQrMatrix, qrMatrixToSvg, type QrErrorCorrectionLevel } from '@/lib/tools/qr';
import { CopyActions, Field, FieldGrid, OutputBox, ToolPanel } from './shared';

const modes = ['qr-code-generator', 'qr-code-reader'] as const;
export type QrMode = (typeof modes)[number] | 'generic';

export function getQrMode(component: string): QrMode {
  return modes.includes(component as (typeof modes)[number]) ? component as QrMode : 'generic';
}

export default function QrTool({ component, title, privacyNote }: { component: string; title: string; privacyNote: string }) {
  const mode = getQrMode(component);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [input, setInput] = useState('https://tovolbox.hsn8086.com/tools/');
  const [level, setLevel] = useState<QrErrorCorrectionLevel>('M');
  const [size, setSize] = useState('256');
  const [dataUrl, setDataUrl] = useState('');
  const [readerOutput, setReaderOutput] = useState('Choose a QR image to decode locally.');

  const svg = useMemo(() => {
    try {
      return qrMatrixToSvg(buildQrMatrix(input, create, { errorCorrectionLevel: level }));
    } catch (error) {
      return error instanceof Error ? error.message : 'Unable to generate QR code.';
    }
  }, [input, level]);

  useEffect(() => {
    if (mode !== 'qr-code-generator' || input.trim().length === 0) {
      setDataUrl('');
      return;
    }

    let cancelled = false;
    const width = Math.max(96, Math.min(1024, Number(size) || 256));
    void toDataURL(input, { errorCorrectionLevel: level, width, margin: 2 }).then((url) => {
      if (!cancelled) setDataUrl(url);
    }).catch((error: unknown) => {
      if (!cancelled) setDataUrl(error instanceof Error ? error.message : 'Unable to generate PNG data URL.');
    });

    return () => {
      cancelled = true;
    };
  }, [input, level, mode, size]);

  async function decodeFile(file: File): Promise<void> {
    const image = new Image();
    const url = URL.createObjectURL(file);

    try {
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('Unable to load image file.'));
        image.src = url;
      });

      const canvas = canvasRef.current ?? document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas is not available in this browser.');
      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const result = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' });
      setReaderOutput(result ? result.data : 'No QR code was detected in this image.');
    } catch (error) {
      setReaderOutput(error instanceof Error ? error.message : 'Unable to decode QR image.');
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  const output = mode === 'qr-code-generator' ? svg : readerOutput;

  if (mode === 'qr-code-reader') {
    return (
      <ToolPanel title={title} privacyNote={privacyNote}>
        <Field label="QR image"><input className="input" type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && void decodeFile(event.target.files[0])} /></Field>
        <canvas ref={canvasRef} hidden />
        <OutputBox value={readerOutput} />
        <CopyActions output={readerOutput} onClear={() => setReaderOutput('')} />
      </ToolPanel>
    );
  }

  return (
    <ToolPanel title={title} privacyNote={privacyNote}>
      <Field label="QR content"><textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} /></Field>
      <FieldGrid>
        <Field label="Error correction"><select className="select" value={level} onChange={(event) => setLevel(event.target.value as QrErrorCorrectionLevel)}><option value="L">Low</option><option value="M">Medium</option><option value="Q">Quartile</option><option value="H">High</option></select></Field>
        <Field label="PNG size"><input className="input" value={size} onChange={(event) => setSize(event.target.value)} /></Field>
      </FieldGrid>
      <div className="qr-preview" role="img" aria-label="Generated QR code" dangerouslySetInnerHTML={{ __html: svg.startsWith('<svg') ? svg : '' }} />
      <OutputBox value={output} />
      <div style={{ display: 'flex', gap: '.75rem', marginTop: '.9rem', flexWrap: 'wrap' }}>
        <button className="btn" type="button" onClick={() => void navigator.clipboard.writeText(output)}>Copy SVG</button>
        {dataUrl.startsWith('data:image/') && <a className="btn btn-secondary" href={dataUrl} download="tovolbox-qr.png">Download PNG</a>}
        <button className="btn btn-secondary" type="button" onClick={() => setInput('')}>Clear</button>
      </div>
    </ToolPanel>
  );
}
