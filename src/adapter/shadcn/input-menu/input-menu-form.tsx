import type { RefObject } from 'react';
import type { InputMenuProps } from '../../../components/input-menu/index.js';

export function InputMenuForm({
  properties,
  input,
  invalid,
}: {
  properties: InputMenuProps;
  input: RefObject<HTMLInputElement | null>;
  invalid: () => void;
}) {
  return (
    <>
      <input
        type="hidden"
        name={properties.name}
        value={properties.value}
        disabled={properties.disabled}
      />
      <input
        key={String(properties.value === '')}
        className="reacd-input-menu-validation"
        tabIndex={-1}
        aria-hidden="true"
        required={properties.required}
        disabled={properties.disabled}
        defaultValue={properties.value}
        onInvalid={(event) => {
          event.preventDefault();
          invalid();
          input.current?.focus();
        }}
      />
    </>
  );
}
