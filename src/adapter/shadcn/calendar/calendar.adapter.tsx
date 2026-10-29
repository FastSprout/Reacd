import { useId, useRef } from 'react';
import { useDirection } from '@base-ui/react/direction-provider';
import { DayPicker } from '@daypicker/react';
import type { CalendarProps } from '../../../components/calendar/index.js';
import { CALENDAR_DEFAULTS, CALENDAR_POLICY } from '../../../core/calendar-policy.js';
import { DATE_TIME_POLICY } from '../../../core/date-time-policy.js';
import { nextCalendarRange } from '../../../core/calendar-range.js';
import { CalendarDayButton } from './calendar-day-button.js';
import { CalendarFormBridge } from './calendar-form-bridge.js';
import {
  calendarInitialDate,
  fromCalendarDate,
  toCalendarDate,
} from './calendar-date.js';
import { calendarLocalization } from './calendar-localization.js';

export function ShadcnCalendar(properties: CalendarProps) {
  const {
    label,
    referenceDate,
    description,
    locale = CALENDAR_DEFAULTS.locale,
    numberOfMonths = CALENDAR_DEFAULTS.numberOfMonths,
    weekStartsOn = CALENDAR_DEFAULTS.weekStartsOn,
    disabled = CALENDAR_DEFAULTS.disabled,
    readOnly = CALENDAR_DEFAULTS.readOnly,
    required = CALENDAR_DEFAULTS.required,
    min = DATE_TIME_POLICY.minimumDate,
    max = DATE_TIME_POLICY.maximumDate,
  } = properties;
  const id = useId();
  const region = useRef<HTMLDivElement>(null);
  const direction = useDirection();
  const common = {
    ...calendarLocalization(locale),
    defaultMonth: calendarInitialDate(properties),
    today: toCalendarDate(referenceDate),
    startMonth: toCalendarDate(min),
    endMonth: toCalendarDate(max),
    disabled: disabled
      ? true
      : [{ before: toCalendarDate(min) }, { after: toCalendarDate(max) }],
    disableNavigation: disabled,
    timeZone: CALENDAR_POLICY.timeZone,
    numberOfMonths,
    weekStartsOn,
    dir: direction,
    components: { DayButton: CalendarDayButton },
  };
  return (
    <div
      ref={region}
      role="group"
      aria-labelledby={id}
      aria-describedby={description === undefined ? undefined : `${id}-help`}
      aria-disabled={disabled}
      data-readonly={readOnly}
      data-direction={direction}
      data-slot="calendar"
      tabIndex={-1}
      className="reacd-node reacd-calendar"
    >
      <span id={id} className="reacd-calendar-label">
        {label}
      </span>
      <div
        className="reacd-calendar-viewport"
        role="region"
        aria-label={`${label} grid`}
      >
        {properties.mode === 'range' ? (
          <DayPicker
            {...common}
            mode="range"
            selected={{
              from:
                properties.value.start === null
                  ? undefined
                  : toCalendarDate(properties.value.start),
              to:
                properties.value.end === null
                  ? undefined
                  : toCalendarDate(properties.value.end),
            }}
            onSelect={(_next, trigger) => {
              if (!disabled && !readOnly)
                properties.onValueChange(
                  nextCalendarRange(properties.value, fromCalendarDate(trigger)),
                );
            }}
          />
        ) : (
          <DayPicker
            {...common}
            mode="single"
            selected={
              properties.value === null ? undefined : toCalendarDate(properties.value)
            }
            onSelect={(next) => {
              if (!disabled && !readOnly && (!required || next !== undefined))
                properties.onValueChange(
                  next === undefined ? null : fromCalendarDate(next),
                );
            }}
          />
        )}
      </div>
      <CalendarFormBridge properties={properties} region={region} />
      {description === undefined ? null : (
        <span id={`${id}-help`} className="reacd-field-description">
          {description}
        </span>
      )}
    </div>
  );
}
