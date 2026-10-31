import { useContext, useRef, useState } from 'react';
import type { SelectMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/select-menu/index.js';
import {
  canRequestSelection,
  multipleSelectionValueSchema,
} from '@fastsprout/reacd/adapter-runtime/schema/selection/index.js';
import { menuTextSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/form-menu-shared/text.schema.js';
import { FORM_MENU_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/form-menu-policy.js';
import { SELECTION_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/selection-policy.js';
import {
  SELECT_MENU_POLICY,
  SELECT_MENU_DEFAULTS,
} from '@fastsprout/reacd/adapter-runtime/core/select-menu-policy.js';
import { filterFormMenuItems } from
  '@fastsprout/reacd/adapter-runtime/core/form-menu-search.js';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { useEscapeLayer } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/use-escape-layer.js';
import { requestFormMenuChange } from '../form-menu-shared/request.js';

export function useSelectMenu(properties: SelectMenuProps) {
  const [privateOpen, setPrivateOpen] = useState(false);
  const [privateQuery, setPrivateQuery] = useState('');
  const [error, setError] = useState<string>();
  const active = useContext(PortalActiveContext);
  const composing = useRef(false);
  const disabled = properties.disabled || !active;
  const open = !disabled && (properties.open ?? privateOpen);
  const query = properties.query ?? privateQuery;
  const selected =
    properties.mode === 'multiple'
      ? properties.value
      : properties.value === SELECTION_POLICY.emptySingleValue
        ? []
        : [properties.value];
  const items = filterFormMenuItems(properties.items, query, properties.visibleValues);
  const status = properties.status ?? FORM_MENU_DEFAULTS.status;

  function requestOpen(next: boolean): boolean {
    if (disabled) return false;
    if (next === open) return true;
    const onOpenChange = properties.onOpenChange;
    if (onOpenChange !== undefined) {
      const result = requestFormMenuChange(() => onOpenChange(next));
      setError(result.error);
      return result.accepted;
    }
    setPrivateOpen(next);
    return true;
  }

  function requestQuery(next: string): boolean {
    if (disabled || properties.queryReadOnly) return false;
    const parsed = menuTextSchema.safeParse(next);
    if (!parsed.success) {
      setError(FORM_MENU_DEFAULTS.invalidText);
      return false;
    }
    if (next === query) return true;
    const onQueryChange = properties.onQueryChange;
    if (onQueryChange !== undefined) {
      const result = requestFormMenuChange(() => onQueryChange(next));
      setError(result.error);
      return result.accepted;
    }
    setPrivateQuery(next);
    setError(undefined);
    return true;
  }

  function requestSelection(next: readonly string[]): boolean {
    if (disabled || properties.readOnly) return false;
    const parsed = multipleSelectionValueSchema(properties.items).safeParse(next);
    if (
      !parsed.success ||
      (properties.mode !== 'multiple' &&
        parsed.data.length > SELECT_MENU_POLICY.singleSelectionCount) ||
      !canRequestSelection(selected, parsed.data, properties.items) ||
      (status !== 'ready' && parsed.data.some((value) => !selected.includes(value)))
    )
      return false;
    const values = Object.freeze([
      ...selected.filter((value) => parsed.data.includes(value)),
      ...parsed.data.filter((value) => !selected.includes(value)),
    ]);
    if (
      selected.length !== values.length ||
      selected.some((value, index) => value !== values[index])
    ) {
      const result = requestFormMenuChange(() =>
        properties.mode === 'multiple'
          ? properties.onValueChange(values)
          : properties.onValueChange(values[0] ?? SELECTION_POLICY.emptySingleValue),
      );
      setError(result.error);
      if (!result.accepted) return false;
    } else setError(undefined);
    return true;
  }

  useEscapeLayer(open, () => {
    requestOpen(false);
  });
  return {
    open,
    disabled,
    query,
    selected,
    items,
    status,
    error:
      error === SELECT_MENU_DEFAULTS.requiredMessage &&
      (!properties.required || selected.length !== 0 || disabled)
        ? undefined
        : error,
    isComposing: () => composing.current,
    setComposing: (next: boolean) => {
      composing.current = next;
    },
    requestOpen,
    requestQuery,
    requestSelection,
    invalidRequired: () => setError(SELECT_MENU_DEFAULTS.requiredMessage),
  };
}

export type SelectMenuModel = ReturnType<typeof useSelectMenu>;
