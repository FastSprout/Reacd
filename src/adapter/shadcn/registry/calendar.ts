import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { calendarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/calendar/index.js';
import { ShadcnCalendar } from '../calendar/calendar.adapter.js';

export const calendarEntries = {
  Calendar: renderEntry('Calendar', calendarSchema, ShadcnCalendar),
};
