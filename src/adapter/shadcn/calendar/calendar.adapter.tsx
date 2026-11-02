import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import type { CalendarProps } from
  '@fastsprout/reacd/adapter-runtime/components/calendar/index.js';
import { CALENDAR_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/calendar-policy.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { ManagedFormField } from '../form/managed-field.js';
import { CalendarControl } from './calendar-control.js';

export type ShadcnCalendarProps = CalendarProps;
export function ShadcnCalendar(props: ShadcnCalendarProps) {
  const id = useId();
  const form = useFormContext<Record<string, unknown>>();
  const field = useNativeField(props);
  if (!form) return <CalendarControl {...props} />;
  return (
    <ManagedFormField
      registrationId={id}
      validationKey={JSON.stringify([field.error, field.required])}
      control={form.control}
      defaultValue={props.value}
      disabled={field.disabled}
      rules={{
        validate: () =>
          field.error ||
          !field.required ||
          (props.mode === 'range'
            ? Boolean(props.value.start && props.value.end) ||
              CALENDAR_DEFAULTS.requiredRange
            : props.value !== null || CALENDAR_DEFAULTS.requiredSingle),
      }}
      render={({ field: native, fieldState }) => {
        const shared = {
          inputRef: native.ref,
          onBlur: native.onBlur,
          validationError: fieldState.error?.message,
        };
        return props.mode === 'range' ? (
          <CalendarControl
            {...props}
            {...shared}
            onValueChange={(
              value: Extract<CalendarProps, { mode: 'range' }>['value'],
            ) => {
              props.onValueChange(value);
              native.onChange(value);
            }}
          />
        ) : (
          <CalendarControl
            {...props}
            {...shared}
            onValueChange={(value) => {
              props.onValueChange(value);
              native.onChange(value);
            }}
          />
        );
      }}
    />
  );
}
