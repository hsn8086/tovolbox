export type BoxShadowOptions = {
  offsetX: number;
  offsetY: number;
  blurRadius?: number;
  spreadRadius?: number;
  color: string;
  inset?: boolean;
};

export type BorderRadiusValues = number | [number] | [number, number] | [number, number, number] | [number, number, number, number];

export type LinearGradientStop = {
  color: string;
  position?: number | string;
};

export type LinearGradientOptions = {
  direction?: string;
  stops: LinearGradientStop[];
};

export function generateClamp(minPx: number, maxPx: number, minViewportPx: number, maxViewportPx: number): string {
  assertFiniteNumber(minPx, 'minPx');
  assertFiniteNumber(maxPx, 'maxPx');
  assertPositiveNumber(minViewportPx, 'minViewportPx');
  assertPositiveNumber(maxViewportPx, 'maxViewportPx');

  if (maxPx < minPx) {
    throw new RangeError('maxPx must be greater than or equal to minPx.');
  }

  if (maxViewportPx <= minViewportPx) {
    throw new RangeError('maxViewportPx must be greater than minViewportPx.');
  }

  const slope = ((maxPx - minPx) / (maxViewportPx - minViewportPx)) * 100;
  const intercept = minPx - (slope * minViewportPx) / 100;
  const operator = intercept < 0 ? '-' : '+';

  return `clamp(${formatPx(minPx)}, calc(${formatNumber(slope)}vw ${operator} ${formatPx(Math.abs(intercept))}), ${formatPx(maxPx)})`;
}

export function generateBoxShadow(options: BoxShadowOptions): string {
  assertFiniteNumber(options.offsetX, 'offsetX');
  assertFiniteNumber(options.offsetY, 'offsetY');

  const blurRadius = options.blurRadius ?? 0;
  const spreadRadius = options.spreadRadius ?? 0;
  assertNonNegativeNumber(blurRadius, 'blurRadius');
  assertFiniteNumber(spreadRadius, 'spreadRadius');
  assertNonEmptyString(options.color, 'color');

  const parts = [formatPx(options.offsetX), formatPx(options.offsetY), formatPx(blurRadius), formatPx(spreadRadius), options.color.trim()];

  return options.inset ? `inset ${parts.join(' ')}` : parts.join(' ');
}

export function generateBorderRadius(values: BorderRadiusValues): string {
  const radii = Array.isArray(values) ? values : [values];

  if (radii.length < 1 || radii.length > 4) {
    throw new RangeError('Border radius must include between 1 and 4 values.');
  }

  for (const [index, value] of radii.entries()) {
    assertNonNegativeNumber(value, `values[${index}]`);
  }

  return radii.map(formatPx).join(' ');
}

export function generateLinearGradient(options: LinearGradientOptions): string {
  const direction = options.direction?.trim() || 'to bottom';
  assertNonEmptyString(direction, 'direction');

  if (options.stops.length < 2) {
    throw new RangeError('Linear gradient requires at least two color stops.');
  }

  const stops = options.stops.map((stop, index) => {
    assertNonEmptyString(stop.color, `stops[${index}].color`);

    if (stop.position === undefined) {
      return stop.color.trim();
    }

    if (typeof stop.position === 'number') {
      assertFiniteNumber(stop.position, `stops[${index}].position`);
      return `${stop.color.trim()} ${formatNumber(stop.position)}%`;
    }

    assertNonEmptyString(stop.position, `stops[${index}].position`);
    return `${stop.color.trim()} ${stop.position.trim()}`;
  });

  return `linear-gradient(${direction}, ${stops.join(', ')})`;
}

function assertFiniteNumber(value: number, name: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be a finite number.`);
  }
}

function assertPositiveNumber(value: number, name: string): void {
  assertFiniteNumber(value, name);

  if (value <= 0) {
    throw new RangeError(`${name} must be greater than 0.`);
  }
}

function assertNonNegativeNumber(value: number, name: string): void {
  assertFiniteNumber(value, name);

  if (value < 0) {
    throw new RangeError(`${name} must be greater than or equal to 0.`);
  }
}

function assertNonEmptyString(value: string, name: string): void {
  if (value.trim() === '') {
    throw new Error(`${name} must not be empty.`);
  }
}

function formatPx(value: number): string {
  return `${formatNumber(value)}px`;
}

function formatNumber(value: number): string {
  return Number.parseFloat(value.toFixed(4)).toString();
}
