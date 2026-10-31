import { useId } from 'react';
import { NumberField } from '@base-ui/react/number-field';
import { MinusIcon, PlusIcon } from 'lucide-react';
import type { InputNumberProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-number/index.js';
import { INPUT_NUMBER_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-number-policy.js';
import { Label } from '../primitives/label.js';

export function SharedInputNumber({
  label,
  description,
  value,
  onValueChange,
  min = INPUT_NUMBER_POLICY.minimum,
  max = INPUT_NUMBER_POLICY.maximum,
  step = INPUT_NUMBER_POLICY.step,
  locale = INPUT_NUMBER_POLICY.locale,
  format,
  placeholder,
  name,
  required,
  disabled,
  readOnly,
}: InputNumberProps) {
  const id = useId();
  return (
    <NumberField.Root
      id={id}
      className="reacd-node reacd-field reacd-input-number"
      value={value}
      min={min}
      max={max}
      step={step}
      smallStep={INPUT_NUMBER_POLICY.smallStep}
      largeStep={INPUT_NUMBER_POLICY.largeStep}
      locale={locale}
      format={format}
      name={name}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      onValueChange={(next) => {
        if (!disabled && !readOnly) onValueChange(next);
      }}
    >
      <Label htmlFor={id}>{label}</Label>
      <NumberField.Group className="reacd-number-group">
        <NumberField.Decrement
          className="reacd-number-step"
          aria-label={`Decrease ${label}`}
        >
          <MinusIcon aria-hidden="true" />
        </NumberField.Decrement>
        <NumberField.Input
          className="reacd-number-input"
          placeholder={placeholder}
          aria-describedby={description === undefined ? undefined : `${id}-help`}
        />
        <NumberField.Increment
          className="reacd-number-step"
          aria-label={`Increase ${label}`}
        >
          <PlusIcon aria-hidden="true" />
        </NumberField.Increment>
      </NumberField.Group>
      {description === undefined ? null : (
        <span id={`${id}-help`} className="reacd-field-description">
          {description}
        </span>
      )}
    </NumberField.Root>
  );
}
