import type { DayButtonProps } from '@daypicker/react';
import { Button } from '../vendor/ui/button.js';
import { fromCalendarDate } from './calendar-date.js';

export function CalendarDayButton({ day, modifiers, ...properties }: DayButtonProps) {
  return (
    <Button
      {...properties}
      ref={(element) => {
        if (element !== null && modifiers['focused']) element.focus();
      }}
      variant="ghost"
      className="reacd-calendar-day"
      data-calendar-day={fromCalendarDate(day.date)}
      data-selected={modifiers['selected'] || undefined}
    />
  );
}
