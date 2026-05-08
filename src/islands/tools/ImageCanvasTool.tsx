import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, Dispatch, SetStateAction } from 'react';
import { calculateCropRect, calculateResizeDimensions, formatBytes, imageMimeToExtension, type ResizeFit } from '@/lib/tools/image';

type Props = {
  component: string;
};

export type ImageCanvasMode = 'inspect' | 'resizer' | 'crop' | 'grayscale' | 'rotate' | 'flip' | 'brightness' | 'contrast' | 'saturation' | 'watermark';
export type ImageOutputFormat = 'image/png' | 'image/jpeg' | 'image/webp';
export type WatermarkPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';

export type ImageCanvasSettings = {
  resizeWidth: number;
  resizeHeight: number;
  resizeKeepRatio: boolean;
  resizeFit: ResizeFit;
  cropRatio: '1:1' | '16:9' | '4:5' | '9:16' | 'custom';
  cropCustomWidth: number;
  cropCustomHeight: number;
  cropOffsetX: number;
  cropOffsetY: number;
  rotationDegrees: 0 | 90 | 180 | 270;
  flipAxis: 'horizontal' | 'vertical';
  brightness: number;
  contrast: number;
  saturation: number;
  watermarkText: string;
  watermarkPosition: WatermarkPosition;
  watermarkFontSize: number;
  watermarkColor: string;
  watermarkOpacity: number;
  outputFormat: ImageOutputFormat;
  outputQuality: number;
};

type ImageFileInfo = {
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
};

type ImageOutputInfo = {
  width: number;
  height: number;
  format: ImageOutputFormat;
  size: number;
};

const defaultSettings: ImageCanvasSettings = {
  resizeWidth: 800,
  resizeHeight: 800,
  resizeKeepRatio: true,
  resizeFit: 'contain',
  cropRatio: '1:1',
  cropCustomWidth: 1,
  cropCustomHeight: 1,
  cropOffsetX: 0,
  cropOffsetY: 0,
  rotationDegrees: 90,
  flipAxis: 'horizontal',
  brightness: 32,
  contrast: 1.28,
  saturation: 1.45,
  watermarkText: 'TovolBox',
  watermarkPosition: 'bottom-right',
  watermarkFontSize: 32,
  watermarkColor: '#ffffff',
  watermarkOpacity: 0.82,
  outputFormat: 'image/png',
  outputQuality: 0.92,
};

const outputFormats: ImageOutputFormat[] = ['image/png', 'image/jpeg', 'image/webp'];

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

export function cropRatioToNumber(ratio: ImageCanvasSettings['cropRatio'], customWidth = 1, customHeight = 1): number {
  if (ratio === '16:9') return 16 / 9;
  if (ratio === '4:5') return 4 / 5;
  if (ratio === '9:16') return 9 / 16;
  if (ratio === 'custom') return customWidth > 0 && customHeight > 0 ? customWidth / customHeight : 1;
  return 1;
}

export function outputFormatLabel(format: ImageOutputFormat): string {
  return format === 'image/jpeg' ? 'JPEG' : format === 'image/webp' ? 'WebP' : 'PNG';
}

export function imageOutputExtension(format: ImageOutputFormat): string {
  return format === 'image/jpeg' ? 'jpg' : imageMimeToExtension(format);
}

export function normalizeImageQuality(value: number): number {
  if (!Number.isFinite(value)) return defaultSettings.outputQuality;
  return Math.max(0.1, Math.min(1, value));
}

export function normalizeCropOffset(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(-100, Math.min(100, Math.round(value)));
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
  const [fileInfo, setFileInfo] = useState<ImageFileInfo | null>(null);
  const [outputInfo, setOutputInfo] = useState<ImageOutputInfo | null>(null);
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
    const crop = isCropped ? getCropRect(image.naturalWidth, image.naturalHeight, activeSettings) : null;
    const sourceX = crop?.x ?? 0;
    const sourceY = crop?.y ?? 0;
    const sourceWidth = crop?.width ?? image.naturalWidth;
    const sourceHeight = crop?.height ?? image.naturalHeight;
    const resize = mode === 'resizer' ? getResizeDimensions(sourceWidth, sourceHeight, activeSettings) : { width: sourceWidth, height: sourceHeight };
    const targetWidth = resize.width;
    const targetHeight = resize.height;
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
      ctx.font = `${activeSettings.watermarkFontSize}px sans-serif`;
      ctx.fillStyle = hexToRgba(activeSettings.watermarkColor, activeSettings.watermarkOpacity);
      ctx.strokeStyle = 'rgba(15,23,42,.7)';
      ctx.lineWidth = 3;
      const text = activeSettings.watermarkText.trim() || 'TovolBox';
      const { x, y } = getWatermarkPoint(ctx, text, canvas.width, canvas.height, activeSettings);
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
      ctx.restore();
    }

    setMessage(`${image.naturalWidth}x${image.naturalHeight} processed as ${canvas.width}x${canvas.height}.`);
    updateOutputInfo(canvas, activeSettings, setOutputInfo);
  }

  function handleFile(file: File) {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      imageRef.current = image;
      setFileInfo({ name: file.name, type: file.type || 'image/*', size: file.size, width: image.naturalWidth, height: image.naturalHeight });
      setHasImage(true);
      drawImage(image, settings);
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      setHasImage(false);
      setFileInfo(null);
      setOutputInfo(null);
      setMessage('Could not load this image. Try a PNG, JPEG, WebP, or GIF file.');
      URL.revokeObjectURL(url);
    };
    image.src = url;
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `tovolbox-${mode}.${imageOutputExtension(settings.outputFormat)}`;
    link.href = canvas.toDataURL(settings.outputFormat, settings.outputQuality);
    link.click();
  }

  return (
    <section className="card" style={{ padding: '1.25rem' }}>
      <h2 style={{ marginTop: 0 }}>Local image {mode}</h2>
      <p style={{ color: 'var(--muted)' }}>Your image is processed locally and is not uploaded.</p>
      <label htmlFor={fileInputId} style={{ display: 'block', fontWeight: 800, marginBottom: '.45rem' }}>Upload image</label>
      <input id={fileInputId} className="input" type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && handleFile(event.target.files[0])} />
      <ImageControls mode={mode} settings={settings} setSettings={setSettings} />
      <ImageOutputControls settings={settings} setSettings={setSettings} />
      <p>{message}</p>
      <ImageDetails fileInfo={fileInfo} outputInfo={outputInfo} />
      <canvas ref={canvasRef} style={{ maxWidth: '100%', border: '1px solid var(--border)', borderRadius: '1rem', background: 'white' }} />
      <div style={{ marginTop: '1rem' }}><button className="btn" type="button" onClick={download} disabled={!hasImage}>Download {outputFormatLabel(settings.outputFormat)}</button></div>
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
        <label style={controlLabelStyle}>Target width
          <input className="input" type="number" min="64" max="4096" value={settings.resizeWidth} onChange={(event) => update({ resizeWidth: normalizeResizeWidth(event.target.valueAsNumber) })} />
        </label>
        <label style={controlLabelStyle}>Target height
          <input className="input" type="number" min="64" max="4096" value={settings.resizeHeight} onChange={(event) => update({ resizeHeight: normalizeResizeWidth(event.target.valueAsNumber) })} disabled={settings.resizeKeepRatio} />
        </label>
        <label style={{ ...controlLabelStyle, display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" checked={settings.resizeKeepRatio} onChange={(event) => update({ resizeKeepRatio: event.target.checked })} /> Keep aspect ratio
        </label>
        {!settings.resizeKeepRatio && (
          <label style={controlLabelStyle}>Fit mode
            <select className="input" value={settings.resizeFit} onChange={(event) => update({ resizeFit: event.target.value as ResizeFit })}>
              <option value="contain">Contain</option>
              <option value="cover">Cover</option>
              <option value="stretch">Stretch</option>
            </select>
          </label>
        )}
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
            <option value="custom">Custom</option>
          </select>
        </label>
        {settings.cropRatio === 'custom' && (
          <>
            <label style={controlLabelStyle}>Custom ratio width
              <input className="input" type="number" min="1" max="100" value={settings.cropCustomWidth} onChange={(event) => update({ cropCustomWidth: normalizePositiveNumber(event.target.valueAsNumber, 1) })} />
            </label>
            <label style={controlLabelStyle}>Custom ratio height
              <input className="input" type="number" min="1" max="100" value={settings.cropCustomHeight} onChange={(event) => update({ cropCustomHeight: normalizePositiveNumber(event.target.valueAsNumber, 1) })} />
            </label>
          </>
        )}
        <SliderControl label="Crop horizontal offset" min={-100} max={100} step={1} value={settings.cropOffsetX} display={`${settings.cropOffsetX}%`} onChange={(cropOffsetX) => update({ cropOffsetX: normalizeCropOffset(cropOffsetX) })} />
        <SliderControl label="Crop vertical offset" min={-100} max={100} step={1} value={settings.cropOffsetY} display={`${settings.cropOffsetY}%`} onChange={(cropOffsetY) => update({ cropOffsetY: normalizeCropOffset(cropOffsetY) })} />
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
        <label style={controlLabelStyle}>Watermark position
          <select className="input" value={settings.watermarkPosition} onChange={(event) => update({ watermarkPosition: event.target.value as WatermarkPosition })}>
            <option value="bottom-right">Bottom right</option>
            <option value="bottom-left">Bottom left</option>
            <option value="top-right">Top right</option>
            <option value="top-left">Top left</option>
            <option value="center">Center</option>
          </select>
        </label>
        <label style={controlLabelStyle}>Font size
          <input className="input" type="number" min="12" max="160" value={settings.watermarkFontSize} onChange={(event) => update({ watermarkFontSize: normalizeWatermarkFontSize(event.target.valueAsNumber) })} />
        </label>
        <label style={controlLabelStyle}>Watermark color
          <input className="input" type="color" value={settings.watermarkColor} onChange={(event) => update({ watermarkColor: event.target.value })} />
        </label>
        <SliderControl label="Watermark opacity" min={0.1} max={1} step={0.05} value={settings.watermarkOpacity} display={`${Math.round(settings.watermarkOpacity * 100)}%`} onChange={(watermarkOpacity) => update({ watermarkOpacity: normalizeImageQuality(watermarkOpacity) })} />
      </div>
    );
  }

  return null;
}

function ImageOutputControls({ settings, setSettings }: {
  settings: ImageCanvasSettings;
  setSettings: Dispatch<SetStateAction<ImageCanvasSettings>>;
}) {
  function update(next: Partial<ImageCanvasSettings>) {
    setSettings((current) => ({ ...current, ...next }));
  }

  return (
    <div style={controlGroupStyle}>
      <label style={controlLabelStyle}>Output format
        <select className="input" value={settings.outputFormat} onChange={(event) => update({ outputFormat: event.target.value as ImageOutputFormat })}>
          {outputFormats.map((format) => <option key={format} value={format}>{outputFormatLabel(format)}</option>)}
        </select>
      </label>
      {settings.outputFormat !== 'image/png' && (
        <SliderControl label="Quality" min={0.1} max={1} step={0.01} value={settings.outputQuality} display={`${Math.round(settings.outputQuality * 100)}%`} onChange={(outputQuality) => update({ outputQuality: normalizeImageQuality(outputQuality) })} />
      )}
    </div>
  );
}

function ImageDetails({ fileInfo, outputInfo }: { fileInfo: ImageFileInfo | null; outputInfo: ImageOutputInfo | null }) {
  if (!fileInfo) return null;
  return (
    <div style={{ color: 'var(--muted)', display: 'grid', gap: '.25rem', marginBottom: '1rem' }} aria-live="polite">
      <p style={{ margin: 0 }}><strong>Source:</strong> {fileInfo.name} · {fileInfo.type} · {formatBytes(fileInfo.size)} · {fileInfo.width}x{fileInfo.height}</p>
      {outputInfo && <p style={{ margin: 0 }}><strong>Output:</strong> {outputInfo.width}x{outputInfo.height} · {outputFormatLabel(outputInfo.format)} · about {formatBytes(outputInfo.size)}</p>}
    </div>
  );
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

function getResizeDimensions(sourceWidth: number, sourceHeight: number, settings: ImageCanvasSettings) {
  if (settings.resizeKeepRatio) {
    const width = normalizeResizeWidth(settings.resizeWidth);
    return { width, height: Math.max(1, Math.round((width / sourceWidth) * sourceHeight)) };
  }

  return calculateResizeDimensions(sourceWidth, sourceHeight, normalizeResizeWidth(settings.resizeWidth), normalizeResizeWidth(settings.resizeHeight), settings.resizeFit);
}

function getCropRect(sourceWidth: number, sourceHeight: number, settings: ImageCanvasSettings) {
  const rect = calculateCropRect(sourceWidth, sourceHeight, cropRatioToNumber(settings.cropRatio, settings.cropCustomWidth, settings.cropCustomHeight));
  const freeX = sourceWidth - rect.width;
  const freeY = sourceHeight - rect.height;
  return {
    ...rect,
    x: clampRange(rect.x + Math.round((settings.cropOffsetX / 100) * (freeX / 2)), 0, freeX),
    y: clampRange(rect.y + Math.round((settings.cropOffsetY / 100) * (freeY / 2)), 0, freeY),
  };
}

function updateOutputInfo(canvas: HTMLCanvasElement, settings: ImageCanvasSettings, setOutputInfo: Dispatch<SetStateAction<ImageOutputInfo | null>>) {
  const next = { width: canvas.width, height: canvas.height, format: settings.outputFormat };
  canvas.toBlob((blob) => {
    const size = blob?.size ?? estimateDataUrlBytes(canvas.toDataURL(settings.outputFormat, settings.outputQuality));
    setOutputInfo({ ...next, size });
  }, settings.outputFormat, settings.outputQuality);
}

function estimateDataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] ?? '';
  return Math.max(0, Math.round((base64.length * 3) / 4));
}

function getWatermarkPoint(ctx: CanvasRenderingContext2D, text: string, width: number, height: number, settings: ImageCanvasSettings) {
  const padding = Math.max(12, Math.round(settings.watermarkFontSize * 0.75));
  const textWidth = ctx.measureText(text).width;
  const textHeight = settings.watermarkFontSize;
  if (settings.watermarkPosition === 'bottom-left') return { x: padding, y: height - padding };
  if (settings.watermarkPosition === 'top-right') return { x: Math.max(padding, width - textWidth - padding), y: padding + textHeight };
  if (settings.watermarkPosition === 'top-left') return { x: padding, y: padding + textHeight };
  if (settings.watermarkPosition === 'center') return { x: Math.max(padding, (width - textWidth) / 2), y: Math.max(textHeight, (height + textHeight) / 2) };
  return { x: Math.max(padding, width - textWidth - padding), y: height - padding };
}

function hexToRgba(hex: string, opacity: number): string {
  const normalized = /^#[\da-f]{6}$/i.test(hex) ? hex.slice(1) : 'ffffff';
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${normalizeImageQuality(opacity)})`;
}

function normalizeResizeWidth(value: number): number {
  if (!Number.isFinite(value)) return defaultSettings.resizeWidth;
  return Math.max(64, Math.min(4096, Math.round(value)));
}

function normalizePositiveNumber(value: number, fallback: number): number {
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return Math.round(value * 100) / 100;
}

function normalizeWatermarkFontSize(value: number): number {
  if (!Number.isFinite(value)) return defaultSettings.watermarkFontSize;
  return Math.max(12, Math.min(160, Math.round(value)));
}

function clampRange(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

const controlGroupStyle: CSSProperties = { margin: '1rem 0', display: 'grid', gap: '.75rem' };
const controlLabelStyle: CSSProperties = { display: 'grid', gap: '.45rem', fontWeight: 800 };

function clamp(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}
