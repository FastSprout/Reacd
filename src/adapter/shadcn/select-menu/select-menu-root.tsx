import type { ReactNode } from 'react';
import { Combobox } from '@base-ui/react/combobox';
import type { SelectMenuProps } from '../../../components/select-menu/index.js';
import { FORM_MENU_POLICY } from '../../../core/form-menu-policy.js';
import { SELECTION_POLICY } from '../../../core/selection-policy.js';
import type { SelectMenuModel } from './use-select-menu.js';

export function SelectMenuRoot({
  properties,
  model,
  children,
}: {
  properties: SelectMenuProps;
  model: SelectMenuModel;
  children: ReactNode;
}) {
  const common = {
    items: properties.items.map((item) => item.value),
    filteredItems: model.items.map((item) => item.value),
    filter: null,
    open: model.open,
    disabled: model.disabled,
    inputValue: model.query,
    locale: FORM_MENU_POLICY.locale,
    itemToStringLabel: (value: string) =>
      properties.items
        .filter((item) => item.value === value)
        .map((item) => item.label)
        .join(''),
    onInputValueChange: (next: string, details: Combobox.Root.ChangeEventDetails) => {
      if (details.reason !== 'input-change' || !model.requestQuery(next))
        details.cancel();
    },
    onOpenChange: (next: boolean, details: Combobox.Root.OpenChangeEventDetails) => {
      if (!model.requestOpen(next)) details.cancel();
    },
  };
  return properties.mode === 'multiple' ? (
    <Combobox.Root<string, true>
      {...common}
      multiple
      value={properties.value}
      onValueChange={(next, details) => {
        if (!model.requestSelection(next)) details.cancel();
      }}
    >
      {children}
    </Combobox.Root>
  ) : (
    <Combobox.Root<string>
      {...common}
      value={
        properties.value === SELECTION_POLICY.emptySingleValue ? null : properties.value
      }
      onValueChange={(next, details) => {
        if (!model.requestSelection(next === null ? [] : [next])) details.cancel();
      }}
    >
      {children}
    </Combobox.Root>
  );
}
