export type JsonCsvResult =
  | {
      ok: true;
      output: string;
    }
  | {
      ok: false;
      output: '';
      error: string;
    };

type CsvRecord = Record<string, string>;

export type Delimiter = ',' | ';' | '\t' | '|';

function failure(error: string): JsonCsvResult {
  return { ok: false, output: '', error };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringifyCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeCsvCell(value: string, delimiter: Delimiter = ','): string {
  if (!new RegExp(`["\r\n${escapeRegExp(delimiter)}]`).test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

function parseDelimited(input: string, delimiter: Delimiter = ','): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;
  let cellStarted = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      if (cellStarted) throw new Error('Unexpected quote in unquoted CSV field');
      inQuotes = true;
      cellStarted = true;
      continue;
    }

    if (char === delimiter) {
      row.push(cell);
      cell = '';
      cellStarted = false;
      continue;
    }

    if (char === '\n' || char === '\r') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      cellStarted = false;
      if (char === '\r' && next === '\n') index += 1;
      continue;
    }

    cell += char;
    cellStarted = true;
  }

  if (inQuotes) throw new Error('Unclosed quoted CSV field');
  row.push(cell);
  rows.push(row);

  if (rows.length === 1 && rows[0]?.length === 1 && rows[0][0] === '') return [];
  return rows;
}

export function jsonToCsv(input: string): JsonCsvResult {
  try {
    const parsed: unknown = JSON.parse(input);
    if (!Array.isArray(parsed)) return failure('JSON input must be an array of objects');
    if (!parsed.every(isPlainObject)) return failure('JSON array must contain only objects');

    const headers = Array.from(new Set(parsed.flatMap((item) => Object.keys(item))));
    const rows = parsed.map((item) => headers.map((header) => escapeCsvCell(stringifyCell(item[header]))).join(','));

    return { ok: true, output: [headers.map((header) => escapeCsvCell(header)).join(','), ...rows].join('\n') };
  } catch (error) {
    return failure(error instanceof Error ? error.message : 'Invalid JSON');
  }
}

export function csvToJson(input: string): JsonCsvResult {
  try {
    const rows = parseDelimited(input);
    if (rows.length === 0) return failure('CSV input must include a header row');

    const [headers, ...dataRows] = rows;
    if (!headers || headers.length === 0 || headers.every((header) => header === '')) {
      return failure('CSV input must include a header row');
    }
    if (headers.some((header) => header === '')) return failure('CSV headers cannot be empty');
    if (new Set(headers).size !== headers.length) return failure('CSV headers must be unique');

    const records: CsvRecord[] = dataRows
      .filter((row) => !(row.length === 1 && row[0] === ''))
      .map((row, rowIndex) => {
        if (row.length !== headers.length) {
          throw new Error(`CSV row ${rowIndex + 2} has ${row.length} fields; expected ${headers.length}`);
        }

        return Object.fromEntries(headers.map((header, index) => [header, row[index] ?? '']));
      });

    return { ok: true, output: JSON.stringify(records, null, 2) };
  } catch (error) {
    return failure(error instanceof Error ? error.message : 'Invalid CSV');
  }
}

export function convertCsvDelimiter(input: string, fromDelimiter: Delimiter, toDelimiter: Delimiter): JsonCsvResult {
  try {
    const rows = parseDelimited(input, fromDelimiter);
    if (rows.length === 0) return failure('CSV input cannot be empty');

    return {
      ok: true,
      output: rows.map((row) => row.map((cell) => escapeCsvCell(cell, toDelimiter)).join(toDelimiter)).join('\n'),
    };
  } catch (error) {
    return failure(error instanceof Error ? error.message : 'Invalid CSV');
  }
}
