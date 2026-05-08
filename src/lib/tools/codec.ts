export function encodeBase64(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64');
}

export function decodeBase64(input: string): string {
  return Buffer.from(input, 'base64').toString('utf8');
}

export function safeDecodeURIComponent(input: string): { ok: boolean; output: string; error?: string } {
  try {
    return { ok: true, output: decodeURIComponent(input) };
  } catch (error) {
    return { ok: false, output: '', error: error instanceof Error ? error.message : 'Invalid URL encoding' };
  }
}

export function decodeJwtPart(input: string): unknown {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
}

export function decodeJwt(token: string): { header: unknown; payload: unknown } {
  const [header, payload] = token.split('.');
  if (!header || !payload) throw new Error('JWT must contain header and payload parts.');
  return { header: decodeJwtPart(header), payload: decodeJwtPart(payload) };
}
