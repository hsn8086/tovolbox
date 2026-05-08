export type SortDirection = 'asc' | 'desc';

export interface FindAndReplaceOptions {
  caseSensitive?: boolean;
  wholeWord?: boolean;
}

export type LineDiffPart = {
  type: 'same' | 'removed' | 'added';
  text: string;
};

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

export function diffLines(original: string, changed: string): LineDiffPart[] {
  const left = splitLines(original);
  const right = splitLines(changed);
  const table = Array.from({ length: left.length + 1 }, () => Array<number>(right.length + 1).fill(0));

  for (let leftIndex = left.length - 1; leftIndex >= 0; leftIndex -= 1) {
    for (let rightIndex = right.length - 1; rightIndex >= 0; rightIndex -= 1) {
      table[leftIndex][rightIndex] = left[leftIndex] === right[rightIndex]
        ? table[leftIndex + 1][rightIndex + 1] + 1
        : Math.max(table[leftIndex + 1][rightIndex], table[leftIndex][rightIndex + 1]);
    }
  }

  const parts: LineDiffPart[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] === right[rightIndex]) {
      parts.push({ type: 'same', text: left[leftIndex] });
      leftIndex += 1;
      rightIndex += 1;
    } else if (table[leftIndex + 1][rightIndex] >= table[leftIndex][rightIndex + 1]) {
      parts.push({ type: 'removed', text: left[leftIndex] });
      leftIndex += 1;
    } else {
      parts.push({ type: 'added', text: right[rightIndex] });
      rightIndex += 1;
    }
  }

  while (leftIndex < left.length) {
    parts.push({ type: 'removed', text: left[leftIndex] });
    leftIndex += 1;
  }

  while (rightIndex < right.length) {
    parts.push({ type: 'added', text: right[rightIndex] });
    rightIndex += 1;
  }

  return parts;
}

export function formatLineDiff(original: string, changed: string): string {
  return diffLines(original, changed)
    .map((part) => `${part.type === 'same' ? ' ' : part.type === 'removed' ? '-' : '+'} ${part.text}`)
    .join('\n');
}

const loremSentences = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
];

export function generateLoremIpsum(paragraphCount = 3, sentencesPerParagraph = 4): string {
  const safeParagraphCount = Math.min(Math.max(Math.trunc(paragraphCount) || 1, 1), 20);
  const safeSentencesPerParagraph = Math.min(Math.max(Math.trunc(sentencesPerParagraph) || 1, 1), 10);

  return Array.from({ length: safeParagraphCount }, (_, paragraphIndex) =>
    Array.from({ length: safeSentencesPerParagraph }, (_, sentenceIndex) => loremSentences[(paragraphIndex + sentenceIndex) % loremSentences.length]).join(' '),
  ).join('\n\n');
}
