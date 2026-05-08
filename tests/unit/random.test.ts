import { describe, expect, it } from 'vitest';
import { estimatePasswordEntropy, generatePassword, generateRandomString } from '@/lib/tools/random';

describe('random tools', () => {
  it('generates deterministic strings with injected rng', () => {
    expect(generateRandomString(4, 'ab', () => 0)).toBe('aaaa');
  });

  it('includes required password character sets', () => {
    const password = generatePassword({ length: 12, symbols: true, rng: () => 0.1 });
    expect(password).toHaveLength(12);
    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[a-z]/);
    expect(password).toMatch(/\d/);
    expect(password).toMatch(/[!@#$%^&*()\-_=+\[\]{};:,.?]/);
  });

  it('estimates entropy', () => {
    expect(estimatePasswordEntropy('abcABC123')).toBeGreaterThan(40);
  });
});
