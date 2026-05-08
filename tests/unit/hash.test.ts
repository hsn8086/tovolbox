import { describe, expect, it } from 'vitest';
import { hashText } from '@/lib/tools/hash';

describe('hashText', () => {
  it('hashes text with SHA-256', async () => {
    await expect(hashText('abc', 'SHA-256')).resolves.toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
  });

  it('does not expose MD5 as a supported algorithm', () => {
    type Algorithm = Parameters<typeof hashText>[1];

    expect(['SHA-1', 'SHA-256', 'SHA-512'] satisfies Algorithm[]).not.toContain('MD5');
  });
});
