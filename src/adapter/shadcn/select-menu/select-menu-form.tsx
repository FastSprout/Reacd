import type { RefObject } from 'react';
import type { SelectMenuProps } from '../../../components/select-menu/index.js';
import { SELECTION_POLICY } from '../../../core/selection-policy.js';
import { SELECT_MENU_DEFAULTS } from '../../../core/select-menu-policy.js';

export function SelectMenuForm({
  properties,
  trigger,
  invalid,
}: {
  properties: SelectMenuProps;
  trigger: RefObject<HTMLButtonElement | null>;
  invalid: () => void;
}) {
  const values = properties.mode === 'multiple' ? properties.value : [properties.value];
  const complete =
    properties.mode === 'multiple'
      ? properties.value.length !== 0
      : properties.value !== SELECTION_POLICY.emptySingleValue;
  return (
    <>
      {values.map((value) => (
        <input
          key={value}
          type="hidden"
          name={properties.name}
          disabled={properties.disabled}
          value={value}
        />
      ))}
      <input
        key={String(complete)}
        defaultValue={complete ? SELECT_MENU_DEFAULTS.validationComplete : ''}
        className="reacd-select-menu-validation"
        required={properties.required}
        disabled={properties.disabled}
        tabIndex={-1}
        aria-hidden="true"
        onInvalid={(event) => {
          event.preventDefault();
          invalid();
          trigger.current?.focus();
        }}
      />
    </>
  );
}
