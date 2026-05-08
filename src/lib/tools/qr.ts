export type WifiQrAuthType = 'WEP' | 'WPA' | 'nopass';

export interface WifiQrPayloadOptions {
  ssid: string;
  password?: string;
  authType?: WifiQrAuthType;
  hidden?: boolean;
}

export interface VCardPayloadOptions {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  organization?: string;
  title?: string;
  phone?: string;
  email?: string;
  url?: string;
  address?: string;
  note?: string;
}

export interface MailtoPayloadOptions {
  to: string;
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
}

const escapeWifiValue = (value: string): string => value.replace(/[\\;,:\"]/g, '\\$&');

const escapeVCardValue = (value: string): string =>
  value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

const hasValue = (value: string | undefined): value is string => value !== undefined && value.length > 0;

export function buildWifiQrPayload({
  ssid,
  password = '',
  authType = password.length > 0 ? 'WPA' : 'nopass',
  hidden = false,
}: WifiQrPayloadOptions): string {
  const parts = [`T:${authType}`, `S:${escapeWifiValue(ssid)}`];

  if (authType !== 'nopass' || password.length > 0) {
    parts.push(`P:${escapeWifiValue(password)}`);
  }

  if (hidden) {
    parts.push('H:true');
  }

  return `WIFI:${parts.join(';')};;`;
}

export function buildVCardPayload(options: VCardPayloadOptions): string {
  const name = [options.lastName ?? '', options.firstName ?? '', '', '', ''].map(escapeVCardValue).join(';');
  const fullName = options.fullName ?? [options.firstName, options.lastName].filter(hasValue).join(' ');
  const lines = ['BEGIN:VCARD', 'VERSION:3.0', `N:${name}`];

  if (hasValue(fullName)) {
    lines.push(`FN:${escapeVCardValue(fullName)}`);
  }

  const optionalLines: Array<[string, string | undefined]> = [
    ['ORG', options.organization],
    ['TITLE', options.title],
    ['TEL', options.phone],
    ['EMAIL', options.email],
    ['URL', options.url],
    ['ADR', options.address],
    ['NOTE', options.note],
  ];

  for (const [key, value] of optionalLines) {
    if (hasValue(value)) {
      lines.push(`${key}:${escapeVCardValue(value)}`);
    }
  }

  lines.push('END:VCARD');

  return lines.join('\n');
}

export function buildMailtoPayload({ to, subject, body, cc, bcc }: MailtoPayloadOptions): string {
  const params = new URLSearchParams();

  if (hasValue(subject)) {
    params.set('subject', subject);
  }

  if (hasValue(body)) {
    params.set('body', body);
  }

  if (hasValue(cc)) {
    params.set('cc', cc);
  }

  if (hasValue(bcc)) {
    params.set('bcc', bcc);
  }

  const query = params.toString();

  return query.length > 0 ? `mailto:${to}?${query}` : `mailto:${to}`;
}

export function validateEan13(value: string): boolean {
  if (!/^\d{13}$/.test(value)) {
    return false;
  }

  const digits = Array.from(value, Number);
  const checkDigit = digits[12];
  const sum = digits.slice(0, 12).reduce((total, digit, index) => {
    return total + digit * (index % 2 === 0 ? 1 : 3);
  }, 0);
  const expectedCheckDigit = (10 - (sum % 10)) % 10;

  return checkDigit === expectedCheckDigit;
}
