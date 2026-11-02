import { useId } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { CalendarProps } from
  '@fastsprout/reacd/adapter-runtime/components/calendar/calendar.props.js';
import { CALENDAR_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/calendar-policy.js';
import { DATE_TIME_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/date-time-policy.js';
import { UnsupportedAdapterComponentError } from
  '@fastsprout/reacd/adapter-runtime/core/unsupported-adapter-component-error.js';
import { useNativeField } from '../native-field.js';
import { useMaterialTextConstraint } from '../form/use-text-constraint.js';
import {
  emitNativeDate, nativeDate, nativeDateLocale,
} from './date-values.js';
import { ReferenceDateContext, ReferenceDay } from './reference-day.js';

type SingleCalendarProps = Exclude<CalendarProps, { mode: 'range' }>;

export function MuiCalendar(props: CalendarProps) {
  if (props.mode === 'range' || props.numberOfMonths === 2)
    throw new UnsupportedAdapterComponentError('material-ui', 'Calendar');
  return <SingleCalendar {...props} />;
}

function SingleCalendar(props: SingleCalendarProps) {
  const id = useId();
  const field = useNativeField(props);
  const { inputRef, ...validation } =
    useMaterialTextConstraint<HTMLFieldSetElement>({
    id, label: props.label, value: props.value ?? '',
    required: field.required, disabled: field.disabled,
  });
  const locale = nativeDateLocale('Calendar', props.locale);
  const error = field.error || validation.error;
  const help = field.helperError || validation.error || props.description;
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={{
      ...locale,
      options: { ...locale.options,
        weekStartsOn: props.weekStartsOn ?? CALENDAR_DEFAULTS.weekStartsOn },
    }}>
      <ReferenceDateContext value={props.referenceDate}>
      <FormControl component="fieldset" fullWidth tabIndex={-1}
        ref={inputRef} disabled={field.disabled} inert={field.blocked}
        required={field.required} error={Boolean(error)}
        aria-labelledby={`${id}-label`} aria-describedby={`${id}-help`}>
        <FormLabel component="legend" id={`${id}-label`}>{props.label}</FormLabel>
        <Box role="region" aria-label={props.label} tabIndex={0}
          sx={{ maxWidth: '100%', minWidth: 0, overflowX: 'auto' }}>
          <DateCalendar
            value={nativeDate(props.value)}
            referenceDate={nativeDate(props.referenceDate)}
            minDate={nativeDate(props.min ?? DATE_TIME_POLICY.minimumDate)}
            maxDate={nativeDate(props.max ?? DATE_TIME_POLICY.maximumDate)}
            disabled={field.disabled} readOnly={Boolean(props.readOnly)}
            slots={{ day: ReferenceDay }}
            onChange={(value) => emitNativeDate(
              props.onValueChange, value, field.blocked || Boolean(props.readOnly),
            )}
          />
        </Box>
        <Input type="hidden" name={field.name} value={props.value ?? ''}
          disabled={field.disabled} />
        <FormHelperText id={`${id}-help`}>{help}</FormHelperText>
      </FormControl>
      </ReferenceDateContext>
    </LocalizationProvider>
  );
}
