import {
  CALENDAR_DEFAULTS,
  CALENDAR_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/calendar-policy.js';

export function calendarLocalization(locale: string) {
  const options = { calendar: 'gregory', timeZone: CALENDAR_POLICY.timeZone };
  const month = new Intl.DateTimeFormat(locale, {
    ...options,
    year: 'numeric',
    month: 'long',
  });
  const full = new Intl.DateTimeFormat(locale, { ...options, dateStyle: 'full' });
  const weekday = new Intl.DateTimeFormat(locale, { ...options, weekday: 'short' });
  const weekdayName = new Intl.DateTimeFormat(locale, { ...options, weekday: 'long' });
  const day = new Intl.NumberFormat(locale, { useGrouping: false });
  return {
    formatters: {
      formatCaption: (value: Date) => month.format(value),
      formatDay: (value: Date) => day.format(value.getUTCDate()),
      formatWeekdayName: (value: Date) => weekday.format(value),
    },
    labels: {
      labelDayButton: (value: Date) => full.format(value),
      labelGrid: (value: Date) => month.format(value),
      labelWeekday: (value: Date) => weekdayName.format(value),
      labelNext: () => CALENDAR_DEFAULTS.nextLabel,
      labelPrevious: () => CALENDAR_DEFAULTS.previousLabel,
      labelNav: () => CALENDAR_DEFAULTS.navigationLabel,
    },
  };
}
