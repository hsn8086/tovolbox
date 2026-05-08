import { useRef, useState } from 'react';

type Props = {
  component: string;
};

export type ImageCanvasMode = 'inspect' | 'resizer' | 'crop' | 'grayscale' | 'rotate' | 'flip' | 'brightness' | 'contrast' | 'saturation' | 'watermark';

export function normalizeImageMode(component: string): ImageCanvasMode {
  if (component.includes('resize')) return 'resizer';
  if (component.includes('crop')) return 'crop';
  if (component.includes('grayscale')) return 'grayscale';
  if (component.includes('rotate')) return 'rotate';
  if (component.includes('flip')) return 'flip';
  if (component.includes('brightness')) return 'brightness';
  if (component.includes('contrast')) return 'contrast';
  if (component.includes('saturation')) return 'saturation';
  if (component.includes('watermark')) return 'watermark';
  return 'inspect';
}

export function applyImageAdjustment(value: number, mode: ImageCanvasMode): number {
  if (mode === 'brightness') return clamp(value + 32);
  if (mode === 'contrast') return clamp((value - 128) * 1.28 + 128);
  return clamp(value);
}

export default function ImageCanvasTool({ component }: Props) {
  const mode = normalizeImageMode(component);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [message, setMessage] = useState('Choose an image. Processing stays in your browser.');

  function drawImage(image: HTMLImageElement) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isCropped = mode === 'crop';
    const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
    const sourceX = isCropped ? Math.round((image.naturalWidth - sourceSize) / 2) : 0;
    const sourceY = isCropped ? Math.round((image.naturalHeight - sourceSize) / 2) : 0;
    const sourceWidth = isCropped ? sourceSize : image.naturalWidth;
    const sourceHeight = isCropped ? sourceSize : image.naturalHeight;
    const targetWidth = mode === 'resizer' ? Math.min(800, sourceWidth) : sourceWidth;
    const targetHeight = mode === 'resizer' ? Math.round((targetWidth / sourceWidth) * sourceHeight) : sourceHeight;
    canvas.width = mode === 'rotate' ? targetHeight : targetWidth;
    canvas.height = mode === 'rotate' ? targetWidth : targetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mode === 'rotate') {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
    } else if (mode === 'flip') {
      ctx.translate(targetWidth, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);
    } else {
      ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);
    }

    if (['grayscale', 'brightness', 'contrast', 'saturation'].includes(mode)) {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < data.data.length; index += 4) {
        const r = data.data[index];
        const g = data.data[index + 1];
        const b = data.data[index + 2];
        const gray = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
        if (mode === 'grayscale') {
          data.data[index] = gray;
          data.data[index + 1] = gray;
          data.data[index + 2] = gray;
        } else if (mode === 'saturation') {
          data.data[index] = clamp(gray + (r - gray) * 1.45);
          data.data[index + 1] = clamp(gray + (g - gray) * 1.45);
          data.data[index + 2] = clamp(gray + (b - gray) * 1.45);
        } else {
          data.data[index] = applyImageAdjustment(r, mode);
          data.data[index + 1] = applyImageAdjustment(g, mode);
          data.data[index + 2] = applyImageAdjustment(b, mode);
        }
      }
      ctx.putImageData(data, 0, 0);
    }

    if (mode === 'watermark') {
      ctx.save();
      ctx.font = `${Math.max(18, Math.round(canvas.width / 22))}px sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,.82)';
      ctx.strokeStyle = 'rgba(15,23,42,.7)';
      ctx.lineWidth = 3;
      const text = 'TovolBox';
      const x = Math.max(16, canvas.width - ctx.measureText(text).width - 24);
      const y = Math.max(32, canvas.height - 24);
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
      ctx.restore();
    }

    setMessage(`${image.naturalWidth}x${image.naturalHeight} processed as ${canvas.width}x${canvas.height}.`);
  }

  function handleFile(file: File) {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      drawImage(image);
      URL.revokeObjectURL(url);
    };
    image.src = url;
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `tovolbox-${mode}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  return (
    <section className="card" style={{ padding: '1.25rem' }}>
      <h2 style={{ marginTop: 0 }}>Local image {mode}</h2>
      <p style={{ color: 'var(--muted)' }}>Your image is processed locally and is not uploaded.</p>
      <input className="input" type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && handleFile(event.target.files[0])} />
      <p>{message}</p>
      <canvas ref={canvasRef} style={{ maxWidth: '100%', border: '1px solid var(--border)', borderRadius: '1rem', background: 'white' }} />
      <div style={{ marginTop: '1rem' }}><button className="btn" type="button" onClick={download}>Download PNG</button></div>
    </section>
  );
}

function clamp(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}
