export type LengthUnit = 'mm' | 'cm' | 'm' | 'km' | 'in' | 'ft' | 'yd' | 'mi';
export type WeightUnit = 'mg' | 'g' | 'kg' | 'oz' | 'lb' | 'st' | 't';
export type TemperatureUnit = 'c' | 'f' | 'k';
export type DataSizeUnit = 'bit' | 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'KiB' | 'MiB' | 'GiB' | 'TiB';

const lengthInMeters: Record<LengthUnit, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1_000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1_609.344,
};

const weightInGrams: Record<WeightUnit, number> = {
  mg: 0.001,
  g: 1,
  kg: 1_000,
  oz: 28.349523125,
  lb: 453.59237,
  st: 6_350.29318,
  t: 1_000_000,
};

const dataSizeInBits: Record<DataSizeUnit, number> = {
  bit: 1,
  B: 8,
  KB: 8_000,
  MB: 8_000_000,
  GB: 8_000_000_000,
  TB: 8_000_000_000_000,
  KiB: 8_192,
  MiB: 8_388_608,
  GiB: 8_589_934_592,
  TiB: 8_796_093_022_208,
};

export function convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
  assertFiniteNumber(value);
  return (value * lengthInMeters[from]) / lengthInMeters[to];
}

export function convertWeight(value: number, from: WeightUnit, to: WeightUnit): number {
  assertFiniteNumber(value);
  return (value * weightInGrams[from]) / weightInGrams[to];
}

export function convertTemperature(value: number, from: TemperatureUnit, to: TemperatureUnit): number {
  assertFiniteNumber(value);

  const celsius = toCelsius(value, from);
  if (to === 'c') return celsius;
  if (to === 'f') return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

export function convertDataSize(value: number, from: DataSizeUnit, to: DataSizeUnit): number {
  assertFiniteNumber(value);
  return (value * dataSizeInBits[from]) / dataSizeInBits[to];
}

function toCelsius(value: number, unit: TemperatureUnit): number {
  if (unit === 'c') return value;
  if (unit === 'f') return ((value - 32) * 5) / 9;
  return value - 273.15;
}

function assertFiniteNumber(value: number): void {
  if (!Number.isFinite(value)) {
    throw new RangeError('Value must be a finite number.');
  }
}
