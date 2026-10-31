import type { ComponentProps, ComponentType } from 'react';
import { SharedCalendar } from '../../shared/calendar/calendar.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiCalendarProps = ComponentProps<typeof SharedCalendar>;
export const MuiCalendar: ComponentType<MuiCalendarProps> = bindPrimitives(
  SharedCalendar,
  muiPrimitives,
  'MuiCalendar',
);
