import {
  TimeField,
  DateInput,
  DateSegment,
  Label,
  Text,
  FieldError,
} from 'react-aria-components/TimeField';
import { useLocale } from 'react-aria-components/I18nProvider';
import { toTime, type ZonedDateTime } from '@internationalized/date';
import { useId, useMemo, useState } from 'react';
import { DATE_TIME_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/date-time-policy.js';
import { INPUT_TIME_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-time-policy.js';
import { useFieldMetadata } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { Button } from '../vendor/ui/button.js';
import { anchoredTime } from './anchored-time.js';
import { TimeDraftValidation } from './draft-validation.js';

interface TimeControlProps {
  readonly label: string;
  readonly value: string | null;
  readonly onValueChange: (value: string | null) => void;
  readonly description?: string | undefined;
  readonly error?: string | undefined;
  readonly min?: string | undefined;
  readonly max?: string | undefined;
  readonly name?: string | undefined;
  readonly required?: boolean | undefined;
  readonly disabled?: boolean | undefined;
  readonly readOnly?: boolean | undefined;
}

export function TimeControl({
  label,
  value,
  onValueChange,
  description,
  error,
  min,
  max,
  name,
  required,
  disabled,
  readOnly,
}: TimeControlProps) {
  const metadata = useFieldMetadata({ name, required, disabled });
  const { direction } = useLocale();
  const draftErrorId = useId();
  const [draftInvalid, setDraftInvalid] = useState(false);
  const [segments, setSegments] = useState<HTMLDivElement | null>(null);
  const controlValue = useMemo(
    () => (value === null ? null : anchoredTime(value)),
    [value],
  );
  const minimum = useMemo(
    () => (min === undefined ? undefined : anchoredTime(min)),
    [min],
  );
  const maximum = useMemo(
    () => (max === undefined ? undefined : anchoredTime(max)),
    [max],
  );
  const placeholder = useMemo(() => anchoredTime(DATE_TIME_POLICY.placeholderTime), []);
  const invalid = Boolean(metadata.error) || error !== undefined || draftInvalid;
  const descriptions = [
    ...metadata.descriptionIds,
    ...(draftInvalid ? [draftErrorId] : []),
  ].join(' ');
  return (
    <TimeField<ZonedDateTime>
      className="reacd-node reacd-field reacd-time-control"
      {...(descriptions ? { 'aria-describedby': descriptions } : {})}
      value={controlValue}
      onChange={(next) => {
        setDraftInvalid(false);
        onValueChange(next === null ? null : toTime(next).toString());
      }}
      {...(minimum === undefined ? {} : { minValue: minimum })}
      {...(maximum === undefined ? {} : { maxValue: maximum })}
      {...(invalid ? { isInvalid: true } : {})}
      isRequired={metadata.required}
      isDisabled={metadata.disabled}
      isReadOnly={readOnly ?? false}
      hourCycle={INPUT_TIME_POLICY.hourCycle}
      hideTimeZone
      granularity={INPUT_TIME_POLICY.granularity}
      shouldForceLeadingZeros={INPUT_TIME_POLICY.forceLeadingZeros}
      validationBehavior={INPUT_TIME_POLICY.validationBehavior}
      placeholderValue={placeholder}
    >
      {({ state }) => (
        <>
          <Label>{label}</Label>
          <div className="reacd-time-entry">
            <DateInput
              className="reacd-time-segments"
              dir={direction}
              ref={setSegments}
              aria-invalid={invalid || undefined}
            >
              {(segment) => (
                <DateSegment
                  className="reacd-time-segment"
                  segment={segment}
                  aria-invalid={invalid || undefined}
                />
              )}
            </DateInput>
            <Button
              type="button"
              variant="outline"
              className="reacd-button reacd-time-clear"
              disabled={metadata.disabled || readOnly}
              aria-label={`${INPUT_TIME_POLICY.clearLabel} ${label}`}
              onClick={() => {
                if (value === null) {
                  state.setValue(null);
                  setDraftInvalid(false);
                }
                onValueChange(null);
              }}
            >
              {INPUT_TIME_POLICY.clearLabel}
            </Button>
          </div>
          {description === undefined ? null : (
            <Text slot="description" className="reacd-field-description">
              {description}
            </Text>
          )}
          {draftInvalid ? (
            <span id={draftErrorId} role="alert" className="reacd-time-error">
              {INPUT_TIME_POLICY.incompleteValue}
            </span>
          ) : metadata.error ? null : (
            <FieldError className="reacd-time-error">{error}</FieldError>
          )}
          <input
            type="hidden"
            name={metadata.name}
            value={value ?? ''}
            disabled={metadata.disabled}
          />
          <TimeDraftValidation
            segments={state.segments}
            value={value}
            required={metadata.required}
            disabled={metadata.disabled}
            root={segments}
            onInvalidChange={setDraftInvalid}
          />
        </>
      )}
    </TimeField>
  );
}
