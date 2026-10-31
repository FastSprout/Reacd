import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LISTBOX_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/listbox-policy.js';
import { SELECTION_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/selection-policy.js';

interface FormBridgeProps {
  readonly values: readonly string[];
  readonly multiple: boolean;
  readonly name: string | undefined;
  readonly required: boolean | undefined;
  readonly disabled: boolean | undefined;
  readonly root: HTMLDivElement | null;
  readonly errorId: string;
  readonly invalid: boolean;
  readonly markInvalid: () => void;
  readonly reset: () => boolean;
}

export function ListboxFormBridge({
  values,
  multiple,
  name,
  required,
  disabled,
  root,
  errorId,
  reset,
  invalid,
  markInvalid,
}: FormBridgeProps) {
  const [proxy, setProxy] = useState<HTMLInputElement | null>(null);
  const latestReset = useRef(reset);
  useLayoutEffect(() => {
    latestReset.current = reset;
  }, [reset]);
  useEffect(() => {
    const form = proxy?.form;
    if (form === undefined || form === null) return;
    let active = true;
    function onReset(event: Event) {
      queueMicrotask(() => {
        if (active && !event.defaultPrevented) latestReset.current();
      });
    }
    form.addEventListener('reset', onReset);
    return () => {
      active = false;
      form.removeEventListener('reset', onReset);
    };
  }, [proxy]);
  const entries = multiple ? values : [values[0] ?? SELECTION_POLICY.emptySingleValue];
  return (
    <>
      {entries.map((value) => (
        <input
          key={value}
          type="hidden"
          name={name}
          value={value}
          disabled={disabled}
        />
      ))}
      <input
        ref={setProxy}
        type="text"
        hidden
        required={required}
        disabled={disabled}
        value={values.length > 0 ? LISTBOX_POLICY.validFieldValue : ''}
        onChange={() => undefined}
        onInvalid={(event) => {
          event.preventDefault();
          markInvalid();
          root?.focus();
        }}
      />
      <p id={errorId} role={invalid ? 'alert' : undefined} hidden={!invalid}>
        {invalid ? LISTBOX_POLICY.requiredMessage : null}
      </p>
    </>
  );
}
