export type FileSummaryInput = {
  name: string;
  size: number;
  type?: string;
};

export type FileNameParts = {
  base: string;
  extension: string;
};

const MIME_EXTENSIONS: Record<string, string> = {
  'application/json': 'json',
  'application/pdf': 'pdf',
  'application/zip': 'zip',
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/svg+xml': 'svg',
  'image/webp': 'webp',
  'text/css': 'css',
  'text/csv': 'csv',
  'text/html': 'html',
  'text/javascript': 'js',
  'text/markdown': 'md',
  'text/plain': 'txt',
};

export function splitFileName(filename: string): FileNameParts {
  const trimmed = filename.trim();
  const lastDot = trimmed.lastIndexOf('.');

  if (lastDot <= 0 || lastDot === trimmed.length - 1) {
    return { base: trimmed, extension: '' };
  }

  return {
    base: trimmed.slice(0, lastDot),
    extension: trimmed.slice(lastDot + 1).toLowerCase(),
  };
}

export function detectFileExtension(filename: string, mime?: string): string {
  const { extension } = splitFileName(filename);

  if (extension) {
    return extension;
  }

  const normalizedMime = mime?.trim().toLowerCase().split(';', 1)[0] ?? '';
  return MIME_EXTENSIONS[normalizedMime] ?? '';
}

export function sanitizeFilename(filename: string): string {
  const cleaned = filename
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/-+/g, '-')
    .replace(/[. ]+$/g, '');

  return cleaned || 'untitled';
}

export function estimateBase64Size(bytes: number): number {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return 0;
  }

  return Math.ceil(bytes / 3) * 4;
}

export function humanFileSummary({ name, size, type }: FileSummaryInput): string {
  const safeName = sanitizeFilename(name);
  const extension = detectFileExtension(safeName, type);
  const fileType = extension ? extension.toUpperCase() : type?.trim() || 'unknown type';

  return `${safeName} (${formatBytes(size)}, ${fileType})`;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  const rounded = Number.isInteger(value) ? value.toString() : value.toFixed(1);

  return `${rounded} ${units[exponent]}`;
}
