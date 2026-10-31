import { useId, useMemo, useState } from 'react';
import {
  DateField,
  DateInput,
  DateSegment,
  Label,
  Text,
  FieldError,
} from 'react-aria-components/DateField';
import { useLocale } from 'react-aria-components/I18nProvider';
import { parseDate, type CalendarDate } from '@internationalized/date';
import { INPUT_DATE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-date-policy.js';
import { useFieldMetadata } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { Button } from '../vendor/ui/button.js';
import { TemporalDraftValidity } from '../temporal/draft-validity.js';

interface DateControlProps {
  readonly label: string;
  readonly value: string | null;
  readonly referenceDate: string;
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

export function DateControl({
  label,
  value,
  referenceDate,
  onValueChange,
  description,
  error,
  min,
  max,
  name,
  required,
  disabled,
  readOnly,
}: DateControlProps) {
  const metadata = useFieldMetadata({ name, required, disabled });
  const { direction } = useLocale();
  const draftErrorId = useId();
  const [draftInvalid, setDraftInvalid] = useState(false);
  const [segments, setSegments] = useState<HTMLDivElement | null>(null);
  const controlValue = useMemo(
    () => (value === null ? null : parseDate(value)),
    [value],
  );
  const minimum = useMemo(
    () => (min === undefined ? undefined : parseDate(min)),
    [min],
  );
  const maximum = useMemo(
    () => (max === undefined ? undefined : parseDate(max)),
    [max],
  );
  const placeholder = useMemo(() => parseDate(referenceDate), [referenceDate]);
  const invalid = Boolean(metadata.error) || error !== undefined || draftInvalid;
  const descriptions = [
    ...metadata.descriptionIds,
    ...(draftInvalid ? [draftErrorId] : []),
  ].join(' ');
  return (
    <DateField<CalendarDate>
      className="reacd-node reacd-field reacd-date-control"
      {...(descriptions ? { 'aria-describedby': descriptions } : {})}
      value={controlValue}
      onChange={(next) => {
        setDraftInvalid(false);
        onValueChange(next === null ? null : next.toString());
      }}
      {...(minimum === undefined ? {} : { minValue: minimum })}
      {...(maximum === undefined ? {} : { maxValue: maximum })}
      {...(invalid ? { isInvalid: true } : {})}
      isRequired={metadata.required}
      isDisabled={metadata.disabled}
      isReadOnly={readOnly ?? false}
      granularity={INPUT_DATE_POLICY.granularity}
      shouldForceLeadingZeros={INPUT_DATE_POLICY.forceLeadingZeros}
      validationBehavior={INPUT_DATE_POLICY.validationBehavior}
      placeholderValue={placeholder}
    >
      {({ state }) => (
        <>
          <Label>{label}</Label>
          <div className="reacd-date-entry">
            <DateInput
              className="reacd-date-segments"
              dir={direction}
              ref={setSegments}
              aria-invalid={invalid || undefined}
            >
              {(segment) => (
                <DateSegment
                  className="reacd-date-segment"
                  segment={segment}
                  aria-invalid={invalid || undefined}
                />
              )}
            </DateInput>
            <Button
              type="button"
              variant="outline"
              className="reacd-button reacd-date-clear"
              disabled={metadata.disabled || readOnly}
              aria-label={`${INPUT_DATE_POLICY.clearLabel} ${label}`}
              onClick={() => {
                if (value === null) {
                  state.setValue(null);
                  setDraftInvalid(false);
                }
                onValueChange(null);
              }}
            >
              {INPUT_DATE_POLICY.clearLabel}
            </Button>
          </div>
          {description === undefined ? null : (
            <Text slot="description" className="reacd-field-description">
              {description}
            </Text>
          )}
          {draftInvalid ? (
            <span id={draftErrorId} role="alert" className="reacd-date-error">
              {INPUT_DATE_POLICY.incompleteValue}
            </span>
          ) : metadata.error ? null : (
            <FieldError className="reacd-date-error">{error}</FieldError>
          )}
          <input
            type="hidden"
            name={metadata.name}
            value={value ?? ''}
            disabled={metadata.disabled}
          />
          <TemporalDraftValidity
            segments={state.segments}
            value={value}
            required={metadata.required}
            disabled={metadata.disabled}
            root={segments}
            onInvalidChange={setDraftInvalid}
          />
        </>
      )}
    </DateField>
  );
}
