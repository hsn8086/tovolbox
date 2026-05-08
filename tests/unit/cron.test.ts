import { describe, expect, it } from 'vitest';
import { explainCron } from '@/lib/tools/cron';

describe('cron pure functions', () => {
  it('explains a wildcard cron expression', () => {
    expect(explainCron('* * * * *')).toEqual({
      description: 'Runs every minute, every hour, every day of the month, every month, and every day of the week.',
      errors: [],
    });
  });

  it('explains steps, ranges, lists, and single numbers', () => {
    expect(explainCron('*/15 9-17 1,15 * 1-5')).toEqual({
      description:
        'Runs every 15 minutes, from hour 9 through 17, at day of the months 1 and 15, every month, and from day of the week 1 through 5.',
      errors: [],
    });
  });

  it('explains a single scheduled time', () => {
    expect(explainCron('30 6 10 4 2')).toEqual({
      description: 'Runs at minute 30, at hour 6, at day of the month 10, at month 4, and at day of the week 2.',
      errors: [],
    });
  });

  it('returns an error for the wrong field count', () => {
    expect(explainCron('* * * *')).toEqual({
      description: 'Invalid cron expression.',
      errors: ['Expected 5 fields, received 4.'],
    });
  });

  it('returns validation errors for unsupported or out-of-range fields', () => {
    expect(explainCron('60 */0 0 13 8')).toEqual({
      description: 'Invalid cron expression.',
      errors: [
        'Invalid minute: Value must be between 0 and 59.',
        'Invalid hour: Step must be between 1 and 24.',
        'Invalid day of month: Value must be between 1 and 31.',
        'Invalid month: Value must be between 1 and 12.',
        'Invalid day of week: Value must be between 0 and 7.',
      ],
    });
  });

  it('returns validation errors for malformed ranges and lists', () => {
    expect(explainCron('10-5 1,,2 * * foo')).toEqual({
      description: 'Invalid cron expression.',
      errors: [
        'Invalid minute: Range start must be less than or equal to range end.',
        'Invalid hour: List entries must not be empty.',
        'Invalid day of week: Value must be between 0 and 7.',
      ],
    });
  });
});
