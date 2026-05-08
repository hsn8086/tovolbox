import { describe, expect, it } from 'vitest';
import {
  buildMailtoPayload,
  buildVCardPayload,
  buildWifiQrPayload,
  validateEan13,
} from '@/lib/tools/qr';

describe('buildWifiQrPayload', () => {
  it('escapes reserved WIFI QR characters', () => {
    expect(
      buildWifiQrPayload({
        ssid: 'Cafe;Main:2,4"GHz',
        password: 'pa;ss:wo,rd"\\',
        authType: 'WPA',
        hidden: true,
      }),
    ).toBe('WIFI:T:WPA;S:Cafe\\;Main\\:2\\,4\\"GHz;P:pa\\;ss\\:wo\\,rd\\"\\\\;H:true;;');
  });

  it('omits a password for open networks', () => {
    expect(buildWifiQrPayload({ ssid: 'Guest', authType: 'nopass' })).toBe('WIFI:T:nopass;S:Guest;;');
  });
});

describe('buildVCardPayload', () => {
  it('escapes vCard text values', () => {
    expect(
      buildVCardPayload({
        firstName: 'Ada;A',
        lastName: 'Love,lace',
        organization: 'Math\\Logic',
        note: 'Line 1\nLine 2',
      }),
    ).toBe(
      [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:Love\\,lace;Ada\\;A;;;',
        'FN:Ada\\;A Love\\,lace',
        'ORG:Math\\\\Logic',
        'NOTE:Line 1\\nLine 2',
        'END:VCARD',
      ].join('\n'),
    );
  });
});

describe('buildMailtoPayload', () => {
  it('builds an encoded mailto URI', () => {
    expect(
      buildMailtoPayload({
        to: 'hello@example.com',
        subject: 'Hi there',
        body: 'Line 1\nLine 2 & more',
        cc: 'copy@example.com',
      }),
    ).toBe(
      'mailto:hello@example.com?subject=Hi+there&body=Line+1%0ALine+2+%26+more&cc=copy%40example.com',
    );
  });
});

describe('validateEan13', () => {
  it('accepts valid check digits', () => {
    expect(validateEan13('4006381333931')).toBe(true);
    expect(validateEan13('5901234123457')).toBe(true);
  });

  it('rejects invalid check digits and malformed input', () => {
    expect(validateEan13('4006381333932')).toBe(false);
    expect(validateEan13('5901234123450')).toBe(false);
    expect(validateEan13('400638133393')).toBe(false);
    expect(validateEan13('400638133393x')).toBe(false);
  });
});
