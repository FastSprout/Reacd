import { useMemo } from 'react';
import { I18nProvider } from 'react-aria-components/I18nProvider';
import { useDirection } from '@radix-ui/react-direction';
import type { InputDateProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-date/index.js';
import { useFieldMetadata } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { DATE_TIME_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/date-time-policy.js';
import { INPUT_DATE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-date-policy.js';
import {
  boundedDateValueSchema,
  dateRangeValueSchema,
} from '@fastsprout/reacd/adapter-runtime/schema/date-time/index.js';
import { DateControl } from './date-control.js';
import { useTemporalChange } from '../temporal/use-temporal-change.js';

import { temporalRecovery } from '../temporal/temporal-recovery.js';
import { useRangeReset } from '../temporal/use-range-reset.js';

function SingleDate(props: Exclude<InputDateProps, { mode: 'range' }>) {
  const { error, change } = useTemporalChange(
    (value) =>
      boundedDateValueSchema({ min: props.min, max: props.max }).safeParse(value)
        .success,
    props.onValueChange,
    INPUT_DATE_POLICY.invalidValue,
    props,
    temporalRecovery(props.value, props),
  );
  return <DateControl {...props} error={error} onValueChange={change} />;
}

function RangeDate(props: Extract<InputDateProps, { mode: 'range' }>) {
  const { error, change } = useTemporalChange(
    (value) =>
      dateRangeValueSchema({ min: props.min, max: props.max }).safeParse(value).success,
    props.onValueChange,
    INPUT_DATE_POLICY.invalidRange,
    props,
    temporalRecovery(props.value, props),
  );
  const { ref, revision, change: changeEndpoint } = useRangeReset(props.value, change);
  return (
    <fieldset ref={ref} className="reacd-date-range">
      <legend>{props.label}</legend>
      <DateControl
        key={`${revision}-start`}
        {...props}
        label={`${INPUT_DATE_POLICY.startLabel} ${props.label}`}
        value={props.value.start}
        name={props.name === undefined ? undefined : `${props.name}.start`}
        error={error}
        onValueChange={(start) => changeEndpoint({ ...props.value, start })}
      />
      <DateControl
        key={`${revision}-end`}
        {...props}
        label={`${INPUT_DATE_POLICY.endLabel} ${props.label}`}
        value={props.value.end}
        name={props.name === undefined ? undefined : `${props.name}.end`}
        error={error}
        onValueChange={(end) => changeEndpoint({ ...props.value, end })}
      />
    </fieldset>
  );
}

export function SharedInputDate(properties: InputDateProps) {
  const metadata = useFieldMetadata(properties);
  const props = {
    ...properties,
    name: metadata.name,
    required: metadata.required,
    disabled: metadata.disabled,
  };
  const direction = useDirection();
  const locale = useMemo(
    () =>
      new Intl.Locale(props.locale ?? DATE_TIME_POLICY.locale, {
        calendar: DATE_TIME_POLICY.calendar,
      }).toString(),
    [props.locale],
  );
  return (
    <I18nProvider locale={locale}>
      <div className="reacd-node reacd-field reacd-input-date" dir={direction}>
        {props.mode === 'range' ? <RangeDate {...props} /> : <SingleDate {...props} />}
      </div>
    </I18nProvider>
  );
}
