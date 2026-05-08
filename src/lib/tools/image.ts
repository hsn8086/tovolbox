export function aspectRatio(width: number, height: number): string {
  if (width <= 0 || height <= 0) return 'unknown';
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

export type ResizeFit = 'contain' | 'cover' | 'stretch';

export type ImageDimensions = {
  width: number;
  height: number;
};

export type CropRect = ImageDimensions & {
  x: number;
  y: number;
};

export function calculateResizeDimensions(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  fit: ResizeFit = 'contain',
): ImageDimensions {
  assertPositiveFinite(sourceWidth, 'sourceWidth');
  assertPositiveFinite(sourceHeight, 'sourceHeight');
  assertPositiveFinite(targetWidth, 'targetWidth');
  assertPositiveFinite(targetHeight, 'targetHeight');

  if (fit === 'stretch') {
    return { width: Math.round(targetWidth), height: Math.round(targetHeight) };
  }

  const scale = fit === 'cover' ? Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight) : Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);

  return {
    width: Math.round(sourceWidth * scale),
    height: Math.round(sourceHeight * scale),
  };
}

export function calculateCropRect(sourceWidth: number, sourceHeight: number, targetAspectRatio: number): CropRect {
  assertPositiveFinite(sourceWidth, 'sourceWidth');
  assertPositiveFinite(sourceHeight, 'sourceHeight');
  assertPositiveFinite(targetAspectRatio, 'targetAspectRatio');

  const sourceAspectRatio = sourceWidth / sourceHeight;

  if (sourceAspectRatio > targetAspectRatio) {
    const width = Math.round(sourceHeight * targetAspectRatio);
    return {
      x: Math.round((sourceWidth - width) / 2),
      y: 0,
      width,
      height: sourceHeight,
    };
  }

  const height = Math.round(sourceWidth / targetAspectRatio);
  return {
    x: 0,
    y: Math.round((sourceHeight - height) / 2),
    width: sourceWidth,
    height,
  };
}

export function normalizeRotation(degrees: number): number {
  if (!Number.isFinite(degrees)) {
    throw new RangeError('degrees must be finite');
  }

  return ((degrees % 360) + 360) % 360;
}

export function imageMimeToExtension(mime: string): string {
  const normalizedMime = mime.trim().toLowerCase();

  switch (normalizedMime) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/gif':
      return 'gif';
    case 'image/svg+xml':
      return 'svg';
    case 'image/avif':
      return 'avif';
    case 'image/bmp':
      return 'bmp';
    default:
      return 'bin';
  }
}

export function estimateCompressedSize(originalBytes: number, quality: number, mime: string): number {
  assertNonNegativeFinite(originalBytes, 'originalBytes');
  assertQuality(quality);

  const normalizedMime = mime.trim().toLowerCase();
  const formatFactor = compressedFormatFactor(normalizedMime);
  const qualityFactor = 0.2 + quality * 0.8;

  return Math.max(0, Math.round(originalBytes * formatFactor * qualityFactor));
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function assertPositiveFinite(value: number, name: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive finite number`);
  }
}

function assertNonNegativeFinite(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative finite number`);
  }
}

function assertQuality(quality: number): void {
  if (!Number.isFinite(quality) || quality < 0 || quality > 1) {
    throw new RangeError('quality must be between 0 and 1');
  }
}

function compressedFormatFactor(mime: string): number {
  switch (mime) {
    case 'image/jpeg':
    case 'image/jpg':
      return 0.7;
    case 'image/webp':
      return 0.5;
    case 'image/avif':
      return 0.35;
    case 'image/png':
      return 0.85;
    default:
      return 0.75;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
