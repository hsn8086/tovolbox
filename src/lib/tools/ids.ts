const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ULID_REGEX = /^[01234567][0123456789ABCDEFGHJKMNPQRSTVWXYZ]{25}$/;
const ULID_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const MAX_ULID_TIME = 2 ** 48 - 1;

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  const cryptoApi = globalThis.crypto;

  if (cryptoApi?.getRandomValues) {
    cryptoApi.getRandomValues(bytes);
    return bytes;
  }

  if (typeof require === 'function') {
    try {
      const nodeCrypto = require('node:crypto') as { randomFillSync?: (buffer: Uint8Array) => Uint8Array };
      if (nodeCrypto.randomFillSync) return nodeCrypto.randomFillSync(bytes);
    } catch {
      // Fall through to the last-resort random source below.
    }
  }

  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Math.floor(Math.random() * 256);
  }

  return bytes;
}

function encodeUlidTime(time: number): string {
  let value = Math.floor(time);
  let output = '';

  for (let index = 9; index >= 0; index -= 1) {
    output = ULID_ALPHABET[value % 32] + output;
    value = Math.floor(value / 32);
  }

  return output;
}

function encodeUlidRandom(bytes: Uint8Array): string {
  let value = 0n;

  for (const byte of bytes) {
    value = (value << 8n) | BigInt(byte);
  }

  let output = '';
  for (let index = 0; index < 16; index += 1) {
    output = ULID_ALPHABET[Number(value & 31n)] + output;
    value >>= 5n;
  }

  return output;
}

export function generateUuidV4(): string {
  const bytes = randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function isUuidV4(input: string): boolean {
  return UUID_V4_REGEX.test(input);
}

export function generateUlid(now = Date.now()): string {
  if (!Number.isFinite(now) || now < 0 || now > MAX_ULID_TIME) {
    throw new RangeError('ULID timestamp must be between 0 and 2^48 - 1 milliseconds.');
  }

  return encodeUlidTime(now) + encodeUlidRandom(randomBytes(10));
}

export function isUlid(input: string): boolean {
  return ULID_REGEX.test(input);
}
