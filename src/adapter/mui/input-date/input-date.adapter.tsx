import { useId, useMemo, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { InputDateProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-date/input-date.props.js';
import { DATE_TIME_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/date-time-policy.js';
import { INPUT_DATE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-date-policy.js';
import { UnsupportedAdapterComponentError } from
  '@fastsprout/reacd/adapter-runtime/core/unsupported-adapter-component-error.js';
import { useNativeField } from '../native-field.js';
import { useDateValidation } from './use-date-validation.js';
import {
  emitNativeDate,
  nativeDate,
  nativeDateLocale,
} from '../calendar/date-values.js';
import { ReferenceDateContext, ReferenceDay } from '../calendar/reference-day.js';

type SingleInputDateProps = Exclude<InputDateProps, { mode: 'range' }>;

export function MuiInputDate(props: InputDateProps) {
  if (props.mode === 'range')
    throw new UnsupportedAdapterComponentError('material-ui', 'InputDate');
  return <SingleInputDate {...props} />;
}

function SingleInputDate(props: SingleInputDateProps) {
  const id = useId();
  const field = useNativeField(props);
  const [open, setOpen] = useState(false);
  const value = useMemo(() => nativeDate(props.value), [props.value]);
  const { fieldRef, ...validation } = useDateValidation({
    id,
    label: props.label,
    value: props.value ?? '',
    required: field.required,
    disabled: field.disabled,
  });
  const error = field.error || validation.error;
  const help = field.helperError || validation.error || props.description;
  const blocked = field.blocked || Boolean(props.readOnly);
  if (blocked && open) setOpen(false);
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={nativeDateLocale('InputDate', props.locale)}
    >
      <ReferenceDateContext value={props.referenceDate}>
        <DatePicker
          label={props.label}
          value={value}
          referenceDate={nativeDate(props.referenceDate)}
          minDate={nativeDate(props.min ?? DATE_TIME_POLICY.minimumDate)}
          maxDate={nativeDate(props.max ?? DATE_TIME_POLICY.maximumDate)}
          {...(field.name ? { name: field.name } : {})}
          disabled={field.disabled}
          readOnly={Boolean(props.readOnly)}
          open={open && !blocked}
          onOpen={() => {
            if (!blocked) setOpen(true);
          }}
          onClose={() => setOpen(false)}
          onError={validation.onError}
          onChange={(nextValue, context) => {
            if (blocked) return;
            validation.onError(context.validationError);
            emitNativeDate(
              props.onValueChange,
              nextValue,
              context.validationError !== null,
            );
          }}
          slots={{ day: ReferenceDay }}
          slotProps={{
            field: { clearable: true, fieldRef },
            clearButton: {
              'aria-label': `${INPUT_DATE_POLICY.clearLabel} ${props.label}`,
            },
            textField: {
              id,
              fullWidth: true,
              required: field.required,
              inert: field.blocked,
              ...(error ? { error: true } : {}),
              helperText: help,
              slotProps: { htmlInput: { value: props.value ?? '' } },
            },
          }}
        />
      </ReferenceDateContext>
    </LocalizationProvider>
  );
}
