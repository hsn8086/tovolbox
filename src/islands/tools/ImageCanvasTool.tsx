import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, Dispatch, SetStateAction } from 'react';
import { calculateCropRect } from '@/lib/tools/image';

type Props = {
  component: string;
};

export type ImageCanvasMode = 'inspect' | 'resizer' | 'crop' | 'grayscale' | 'rotate' | 'flip' | 'brightness' | 'contrast' | 'saturation' | 'watermark';

export type ImageCanvasSettings = {
  resizeWidth: number;
  cropRatio: '1:1' | '16:9' | '4:5' | '9:16';
  rotationDegrees: 0 | 90 | 180 | 270;
  flipAxis: 'horizontal' | 'vertical';
  brightness: number;
  contrast: number;
  saturation: number;
  watermarkText: string;
};

const defaultSettings: ImageCanvasSettings = {
  resizeWidth: 800,
  cropRatio: '1:1',
  rotationDegrees: 90,
  flipAxis: 'horizontal',
  brightness: 32,
  contrast: 1.28,
  saturation: 1.45,
  watermarkText: 'TovolBox',
};

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

export function getDefaultImageSettings(): ImageCanvasSettings {
  return { ...defaultSettings };
}

export function cropRatioToNumber(ratio: ImageCanvasSettings['cropRatio']): number {
  if (ratio === '16:9') return 16 / 9;
  if (ratio === '4:5') return 4 / 5;
  if (ratio === '9:16') return 9 / 16;
  return 1;
}

export function applyImageAdjustment(value: number, mode: ImageCanvasMode, settings: Partial<ImageCanvasSettings> = {}): number {
  const merged = { ...defaultSettings, ...settings };
  if (mode === 'brightness') return clamp(value + merged.brightness);
  if (mode === 'contrast') return clamp((value - 128) * merged.contrast + 128);
  return clamp(value);
}

export function applySaturationChannel(value: number, gray: number, saturation: number): number {
  return clamp(gray + (value - gray) * saturation);
}

export default function ImageCanvasTool({ component }: Props) {
  const mode = normalizeImageMode(component);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputId = useId();
  const [settings, setSettings] = useState<ImageCanvasSettings>(() => getDefaultImageSettings());
  const [hasImage, setHasImage] = useState(false);
  const [message, setMessage] = useState('Choose an image. Processing stays in your browser.');

  useEffect(() => {
    if (imageRef.current) drawImage(imageRef.current, settings);
  }, [settings]);

  function drawImage(image: HTMLImageElement, activeSettings: ImageCanvasSettings) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isCropped = mode === 'crop';
    const crop = isCropped ? calculateCropRect(image.naturalWidth, image.naturalHeight, cropRatioToNumber(activeSettings.cropRatio)) : null;
    const sourceX = crop?.x ?? 0;
    const sourceY = crop?.y ?? 0;
    const sourceWidth = crop?.width ?? image.naturalWidth;
    const sourceHeight = crop?.height ?? image.naturalHeight;
    const targetWidth = mode === 'resizer' ? Math.min(activeSettings.resizeWidth, sourceWidth) : sourceWidth;
    const targetHeight = mode === 'resizer' ? Math.round((targetWidth / sourceWidth) * sourceHeight) : sourceHeight;
    const swapsRotation = mode === 'rotate' && activeSettings.rotationDegrees % 180 !== 0;
    canvas.width = swapsRotation ? targetHeight : targetWidth;
    canvas.height = swapsRotation ? targetWidth : targetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    applyCanvasTransform(ctx, mode, activeSettings, canvas.width, canvas.height);
    ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);
    ctx.restore();

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
          data.data[index] = applySaturationChannel(r, gray, activeSettings.saturation);
          data.data[index + 1] = applySaturationChannel(g, gray, activeSettings.saturation);
          data.data[index + 2] = applySaturationChannel(b, gray, activeSettings.saturation);
        } else {
          data.data[index] = applyImageAdjustment(r, mode, activeSettings);
          data.data[index + 1] = applyImageAdjustment(g, mode, activeSettings);
          data.data[index + 2] = applyImageAdjustment(b, mode, activeSettings);
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
      const text = activeSettings.watermarkText.trim() || 'TovolBox';
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
      imageRef.current = image;
      setHasImage(true);
      drawImage(image, settings);
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      setHasImage(false);
      setMessage('Could not load this image. Try a PNG, JPEG, WebP, or GIF file.');
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
      <label htmlFor={fileInputId} style={{ display: 'block', fontWeight: 800, marginBottom: '.45rem' }}>Upload image</label>
      <input id={fileInputId} className="input" type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && handleFile(event.target.files[0])} />
      <ImageControls mode={mode} settings={settings} setSettings={setSettings} />
      <p>{message}</p>
      <canvas ref={canvasRef} style={{ maxWidth: '100%', border: '1px solid var(--border)', borderRadius: '1rem', background: 'white' }} />
      <div style={{ marginTop: '1rem' }}><button className="btn" type="button" onClick={download} disabled={!hasImage}>Download PNG</button></div>
    </section>
  );
}

function ImageControls({ mode, settings, setSettings }: {
  mode: ImageCanvasMode;
  settings: ImageCanvasSettings;
  setSettings: Dispatch<SetStateAction<ImageCanvasSettings>>;
}) {
  function update(next: Partial<ImageCanvasSettings>) {
    setSettings((current) => ({ ...current, ...next }));
  }

  if (mode === 'resizer') {
    return (
      <div style={controlGroupStyle}>
        <label style={controlLabelStyle}>Max width
          <input className="input" type="number" min="64" max="4096" value={settings.resizeWidth} onChange={(event) => update({ resizeWidth: normalizeResizeWidth(event.target.valueAsNumber) })} />
        </label>
      </div>
    );
  }

  if (mode === 'crop') {
    return (
      <div style={controlGroupStyle}>
        <label style={controlLabelStyle}>Crop ratio
          <select className="input" value={settings.cropRatio} onChange={(event) => update({ cropRatio: event.target.value as ImageCanvasSettings['cropRatio'] })}>
            <option value="1:1">Square 1:1</option>
            <option value="16:9">Landscape 16:9</option>
            <option value="4:5">Portrait 4:5</option>
            <option value="9:16">Story 9:16</option>
          </select>
        </label>
      </div>
    );
  }

  if (mode === 'rotate') {
    return (
      <div style={controlGroupStyle}>
        <label style={controlLabelStyle}>Rotation
          <select className="input" value={settings.rotationDegrees} onChange={(event) => update({ rotationDegrees: Number(event.target.value) as ImageCanvasSettings['rotationDegrees'] })}>
            <option value="0">0 degrees</option>
            <option value="90">90 degrees</option>
            <option value="180">180 degrees</option>
            <option value="270">270 degrees</option>
          </select>
        </label>
      </div>
    );
  }

  if (mode === 'flip') {
    return (
      <div style={controlGroupStyle}>
        <label style={controlLabelStyle}>Flip axis
          <select className="input" value={settings.flipAxis} onChange={(event) => update({ flipAxis: event.target.value as ImageCanvasSettings['flipAxis'] })}>
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
        </label>
      </div>
    );
  }

  if (mode === 'brightness') {
    return <SliderControl label="Brightness" min={-100} max={100} step={1} value={settings.brightness} display={`${settings.brightness > 0 ? '+' : ''}${settings.brightness}`} onChange={(brightness) => update({ brightness })} />;
  }

  if (mode === 'contrast') {
    return <SliderControl label="Contrast" min={0.5} max={2} step={0.05} value={settings.contrast} display={`${Math.round(settings.contrast * 100)}%`} onChange={(contrast) => update({ contrast })} />;
  }

  if (mode === 'saturation') {
    return <SliderControl label="Saturation" min={0} max={2.5} step={0.05} value={settings.saturation} display={`${Math.round(settings.saturation * 100)}%`} onChange={(saturation) => update({ saturation })} />;
  }

  if (mode === 'watermark') {
    return (
      <div style={controlGroupStyle}>
        <label style={controlLabelStyle}>Watermark text
          <input className="input" value={settings.watermarkText} onChange={(event) => update({ watermarkText: event.target.value })} />
        </label>
      </div>
    );
  }

  return null;
}

function SliderControl({ label, min, max, step, value, display, onChange }: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: string;
  onChange: (value: number) => void;
}) {
  return (
    <div style={controlGroupStyle}>
      <label style={controlLabelStyle}>{label}: <span style={{ color: 'var(--muted)' }}>{display}</span>
        <input className="input" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(event.target.valueAsNumber)} />
      </label>
    </div>
  );
}

function applyCanvasTransform(ctx: CanvasRenderingContext2D, mode: ImageCanvasMode, settings: ImageCanvasSettings, width: number, height: number) {
  if (mode === 'rotate') {
    if (settings.rotationDegrees === 90) {
      ctx.translate(width, 0);
      ctx.rotate(Math.PI / 2);
    } else if (settings.rotationDegrees === 180) {
      ctx.translate(width, height);
      ctx.rotate(Math.PI);
    } else if (settings.rotationDegrees === 270) {
      ctx.translate(0, height);
      ctx.rotate(-Math.PI / 2);
    }
  } else if (mode === 'flip') {
    if (settings.flipAxis === 'vertical') {
      ctx.translate(0, height);
      ctx.scale(1, -1);
    } else {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
  }
}

function normalizeResizeWidth(value: number): number {
  if (!Number.isFinite(value)) return defaultSettings.resizeWidth;
  return Math.max(64, Math.min(4096, Math.round(value)));
}

const controlGroupStyle: CSSProperties = { margin: '1rem 0', display: 'grid', gap: '.75rem' };
const controlLabelStyle: CSSProperties = { display: 'grid', gap: '.45rem', fontWeight: 800 };

function clamp(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}
