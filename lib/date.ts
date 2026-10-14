import { isValid, parse } from 'date-fns';

/** Dates are kept in the form (and sent) as plain "12.10.2026" strings. */
export const DATE_FORMAT = 'dd.MM.yyyy';

export const parseDate = (value?: string): Date | null => {
  if (!value) return null;
  const date = parse(value, DATE_FORMAT, new Date());
  return isValid(date) ? date : null;
};
