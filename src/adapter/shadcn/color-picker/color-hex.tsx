import { useId, useRef, useState } from 'react';
import {
  COLOR_HEX_PATTERNS,
  COLOR_PICKER_POLICY as P,
} from '@fastsprout/reacd/adapter-runtime/core/color-picker-policy.js';
import { colorValueSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-picker/index.js';
import type { ColorMode } from
  '@fastsprout/reacd/adapter-runtime/schema/color-picker/index.js';
import { Input } from '../vendor/ui/input.js';
interface ColorHexProps {
  readonly label: string;
  readonly value: string;
  readonly mode: ColorMode;
  readonly disabled: boolean;
  readonly readOnly: boolean;
  readonly onValueChange: (value: string) => void;
}
export function ColorHex(props: ColorHexProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [local, setLocal] = useState({
    source: props.value,
    draft: props.value,
    invalid: false,
  });
  const current =
    local.source === props.value
      ? local
      : {
          source: props.value,
          draft: props.value,
          invalid: false,
        };
  function reset(): void {
    setLocal({ source: props.value, draft: props.value, invalid: false });
  }
  function commit(): void {
    if (props.disabled || props.readOnly) return;
    const canonical = current.draft.toLowerCase();
    if (!colorValueSchema(props.mode).safeParse(canonical).success) {
      setLocal({ ...current, invalid: true });
      return;
    }
    reset();
    if (canonical !== props.value) props.onValueChange(canonical);
  }
  return (
    <div className="reacd-field">
      <label htmlFor={id}>{props.label} hexadecimal</label>
      <Input
        id={id}
        ref={input}
        type="text"
        value={current.draft}
        disabled={props.disabled}
        readOnly={props.readOnly}
        spellCheck={false}
        maxLength={props.mode === 'rgb' ? P.rgbLength : P.rgbaLength}
        pattern={COLOR_HEX_PATTERNS[props.mode]}
        required
        aria-invalid={current.invalid || undefined}
        aria-describedby={`${id}-help`}
        onChange={(event) => {
          if (!props.disabled && !props.readOnly)
            setLocal({
              source: props.value,
              draft: event.target.value,
              invalid: false,
            });
        }}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            commit();
          }
          if (event.key === 'Escape') {
            event.preventDefault();
            reset();
          }
        }}
        onInvalid={(event) => {
          event.preventDefault();
          setLocal({ ...current, invalid: true });
          input.current?.focus();
        }}
      />
      <p
        id={`${id}-help`}
        role={current.invalid ? 'alert' : undefined}
        className="reacd-color-feedback"
      >
        {P.invalidHex}
      </p>
    </div>
  );
}
