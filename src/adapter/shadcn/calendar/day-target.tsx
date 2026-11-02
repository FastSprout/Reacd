import {
  createContext,
  useContext,
  type ComponentProps,
  type RefCallback,
} from 'react';
import type { DayButton } from '@daypicker/react';
import { CalendarDayButton } from '../vendor/ui/calendar.js';
import { canonicalDate } from './date-value.js';

export const CalendarTargetContext = createContext<
  RefCallback<HTMLButtonElement> | undefined
>(undefined);

export function CalendarDayTarget(props: ComponentProps<typeof DayButton>) {
  const target = useContext(CalendarTargetContext);
  return (
    <CalendarDayButton
      {...props}
      data-day={canonicalDate(props.day.date)}
      buttonRef={(element) => {
        if (element?.tabIndex === 0 && !element.disabled) target?.(element);
      }}
    />
  );
}
