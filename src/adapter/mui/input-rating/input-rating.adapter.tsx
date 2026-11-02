import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { useId } from 'react';
import Rating from '@mui/material/Rating';
import Input from '@mui/material/Input';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import type { InputRatingProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-rating/input-rating.props.js';
import {
  INPUT_RATING_DEFAULTS,
  INPUT_RATING_LABELS,
  INPUT_RATING_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/input-rating-policy.js';
import { UnsupportedAdapterComponentError } from
  '@fastsprout/reacd/adapter-runtime/core/unsupported-adapter-component-error.js';
import { useNativeField } from '../native-field.js';
import { useMaterialTextConstraint } from '../form/use-text-constraint.js';

export type MuiInputRatingProps = InputRatingProps;

export function MuiInputRating(props: InputRatingProps) {
  const id = useId();
  const field = useNativeField(props);
  const { inputRef, error: validationError } =
    useMaterialTextConstraint<HTMLFieldSetElement>({
      id,
      label: props.label,
      value: props.value === INPUT_RATING_POLICY.emptyValue ? '' : String(props.value),
      required: field.required,
      disabled: field.disabled,
    });
  if (!(props.hoverable ?? INPUT_RATING_DEFAULTS.muiHoverable))
    throw new UnsupportedAdapterComponentError('material-ui', 'InputRating');
  const blocked = field.blocked || Boolean(props.readOnly);
  const error = field.error || validationError;
  return (
    <FormControl
      component="fieldset"
      role="group"
      tabIndex={-1}
      aria-labelledby={`${id}-label`}
      aria-describedby={`${id}-help`}
      ref={inputRef}
      inert={field.blocked}
      disabled={field.disabled}
      required={field.required}
      error={Boolean(error)}
    >
      <FormLabel component="legend" id={`${id}-label`}>
        {props.label}
      </FormLabel>
      <Rating
        sx={{
          minHeight: LAYOUT_POLICY.controlTargetPx,
          alignItems: 'center',
          '& .MuiRating-label': {
            minHeight: LAYOUT_POLICY.controlTargetPx,
            display: 'inline-flex',
            alignItems: 'center',
          },
        }}
        name={field.name ?? id}
        value={props.value === INPUT_RATING_POLICY.emptyValue ? null : props.value}
        max={props.length ?? INPUT_RATING_POLICY.length}
        precision={props.step ?? INPUT_RATING_POLICY.step}
        readOnly={props.readOnly}
        disabled={field.disabled}
        onChange={(_event, value) => {
          if (!blocked) props.onValueChange(value ?? INPUT_RATING_POLICY.emptyValue);
        }}
      />
      {props.readOnly && field.name !== undefined && (
        <Input
          type="hidden"
          sx={{ display: 'none' }}
          name={field.name}
          value={props.value === INPUT_RATING_POLICY.emptyValue ? '' : props.value}
          disabled={field.disabled}
        />
      )}
      <FormHelperText id={`${id}-help`}>{error || props.description}</FormHelperText>
      {(props.clearable ?? INPUT_RATING_DEFAULTS.clearable) && (
        <Button
          type="button"
          disabled={blocked || props.value === INPUT_RATING_POLICY.emptyValue}
          onClick={() => props.onValueChange(INPUT_RATING_POLICY.emptyValue)}
        >
          {`${INPUT_RATING_LABELS.clearPrefix} ${props.label}`}
        </Button>
      )}
    </FormControl>
  );
}
