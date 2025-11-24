import { TimestampToTimeIntervalPipe } from './timestamp-to-time-interval.pipe';

describe('TimestampToTimeIntervalPipe', () => {
  const pipe = new TimestampToTimeIntervalPipe();
  const FIXED_DATE = new Date('2025-11-24T12:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_DATE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms "" to ""', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('transforms the date to "just now"', () => {
    expect(pipe.transform('2025-11-24T11:59:55Z')).toBe('just now');
  });

  it('transforms the date to "1 minute"', () => {
    expect(pipe.transform('2025-11-24T11:58:55Z')).toBe('1 minute');
  });

  it('transforms the date to "2 minutes"', () => {
    expect(pipe.transform('2025-11-24T11:57:55Z')).toBe('2 minutes');
  });

  it('transforms the date to "1 hour"', () => {
    expect(pipe.transform('2025-11-24T10:59:55Z')).toBe('1 hour');
  });

  it('transforms the date to "2 hours"', () => {
    expect(pipe.transform('2025-11-24T09:59:55Z')).toBe('2 hours');
  });

  it('transforms the date to "1 day"', () => {
    expect(pipe.transform('2025-11-23T11:59:55Z')).toBe('1 day');
  });

  it('transforms the date to "2 days"', () => {
    expect(pipe.transform('2025-11-22T11:59:55Z')).toBe('2 days');
  });

  it('transforms the date to "1 month"', () => {
    expect(pipe.transform('2025-10-22T11:59:55Z')).toBe('1 month');
  });

  it('transforms the date to "2 months"', () => {
    expect(pipe.transform('2025-09-22T11:59:55Z')).toBe('2 months');
  });

  it('transforms the date to "1 year"', () => {
    expect(pipe.transform('2024-09-22T11:59:55Z')).toBe('1 year');
  });

  it('transforms the date to "2 years"', () => {
    expect(pipe.transform('2023-09-22T11:59:55Z')).toBe('2 years');
  });
});
