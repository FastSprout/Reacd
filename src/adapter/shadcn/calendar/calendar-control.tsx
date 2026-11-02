import { useId, type CSSProperties, type RefCallback } from 'react';
import { useDirection } from '@radix-ui/react-direction';
import type { CalendarProps } from
  '@fastsprout/reacd/adapter-runtime/components/calendar/index.js';
import {
  CALENDAR_DEFAULTS,
  CALENDAR_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/calendar-policy.js';
import { DATE_TIME_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/date-time-policy.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { Calendar } from '../vendor/ui/calendar.js';
import { CardContent } from '../vendor/ui/card.js';
import { FieldDescription, FieldError, FieldLegend } from '../vendor/ui/field.js';
import { Input } from '../vendor/ui/input.js';
import { nativeDate, canonicalDate } from './date-value.js';
import { calendarLocalization } from './localization.js';
import { CalendarDayTarget, CalendarTargetContext } from './day-target.js';

export type CalendarControlProps = CalendarProps & {
  readonly inputRef?: RefCallback<HTMLButtonElement> | undefined;
  readonly validationError?: string | undefined;
  readonly onBlur?: (() => void) | undefined;
};

export function CalendarControl(props: CalendarControlProps) {
  const id = useId();
  const field = useNativeField(props, props.description ? [`${id}-help`] : []);
  const direction = useDirection();
  const locale = props.locale ?? CALENDAR_DEFAULTS.locale;
  const error = props.validationError || field.error;
  const start = props.mode === 'range' ? props.value.start : props.value;
  const end = props.mode === 'range' ? props.value.end : null;
  const selected = start ?? end;
  const reference = selected ?? props.referenceDate;
  const month =
    props.min !== undefined && reference < props.min
      ? props.min
      : props.max !== undefined && reference > props.max
        ? props.max
        : reference;
  const sizing: CSSProperties & { '--cell-size': string } = {
    '--cell-size': `${LAYOUT_POLICY.controlTargetPx}px`,
  };
  const common = {
    ...calendarLocalization(locale),
    lang: locale,
    dir: direction,
    timeZone: CALENDAR_POLICY.timeZone,
    noonSafe: true,
    today: nativeDate(props.referenceDate),
    defaultMonth: nativeDate(month),
    numberOfMonths: props.numberOfMonths ?? CALENDAR_DEFAULTS.numberOfMonths,
    weekStartsOn: props.weekStartsOn ?? CALENDAR_DEFAULTS.weekStartsOn,
    startMonth: nativeDate(props.min ?? DATE_TIME_POLICY.minimumDate),
    endMonth: nativeDate(props.max ?? DATE_TIME_POLICY.maximumDate),
    disabled: field.disabled
      ? true
      : [
          { before: nativeDate(props.min ?? DATE_TIME_POLICY.minimumDate) },
          { after: nativeDate(props.max ?? DATE_TIME_POLICY.maximumDate) },
        ],
    disableNavigation: field.disabled,
    components: { DayButton: CalendarDayTarget },
    className: 'max-w-full',
    style: sizing,
    'aria-label': props.label,
    'aria-describedby':
      [...field.descriptionIds, ...(props.validationError ? [`${id}-error`] : [])].join(
        ' ',
      ) || undefined,
    'aria-invalid': Boolean(error),
  };
  const blocked = field.blocked || props.readOnly;
  return (
    <CardContent
      role="group"
      aria-label={props.label}
      className="grid min-w-0 gap-2 p-0"
      onBlur={props.onBlur}
    >
      <FieldLegend>{props.label}</FieldLegend>
      <CalendarTargetContext.Provider value={props.inputRef}>
        <CardContent
          role="region"
          aria-label={`${props.label} grid`}
          className="min-w-0 max-w-full overflow-x-auto p-0"
        >
          {props.mode === 'range' ? (
            <Calendar
              {...common}
              mode="range"
              required
              resetOnSelect
              selected={
                selected === null
                  ? undefined
                  : {
                      from: nativeDate(selected),
                      to: end && start ? nativeDate(end) : undefined,
                    }
              }
              onSelect={(range) => {
                if (!blocked)
                  props.onValueChange({
                    start: canonicalDate(range.from),
                    end: canonicalDate(range.to),
                  });
              }}
            />
          ) : (
            <Calendar
              {...common}
              mode="single"
              required={field.required}
              selected={props.value === null ? undefined : nativeDate(props.value)}
              onSelect={(day: Date | undefined) => {
                if (!blocked) props.onValueChange(canonicalDate(day));
              }}
            />
          )}
        </CardContent>
      </CalendarTargetContext.Provider>
      {field.name &&
        (props.mode === 'range' ? (
          <>
            <Input
              type="hidden"
              name={`${field.name}.start`}
              value={start ?? ''}
              disabled={field.disabled}
            />
            <Input
              type="hidden"
              name={`${field.name}.end`}
              value={end ?? ''}
              disabled={field.disabled}
            />
          </>
        ) : (
          <Input
            type="hidden"
            name={field.name}
            value={start ?? ''}
            disabled={field.disabled}
          />
        ))}
      {props.description && (
        <FieldDescription id={`${id}-help`}>{props.description}</FieldDescription>
      )}
      {props.validationError && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </CardContent>
  );
}
