import { useId } from 'react';
import { parseDate, parseTime } from '@internationalized/date';
import { DateField, TimeField, I18nProvider } from 'react-aria-components';
import { DATE_TIME_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/date-time-policy.js';
import { INPUT_DATE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-date-policy.js';
import { INPUT_TIME_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-time-policy.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { TemporalContents } from './content.js';
import { temporalIssue } from './validation.js';
import type { TemporalFieldProps } from './field.props.js';

export function TemporalControl(props: TemporalFieldProps) {
  const id = useId();
  const field = useNativeField(props);
  const blocked = Boolean(field.blocked || props.readOnly);
  const policy = props.kind === 'date' ? INPUT_DATE_POLICY : INPUT_TIME_POLICY;
  const locale = new Intl.Locale(props.locale ?? DATE_TIME_POLICY.locale, {
    calendar: DATE_TIME_POLICY.calendar,
  }).toString();
  const common = {
    id,
    isRequired: field.required,
    isDisabled: field.disabled,
    isReadOnly: Boolean(props.readOnly),
    ...(field.name === undefined ? {} : { name: field.name }),
    ...(props.onBlur === undefined ? {} : { onBlur: props.onBlur }),
    ...(field.error || props.validationError ? { isInvalid: true } : {}),
    className: 'grid min-w-0 gap-2',
    ...(field.descriptionIds.length === 0
      ? {}
      : {
          'aria-describedby': field.descriptionIds.join(' '),
        }),
    validationBehavior: policy.validationBehavior,
    shouldForceLeadingZeros: policy.forceLeadingZeros,
    validate: (value: { toString(): string }) =>
      field.error || temporalIssue(props, value.toString()),
    onChange: (value: { toString(): string } | null) => {
      const next = value?.toString() ?? null;
      if (!blocked && !temporalIssue(props, next)) props.onValueChange(next);
    },
  };
  return (
    <I18nProvider locale={locale}>
      {props.kind === 'date' ? (
        <DateField
          {...common}
          granularity="day"
          value={props.value === null ? null : parseDate(props.value)}
          placeholderValue={parseDate(props.referenceDate)}
          minValue={props.min === undefined ? null : parseDate(props.min)}
          maxValue={props.max === undefined ? null : parseDate(props.max)}
        >
          {({ state }) => (
            <TemporalContents state={state} props={props} blocked={blocked} />
          )}
        </DateField>
      ) : (
        <TimeField
          {...common}
          granularity={INPUT_TIME_POLICY.granularity}
          hourCycle={INPUT_TIME_POLICY.hourCycle}
          value={props.value === null ? null : parseTime(props.value)}
          placeholderValue={parseTime(DATE_TIME_POLICY.placeholderTime)}
          minValue={props.min === undefined ? null : parseTime(props.min)}
          maxValue={props.max === undefined ? null : parseTime(props.max)}
        >
          {({ state }) => (
            <TemporalContents state={state} props={props} blocked={blocked} />
          )}
        </TimeField>
      )}
    </I18nProvider>
  );
}
