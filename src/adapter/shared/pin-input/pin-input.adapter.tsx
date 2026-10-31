import { useId } from 'react';
import { OTPInput } from 'input-otp';
import type { PinInputProps } from
  '@fastsprout/reacd/adapter-runtime/components/pin-input/index.js';
import { PIN_INPUT_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/pin-input-policy.js';
import { Label } from '../primitives/label.js';
import { PinSlots } from './pin-slots.js';

export function SharedPinInput({
  label,
  description,
  value,
  onValueChange,
  onComplete,
  length = PIN_INPUT_POLICY.length,
  inputType = PIN_INPUT_POLICY.inputType,
  separatorEvery,
  mask,
  otp,
  disabled,
  readOnly,
  required,
  name,
}: PinInputProps) {
  const id = useId();
  return (
    <div className="reacd-node reacd-field reacd-pin-input">
      <Label htmlFor={id}>{label}</Label>
      <div className="reacd-pin-scroll">
        <OTPInput
          id={id}
          value={value}
          maxLength={length}
          minLength={required ? length : undefined}
          type={mask ? 'password' : 'text'}
          inputMode={inputType === 'numeric' ? 'numeric' : 'text'}
          pattern={
            inputType === 'numeric'
              ? PIN_INPUT_POLICY.numericPattern
              : PIN_INPUT_POLICY.alphanumericPattern
          }
          autoComplete={otp ? 'one-time-code' : 'off'}
          name={name}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-describedby={description === undefined ? undefined : `${id}-help`}
          containerClassName="reacd-pin-container"
          pushPasswordManagerStrategy="none"
          pasteTransformer={(pasted) => pasted.replace(/[\s-]/g, '')}
          onChange={(next) => {
            if (disabled || readOnly) return;
            onValueChange(next);
            if (next.length === length && next !== value) onComplete?.(next);
          }}
          render={({ slots }) => (
            <PinSlots slots={slots} mask={mask} separatorEvery={separatorEvery} />
          )}
        />
      </div>
      {description === undefined ? null : (
        <span id={`${id}-help`} className="reacd-field-description">
          {description}
        </span>
      )}
    </div>
  );
}
