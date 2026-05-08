export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-512';

const toHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

export async function hashText(input: string, algorithm: HashAlgorithm): Promise<string> {
  if (globalThis.crypto?.subtle) {
    const data = new TextEncoder().encode(input);
    const digest = await globalThis.crypto.subtle.digest(algorithm, data);

    return toHex(new Uint8Array(digest));
  }

  const { createHash } = await import('node:crypto');

  return createHash(algorithm.toLowerCase().replace('-', '')).update(input, 'utf8').digest('hex');
}
