import type { z } from 'zod';
import type { calendarSchema } from '../../schema/calendar/index.js';

export type CalendarProps = z.infer<typeof calendarSchema>;
