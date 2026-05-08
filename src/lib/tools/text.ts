export type WordStats = {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingMinutes: number;
};

export function countWords(input: string): WordStats {
  const trimmed = input.trim();
  const wordMatches = trimmed.match(/[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)?/gu) ?? [];
  const sentences = trimmed ? (trimmed.match(/[^.!?。！？]+[.!?。！？]?/gu) ?? []).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0;

  return {
    words: wordMatches.length,
    characters: input.length,
    charactersNoSpaces: input.replace(/\s/g, '').length,
    sentences,
    paragraphs,
    readingMinutes: Math.max(1, Math.ceil(wordMatches.length / 220)),
  };
}

export function toTitleCase(input: string): string {
  return input.toLowerCase().replace(/\b[\p{L}\p{N}]/gu, (char) => char.toUpperCase());
}

export function toCamelCase(input: string): string {
  const words = input
    .trim()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);

  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      return index === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
}

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
