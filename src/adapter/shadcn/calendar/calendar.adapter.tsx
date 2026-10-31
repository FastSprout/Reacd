import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/calendar/calendar.adapter.js';
import { SharedCalendar } from '../../shared/calendar/calendar.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnCalendarProps = ComponentProps<typeof SharedCalendar>;
export const ShadcnCalendar: ComponentType<ShadcnCalendarProps> = bindPrimitives(
  SharedCalendar,
  shadcnPrimitives,
  'ShadcnCalendar',
);
