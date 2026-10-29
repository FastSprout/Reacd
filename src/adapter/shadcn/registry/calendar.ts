import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { calendarSchema } from '../../../schema/calendar/index.js';
import { ShadcnCalendar } from '../calendar/calendar.adapter.js';

export const calendarEntries = {
  Calendar: renderEntry('Calendar', calendarSchema, ShadcnCalendar),
};
