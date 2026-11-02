import {
  CALENDAR_DEFAULTS,
  CALENDAR_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/calendar-policy.js';

export function calendarLocalization(locale: string) {
  const format = (date: Date, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, {
      ...options,
      calendar: 'gregory',
      timeZone: CALENDAR_POLICY.timeZone,
    }).format(date);
  const caption = (date: Date) => format(date, { year: 'numeric', month: 'long' });
  const weekday = (date: Date) => format(date, { weekday: 'long' });
  return {
    formatters: {
      formatCaption: caption,
      formatMonthDropdown: (date: Date) => format(date, { month: 'long' }),
      formatYearDropdown: (date: Date) => format(date, { year: 'numeric' }),
      formatDay: (date: Date) => format(date, { day: 'numeric' }),
      formatWeekdayName: (date: Date) => format(date, { weekday: 'short' }),
    },
    labels: {
      labelDayButton: (date: Date) =>
        format(date, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      labelGrid: caption,
      labelGridcell: (date: Date) => format(date, { day: 'numeric' }),
      labelWeekday: weekday,
      labelNext: () => CALENDAR_DEFAULTS.nextLabel,
      labelPrevious: () => CALENDAR_DEFAULTS.previousLabel,
      labelNav: () => CALENDAR_DEFAULTS.navigationLabel,
    },
  };
}
