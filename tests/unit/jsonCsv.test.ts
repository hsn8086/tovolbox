import { describe, expect, it } from 'vitest';
import { csvToJson, jsonToCsv } from '@/lib/tools/jsonCsv';

describe('JSON and CSV conversion', () => {
  it('converts an array of objects to CSV', () => {
    const result = jsonToCsv(
      JSON.stringify([
        { name: 'Ada', role: 'Engineer' },
        { name: 'Linus', role: 'Maintainer', project: 'Linux' },
      ]),
    );

    expect(result).toEqual({
      ok: true,
      output: 'name,role,project\nAda,Engineer,\nLinus,Maintainer,Linux',
    });
  });

  it('escapes CSV quotes, commas, and newlines from JSON values', () => {
    const result = jsonToCsv(JSON.stringify([{ title: 'Hello, "world"', notes: 'first\nsecond' }]));

    expect(result).toEqual({
      ok: true,
      output: 'title,notes\n"Hello, ""world""","first\nsecond"',
    });
  });

  it('converts CSV to JSON', () => {
    const result = csvToJson('name,role\nAda,Engineer\nLinus,Maintainer');

    expect(result.ok).toBe(true);
    expect(result.output).toBe(
      JSON.stringify(
        [
          { name: 'Ada', role: 'Engineer' },
          { name: 'Linus', role: 'Maintainer' },
        ],
        null,
        2,
      ),
    );
  });

  it('parses quoted CSV fields with commas, quotes, and newlines', () => {
    const result = csvToJson('name,notes\nAda,"Hello, ""world"""\nLinus,"line one\nline two"');

    expect(result.ok).toBe(true);
    expect(JSON.parse(result.output)).toEqual([
      { name: 'Ada', notes: 'Hello, "world"' },
      { name: 'Linus', notes: 'line one\nline two' },
    ]);
  });

  it('returns an error for invalid JSON', () => {
    const result = jsonToCsv('{bad json');

    if (result.ok) throw new Error('Expected invalid JSON to fail');
    expect(result.output).toBe('');
    expect(result.error).toBeTruthy();
  });

  it('returns an error when JSON is not an array of objects', () => {
    expect(jsonToCsv(JSON.stringify({ name: 'Ada' }))).toEqual({
      ok: false,
      output: '',
      error: 'JSON input must be an array of objects',
    });
    expect(jsonToCsv(JSON.stringify([{ name: 'Ada' }, null]))).toEqual({
      ok: false,
      output: '',
      error: 'JSON array must contain only objects',
    });
  });

  it('returns an error for malformed CSV quotes', () => {
    const result = csvToJson('name,notes\nAda,"unterminated');

    expect(result).toEqual({
      ok: false,
      output: '',
      error: 'Unclosed quoted CSV field',
    });
  });

  it('returns an error for inconsistent CSV row lengths', () => {
    const result = csvToJson('name,role\nAda');

    expect(result).toEqual({
      ok: false,
      output: '',
      error: 'CSV row 2 has 1 fields; expected 2',
    });
  });
});
