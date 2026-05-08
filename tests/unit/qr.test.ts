import { describe, expect, it } from 'vitest';
import {
  buildQrMatrix,
  buildMailtoPayload,
  buildVCardPayload,
  buildWifiQrPayload,
  qrMatrixToSvg,
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

describe('QR matrix helpers', () => {
  it('builds a QR matrix with a pluggable factory', () => {
    const matrix = buildQrMatrix('hello', () => ({
      modules: {
        size: 2,
        get: (row, col) => (row === col ? 1 : 0),
      },
    }));

    expect(matrix).toEqual({
      size: 2,
      cells: [
        [true, false],
        [false, true],
      ],
    });
  });

  it('renders matrix data as compact SVG path commands', () => {
    expect(qrMatrixToSvg({ size: 2, cells: [[true, false], [false, true]] }, 1)).toContain('M1 1h1v1h-1z M2 2h1v1h-1z');
  });

  it('rejects empty QR content', () => {
    expect(() => buildQrMatrix('', () => ({ modules: { size: 1, get: () => 1 } }))).toThrow(/cannot be empty/i);
  });
});
