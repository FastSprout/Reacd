import { I18nProvider } from 'react-aria-components/I18nProvider';
import { useDirection } from '@radix-ui/react-direction';
import type { InputTimeProps } from '../../../components/input-time/index.js';
import { useFieldMetadata } from '../../../renderer/form-field/field-metadata.js';
import { DATE_TIME_POLICY } from '../../../core/date-time-policy.js';
import { INPUT_TIME_POLICY } from '../../../core/input-time-policy.js';
import {
  boundedTimeValueSchema,
  timeRangeValueSchema,
} from '../../../schema/date-time/index.js';
import { TimeControl } from './time-control.js';
import { useTimeChange } from './use-time-change.js';

import { temporalRecovery } from '../temporal/temporal-recovery.js';
import { useRangeReset } from '../temporal/use-range-reset.js';

function SingleTime(props: Exclude<InputTimeProps, { mode: 'range' }>) {
  const { error, change } = useTimeChange(
    (value) =>
      boundedTimeValueSchema({ min: props.min, max: props.max }).safeParse(value)
        .success,
    props.onValueChange,
    INPUT_TIME_POLICY.invalidValue,
    props,
    temporalRecovery(props.value, props),
  );
  return <TimeControl {...props} error={error} onValueChange={change} />;
}

function RangeTime(props: Extract<InputTimeProps, { mode: 'range' }>) {
  const { error, change } = useTimeChange(
    (value) =>
      timeRangeValueSchema({ min: props.min, max: props.max }).safeParse(value).success,
    props.onValueChange,
    INPUT_TIME_POLICY.invalidRange,
    props,
    temporalRecovery(props.value, props),
  );
  const { ref, revision, change: changeEndpoint } = useRangeReset(props.value, change);
  return (
    <fieldset ref={ref} className="reacd-time-range">
      <legend>{props.label}</legend>
      <TimeControl
        key={`${revision}-start`}
        {...props}
        label={`${INPUT_TIME_POLICY.startLabel} ${props.label}`}
        value={props.value.start}
        name={props.name === undefined ? undefined : `${props.name}.start`}
        error={error}
        onValueChange={(start) => changeEndpoint({ ...props.value, start })}
      />
      <TimeControl
        key={`${revision}-end`}
        {...props}
        label={`${INPUT_TIME_POLICY.endLabel} ${props.label}`}
        value={props.value.end}
        name={props.name === undefined ? undefined : `${props.name}.end`}
        error={error}
        onValueChange={(end) => changeEndpoint({ ...props.value, end })}
      />
    </fieldset>
  );
}

export function ShadcnInputTime(properties: InputTimeProps) {
  const metadata = useFieldMetadata(properties);
  const props = {
    ...properties,
    name: metadata.name,
    required: metadata.required,
    disabled: metadata.disabled,
  };
  const direction = useDirection();
  return (
    <I18nProvider locale={props.locale ?? DATE_TIME_POLICY.locale}>
      <div className="reacd-node reacd-field reacd-input-time" dir={direction}>
        {props.mode === 'range' ? <RangeTime {...props} /> : <SingleTime {...props} />}
      </div>
    </I18nProvider>
  );
}
