export type RgbColor = {
  r: number;
  g: number;
  b: number;
};

export type HslColor = {
  h: number;
  s: number;
  l: number;
};

export function hexToRgb(hex: string): RgbColor {
  const value = hex.trim();
  const match = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec(value);

  if (!match) {
    throw new Error('Invalid hex color');
  }

  const normalized = match[1].length === 3 ? match[1].replace(/./g, (char) => char + char) : match[1];
  const parsed = Number.parseInt(normalized, 16);

  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
}

export function rgbToHex(rgb: RgbColor): string {
  assertRgb(rgb);

  return `#${toHexChannel(rgb.r)}${toHexChannel(rgb.g)}${toHexChannel(rgb.b)}`;
}

export function rgbToHsl(rgb: RgbColor): HslColor {
  assertRgb(rgb);

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: round(lightness * 100) };
  }

  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue: number;

  if (max === r) {
    hue = (g - b) / delta + (g < b ? 6 : 0);
  } else if (max === g) {
    hue = (b - r) / delta + 2;
  } else {
    hue = (r - g) / delta + 4;
  }

  return {
    h: round(hue * 60),
    s: round(saturation * 100),
    l: round(lightness * 100),
  };
}

export function hslToRgb(hsl: HslColor): RgbColor {
  assertHsl(hsl);

  const hue = (((hsl.h % 360) + 360) % 360) / 360;
  const saturation = hsl.s / 100;
  const lightness = hsl.l / 100;

  if (saturation === 0) {
    const channel = Math.round(lightness * 255);
    return { r: channel, g: channel, b: channel };
  }

  const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;

  return {
    r: Math.round(hueToRgb(p, q, hue + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, hue) * 255),
    b: Math.round(hueToRgb(p, q, hue - 1 / 3) * 255),
  };
}

export function contrastRatio(foreground: RgbColor | string, background: RgbColor | string): number {
  const fg = typeof foreground === 'string' ? hexToRgb(foreground) : foreground;
  const bg = typeof background === 'string' ? hexToRgb(background) : background;
  assertRgb(fg);
  assertRgb(bg);

  const foregroundLuminance = relativeLuminance(fg);
  const backgroundLuminance = relativeLuminance(bg);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return round((lighter + 0.05) / (darker + 0.05));
}

function assertRgb(rgb: RgbColor): void {
  assertChannel(rgb.r, 'r');
  assertChannel(rgb.g, 'g');
  assertChannel(rgb.b, 'b');
}

function assertChannel(value: number, name: string): void {
  if (!Number.isInteger(value) || value < 0 || value > 255) {
    throw new RangeError(`Invalid RGB channel: ${name}`);
  }
}

function assertHsl(hsl: HslColor): void {
  if (!Number.isFinite(hsl.h)) {
    throw new RangeError('Invalid HSL hue');
  }

  if (!Number.isFinite(hsl.s) || hsl.s < 0 || hsl.s > 100) {
    throw new RangeError('Invalid HSL saturation');
  }

  if (!Number.isFinite(hsl.l) || hsl.l < 0 || hsl.l > 100) {
    throw new RangeError('Invalid HSL lightness');
  }
}

function toHexChannel(value: number): string {
  return value.toString(16).padStart(2, '0');
}

function hueToRgb(p: number, q: number, t: number): number {
  let hue = t;

  if (hue < 0) hue += 1;
  if (hue > 1) hue -= 1;
  if (hue < 1 / 6) return p + (q - p) * 6 * hue;
  if (hue < 1 / 2) return q;
  if (hue < 2 / 3) return p + (q - p) * (2 / 3 - hue) * 6;

  return p;
}

function relativeLuminance(rgb: RgbColor): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
