import type { ReactNode } from 'react';
import type { CalendarProps } from './calendar.props.js';
import { calendarSchema } from '../../schema/calendar/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function Calendar(props: CalendarProps): ReactNode {
  return useDeclaration('Calendar', calendarSchema, props);
}
