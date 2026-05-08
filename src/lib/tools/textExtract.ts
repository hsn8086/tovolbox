export type SortDirection = 'asc' | 'desc';

export interface FindAndReplaceOptions {
  caseSensitive?: boolean;
  wholeWord?: boolean;
}

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const URL_PATTERN = /\bhttps?:\/\/[^\s<>()"']+/gi;
const NUMBER_PATTERN = /[-+]?\d+(?:\.\d+)?/g;

function splitLines(input: string): string[] {
  return input.split(/\r?\n/);
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function extractEmails(input: string): string[] {
  return input.match(EMAIL_PATTERN) ?? [];
}

export function extractUrls(input: string): string[] {
  return (input.match(URL_PATTERN) ?? []).map((url) => url.replace(/[.,;:!?]+$/, ''));
}

export function extractNumbers(input: string): string[] {
  return input.match(NUMBER_PATTERN) ?? [];
}

export function removeEmptyLines(input: string): string {
  return splitLines(input)
    .filter((line) => line.trim().length > 0)
    .join('\n');
}

export function deduplicateLines(input: string): string {
  return Array.from(new Set(splitLines(input))).join('\n');
}

export function sortLines(input: string, direction: SortDirection = 'asc', caseSensitive = false): string {
  const sorted = splitLines(input).toSorted((left, right) =>
    left.localeCompare(right, undefined, { sensitivity: caseSensitive ? 'variant' : 'base' }),
  );

  return (direction === 'desc' ? sorted.reverse() : sorted).join('\n');
}

export function trimLines(input: string): string {
  return splitLines(input)
    .map((line) => line.trim())
    .join('\n');
}

export function findAndReplace(input: string, find: string, replaceWith: string, options: FindAndReplaceOptions = {}): string {
  if (find.length === 0) {
    return input;
  }

  const escapedFind = escapeRegExp(find);
  const pattern = options.wholeWord ? `\\b${escapedFind}\\b` : escapedFind;
  const flags = options.caseSensitive ? 'g' : 'gi';

  return input.replace(new RegExp(pattern, flags), replaceWith);
}
