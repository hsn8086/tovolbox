export type RegexMatch = {
  value: string;
  index: number;
  groups: Array<string | undefined>;
  namedGroups: Record<string, string | undefined>;
};

export type RegexTestResult = {
  matches: RegexMatch[];
  groups: Array<Array<string | undefined>>;
  error?: string;
};

function scanFlags(flags: string): string {
  return flags.includes('g') ? flags : `${flags}g`;
}

function nextIndex(input: string, index: number, unicode: boolean): number {
  if (!unicode || index >= input.length) {
    return index + 1;
  }

  const first = input.charCodeAt(index);
  const second = input.charCodeAt(index + 1);
  const isSurrogatePair = first >= 0xd800 && first <= 0xdbff && second >= 0xdc00 && second <= 0xdfff;

  return index + (isSurrogatePair ? 2 : 1);
}

export function extractRegexMatches(pattern: string, flags: string, input: string): RegexMatch[] {
  const regex = new RegExp(pattern, scanFlags(flags));
  const matches: RegexMatch[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    matches.push({
      value: match[0],
      index: match.index,
      groups: match.slice(1),
      namedGroups: { ...(match.groups ?? {}) },
    });

    if (match[0] === '') {
      regex.lastIndex = nextIndex(input, regex.lastIndex, regex.unicode);
    }
  }

  return matches;
}

export function testRegex(pattern: string, flags: string, input: string): RegexTestResult {
  try {
    const matches = extractRegexMatches(pattern, flags, input);

    return {
      matches,
      groups: matches.map((match) => match.groups),
    };
  } catch (error) {
    return {
      matches: [],
      groups: [],
      error: error instanceof Error ? error.message : 'Invalid regular expression',
    };
  }
}
