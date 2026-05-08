export type CronExplanation = {
  description: string;
  errors: string[];
};

type CronField = {
  name: string;
  label: string;
  everyLabel: string;
  unit: string;
  min: number;
  max: number;
};

type ParsedField = {
  phrase: string;
  errors: string[];
};

const fields: CronField[] = [
  { name: 'minute', label: 'minute', everyLabel: 'every minute', unit: 'minutes', min: 0, max: 59 },
  { name: 'hour', label: 'hour', everyLabel: 'every hour', unit: 'hours', min: 0, max: 23 },
  { name: 'day of month', label: 'day of the month', everyLabel: 'every day of the month', unit: 'days', min: 1, max: 31 },
  { name: 'month', label: 'month', everyLabel: 'every month', unit: 'months', min: 1, max: 12 },
  { name: 'day of week', label: 'day of the week', everyLabel: 'every day of the week', unit: 'days of the week', min: 0, max: 7 },
];

export function explainCron(expression: string): CronExplanation {
  const parts = expression.trim().split(/\s+/).filter(Boolean);

  if (parts.length !== fields.length) {
    return {
      description: 'Invalid cron expression.',
      errors: [`Expected 5 fields, received ${parts.length}.`],
    };
  }

  const parsed = parts.map((part, index) => parseField(part, fields[index]));
  const errors = parsed.flatMap((field) => field.errors);

  if (errors.length > 0) {
    return {
      description: 'Invalid cron expression.',
      errors,
    };
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parsed.map((field) => field.phrase);

  return {
    description: `Runs ${minute}, ${hour}, ${dayOfMonth}, ${month}, and ${dayOfWeek}.`,
    errors: [],
  };
}

function parseField(value: string, field: CronField): ParsedField {
  if (value === '*') {
    return { phrase: field.everyLabel, errors: [] };
  }

  if (value.startsWith('*/')) {
    return parseStep(value, field);
  }

  if (value.includes(',')) {
    return parseList(value, field);
  }

  if (value.includes('-')) {
    return parseRange(value, field);
  }

  return parseSingleNumber(value, field);
}

function parseStep(value: string, field: CronField): ParsedField {
  const step = value.slice(2);
  const number = parseInteger(step);

  if (number === null || number < 1 || number > field.max - field.min + 1) {
    return invalid(field, `Step must be between 1 and ${field.max - field.min + 1}.`);
  }

  return { phrase: `every ${number} ${field.unit}`, errors: [] };
}

function parseList(value: string, field: CronField): ParsedField {
  const items = value.split(',');

  if (items.some((item) => item === '')) {
    return invalid(field, 'List entries must not be empty.');
  }

  const numbers = items.map(parseInteger);

  if (numbers.some((number) => number === null || !isInRange(number, field))) {
    return invalid(field, `List values must be between ${field.min} and ${field.max}.`);
  }

  return { phrase: `at ${field.label}s ${joinValues(numbers.map(String))}`, errors: [] };
}

function parseRange(value: string, field: CronField): ParsedField {
  const [startValue, endValue, extra] = value.split('-');
  const start = parseInteger(startValue);
  const end = parseInteger(endValue);

  if (extra !== undefined || start === null || end === null) {
    return invalid(field, 'Range must use the a-b format.');
  }

  if (!isInRange(start, field) || !isInRange(end, field)) {
    return invalid(field, `Values must be between ${field.min} and ${field.max}.`);
  }

  if (start > end) {
    return invalid(field, 'Range start must be less than or equal to range end.');
  }

  return { phrase: `from ${field.label} ${start} through ${end}`, errors: [] };
}

function parseSingleNumber(value: string, field: CronField): ParsedField {
  const number = parseInteger(value);

  if (number === null || !isInRange(number, field)) {
    return invalid(field, `Value must be between ${field.min} and ${field.max}.`);
  }

  return { phrase: `at ${field.label} ${number}`, errors: [] };
}

function parseInteger(value: string): number | null {
  if (!/^\d+$/.test(value)) {
    return null;
  }

  return Number(value);
}

function isInRange(value: number, field: CronField): boolean {
  return value >= field.min && value <= field.max;
}

function invalid(field: CronField, reason: string): ParsedField {
  return { phrase: '', errors: [`Invalid ${field.name}: ${reason}`] };
}

function joinValues(values: string[]): string {
  if (values.length === 1) {
    return values[0];
  }

  return `${values.slice(0, -1).join(', ')} and ${values.at(-1)}`;
}
