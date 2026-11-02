import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import type { Ref } from 'react';
import type { InputRatingProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-rating/input-rating.props.js';
import {
  INPUT_RATING_POLICY,
  INPUT_RATING_DEFAULTS,
  INPUT_RATING_LABELS,
} from '@fastsprout/reacd/adapter-runtime/core/input-rating-policy.js';
import { Field, FieldLabel, FieldDescription, FieldError } from '../vendor/ui/field.js';
import { Slider } from '../vendor/ui/slider.js';
import { Button } from '../vendor/ui/button.js';
import { WRAPPING_BUTTON_CLASSES } from '../button/content-layout.js';
import { useNativeField } from '../form-field/use-native-field.js';

export interface RatingControlProps extends InputRatingProps {
  readonly id: string;
  readonly inputRef?: Ref<HTMLSpanElement> | undefined;
  readonly onBlur?: (() => void) | undefined;
  readonly error?: string | undefined;
}

export function ShadcnRatingControl({ inputRef, ...props }: RatingControlProps) {
  const field = useNativeField(props);
  const length = props.length ?? INPUT_RATING_POLICY.length;
  const step = props.step ?? INPUT_RATING_POLICY.step;
  const clearable = props.clearable ?? INPUT_RATING_DEFAULTS.clearable;
  const error = props.error || field.error;
  const blocked = field.blocked || Boolean(props.readOnly);
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={props.id} id={`${props.id}-label`}>
        {props.label}
      </FieldLabel>
      <Slider
        style={{ minBlockSize: LAYOUT_POLICY.controlTargetPx }}
        value={[props.value]}
        min={INPUT_RATING_POLICY.emptyValue}
        max={length}
        step={step}
        name={field.name}
        disabled={field.disabled}
        inert={field.blocked}
        aria-label={props.label}
        thumbProps={{
          ref: inputRef,
          id: props.id,
          onBlur: props.onBlur,
          'aria-labelledby': `${props.id}-label`,
          'aria-readonly': props.readOnly,
          'aria-required': field.required,
          'aria-invalid': Boolean(error),
          'aria-valuetext': `${props.value} of ${length} ${INPUT_RATING_LABELS.stars}`,
          'aria-describedby': [
            ...field.descriptionIds,
            ...(props.description === undefined ? [] : [`${props.id}-help`]),
            ...(error ? [`${props.id}-error`] : []),
          ].join(' '),
        }}
        onValueChange={(values) => {
          if (!blocked) values.forEach((value) => props.onValueChange(value));
        }}
      />
      {props.description !== undefined && (
        <FieldDescription id={`${props.id}-help`}>{props.description}</FieldDescription>
      )}
      {error && <FieldError id={`${props.id}-error`}>{error}</FieldError>}
      {clearable && (
        <Button
          type="button"
          className={WRAPPING_BUTTON_CLASSES}
          variant="outline"
          disabled={blocked || props.value === INPUT_RATING_POLICY.emptyValue}
          onClick={() => props.onValueChange(INPUT_RATING_POLICY.emptyValue)}
        >
          {`${INPUT_RATING_LABELS.clearPrefix} ${props.label}`}
        </Button>
      )}
    </Field>
  );
}
