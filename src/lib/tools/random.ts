export type PasswordOptions = {
  length: number;
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
  rng?: () => number;
};

const sets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?',
};

export function generateRandomString(length: number, alphabet = sets.uppercase + sets.lowercase + sets.numbers, rng = secureRandom): string {
  if (!Number.isInteger(length) || length < 0) throw new RangeError('Length must be a non-negative integer.');
  if (!alphabet) throw new Error('Alphabet must not be empty.');

  return Array.from({ length }, () => alphabet[Math.floor(rng() * alphabet.length)]).join('');
}

export function generatePassword(options: PasswordOptions): string {
  const groups = [
    options.uppercase !== false ? sets.uppercase : '',
    options.lowercase !== false ? sets.lowercase : '',
    options.numbers !== false ? sets.numbers : '',
    options.symbols ? sets.symbols : '',
  ].filter(Boolean);

  if (!Number.isInteger(options.length) || options.length < groups.length) {
    throw new RangeError('Password length is too short for selected character sets.');
  }

  if (groups.length === 0) throw new Error('Select at least one character set.');

  const rng = options.rng ?? secureRandom;
  const alphabet = groups.join('');
  const required = groups.map((group) => group[Math.floor(rng() * group.length)]);
  const remaining = Array.from({ length: options.length - required.length }, () => alphabet[Math.floor(rng() * alphabet.length)]);

  return shuffle([...required, ...remaining], rng).join('');
}

export function estimatePasswordEntropy(password: string): number {
  let alphabetSize = 0;
  if (/[A-Z]/.test(password)) alphabetSize += sets.uppercase.length;
  if (/[a-z]/.test(password)) alphabetSize += sets.lowercase.length;
  if (/\d/.test(password)) alphabetSize += sets.numbers.length;
  if (new RegExp(`[${escapeRegex(sets.symbols)}]`).test(password)) alphabetSize += sets.symbols.length;
  return alphabetSize === 0 ? 0 : Math.round(password.length * Math.log2(alphabetSize) * 100) / 100;
}

function secureRandom(): number {
  const cryptoObject = globalThis.crypto;
  if (cryptoObject?.getRandomValues) {
    const value = new Uint32Array(1);
    cryptoObject.getRandomValues(value);
    return value[0] / 2 ** 32;
  }
  return Math.random();
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
