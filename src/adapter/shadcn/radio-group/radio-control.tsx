import type { Ref } from 'react';
import type { RadioGroupProps } from
  '@fastsprout/reacd/adapter-runtime/components/radio-group/radio-group.props.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { RadioGroup, RadioGroupItem } from '../vendor/ui/radio-group.js';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
  FieldError,
} from '../vendor/ui/field.js';

export interface RadioControlProps extends RadioGroupProps {
  readonly id: string;
  readonly managed?: boolean | undefined;
  readonly inputRef?: Ref<HTMLDivElement> | undefined;
  readonly onBlur?: (() => void) | undefined;
  readonly error?: string | undefined;
}

export function ShadcnRadioControl({ inputRef, ...props }: RadioControlProps) {
  const field = useNativeField(props, props.description ? [`${props.id}-help`] : []);
  const error = props.error || field.error;
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldTitle id={`${props.id}-label`}>{props.label}</FieldTitle>
      <RadioGroup
        ref={inputRef}
        onBlur={props.onBlur}
        value={props.value}
        aria-labelledby={`${props.id}-label`}
        aria-required={field.required}
        name={field.name}
        required={
          !props.managed &&
          field.required &&
          (field.name !== undefined || props.value === '')
        }
        disabled={field.disabled}
        inert={field.blocked}
        aria-invalid={Boolean(error)}
        aria-describedby={
          [...field.descriptionIds, ...(error ? [`${props.id}-error`] : [])].join(
            ' ',
          ) || undefined
        }
        orientation={props.orientation}
        className={
          props.orientation === 'horizontal' ? 'flex flex-wrap gap-4' : undefined
        }
        onValueChange={(value) => {
          if (!field.blocked) props.onValueChange(value);
        }}
      >
        {props.items.map((item) => (
          <Field key={item.value} orientation="horizontal" className="w-auto">
            <RadioGroupItem
              id={`${props.id}-${item.value}`}
              value={item.value}
              disabled={item.disabled}
              aria-describedby={
                item.description ? `${props.id}-${item.value}-help` : undefined
              }
            />
            <FieldContent>
              <FieldLabel htmlFor={`${props.id}-${item.value}`}>
                {item.label}
              </FieldLabel>
              {item.description && (
                <FieldDescription id={`${props.id}-${item.value}-help`}>
                  {item.description}
                </FieldDescription>
              )}
            </FieldContent>
          </Field>
        ))}
      </RadioGroup>
      {props.description && (
        <FieldDescription id={`${props.id}-help`}>{props.description}</FieldDescription>
      )}
      {error && <FieldError id={`${props.id}-error`}>{error}</FieldError>}
    </Field>
  );
}
