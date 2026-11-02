import { useId } from 'react';
import { NumberField } from '@base-ui/react/number-field';
import { Minus, Plus } from 'lucide-react';
import type { InputNumberProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-number/input-number.props.js';
import { INPUT_NUMBER_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-number-policy.js';
import { LAYOUT_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { requestNativeChange } from '../form-field/request-native-change.js';
import { Field, FieldDescription, FieldLabel } from '../vendor/ui/field.js';
import { Input } from '../vendor/ui/input.js';
import { Button } from '../vendor/ui/button.js';

export function ShadcnInputNumber(props: InputNumberProps) {
  const id = useId();
  const field = useNativeField(props, props.description ? [`${id}-help`] : []);
  return (
    <NumberField.Root
      id={id}
      value={props.value}
      onValueChange={(value) =>
        requestNativeChange(field.blocked, () => props.onValueChange(value))
      }
      min={props.min ?? INPUT_NUMBER_POLICY.minimum}
      max={props.max ?? INPUT_NUMBER_POLICY.maximum}
      step={props.step ?? INPUT_NUMBER_POLICY.step}
      smallStep={INPUT_NUMBER_POLICY.smallStep}
      largeStep={INPUT_NUMBER_POLICY.largeStep}
      locale={props.locale ?? INPUT_NUMBER_POLICY.locale}
      format={props.format}
      name={field.name}
      required={field.required}
      disabled={field.disabled}
      readOnly={props.readOnly}
      render={<Field data-invalid={Boolean(field.error)} />}
    >
      <FieldLabel htmlFor={id}>{props.label}</FieldLabel>
      <NumberField.Group className="flex items-center gap-2">
        <NumberField.Decrement
          render={
            <Button
              type="button"
              variant="outline"
              size="icon"
              style={{
                minInlineSize: LAYOUT_POLICY.controlTargetPx,
                minBlockSize: LAYOUT_POLICY.controlTargetPx,
              }}
              aria-label={`Decrease ${props.label}`}
            />
          }
        >
          <Minus />
        </NumberField.Decrement>
        <NumberField.Input
          id={id}
          render={<Input className="min-w-0" />}
          placeholder={props.placeholder}
          aria-invalid={Boolean(field.error)}
          aria-describedby={field.descriptionIds.join(' ') || undefined}
        />
        <NumberField.Increment
          render={
            <Button
              type="button"
              variant="outline"
              size="icon"
              style={{
                minInlineSize: LAYOUT_POLICY.controlTargetPx,
                minBlockSize: LAYOUT_POLICY.controlTargetPx,
              }}
              aria-label={`Increase ${props.label}`}
            />
          }
        >
          <Plus />
        </NumberField.Increment>
      </NumberField.Group>
      {props.description && (
        <FieldDescription id={`${id}-help`}>{props.description}</FieldDescription>
      )}
    </NumberField.Root>
  );
}
