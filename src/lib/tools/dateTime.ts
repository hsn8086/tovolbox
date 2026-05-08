const MILLISECONDS_PER_SECOND = 1000;
const MILLISECONDS_PER_MINUTE = 60 * MILLISECONDS_PER_SECOND;
const MILLISECONDS_PER_HOUR = 60 * MILLISECONDS_PER_MINUTE;
const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;
const UNIX_MILLISECONDS_THRESHOLD = 1_000_000_000_000;

export type DateDifference = {
  milliseconds: number;
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
};

function parseTimestamp(timestamp: number | string): number {
  const value = typeof timestamp === 'string' ? Number(timestamp.trim()) : timestamp;

  if (!Number.isFinite(value)) {
    throw new TypeError('Invalid Unix timestamp');
  }

  return Math.abs(value) < UNIX_MILLISECONDS_THRESHOLD ? value * MILLISECONDS_PER_SECOND : value;
}

function parseIsoDate(iso: string, fieldName: string): Date {
  const date = new Date(iso);

  if (!iso.trim() || Number.isNaN(date.getTime())) {
    throw new TypeError(`Invalid ${fieldName} date`);
  }

  return date;
}

export function unixToIso(timestamp: number | string): string {
  const date = new Date(parseTimestamp(timestamp));

  if (Number.isNaN(date.getTime())) {
    throw new TypeError('Invalid Unix timestamp');
  }

  return date.toISOString();
}

export function isoToUnix(iso: string): number {
  return Math.floor(parseIsoDate(iso, 'ISO').getTime() / MILLISECONDS_PER_SECOND);
}

export function dateDifference(start: string, end: string): DateDifference {
  const difference = parseIsoDate(end, 'end').getTime() - parseIsoDate(start, 'start').getTime();

  return {
    milliseconds: difference,
    seconds: difference / MILLISECONDS_PER_SECOND,
    minutes: difference / MILLISECONDS_PER_MINUTE,
    hours: difference / MILLISECONDS_PER_HOUR,
    days: difference / MILLISECONDS_PER_DAY,
  };
}
