import { useContext, useRef, useState } from 'react';
import type { InputMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-menu/index.js';
import { FORM_MENU_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/form-menu-policy.js';
import { filterFormMenuItems } from
  '@fastsprout/reacd/adapter-runtime/core/form-menu-search.js';
import { menuTextSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/form-menu-shared/text.schema.js';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { useEscapeLayer } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/use-escape-layer.js';
import { requestFormMenuChange } from '../form-menu-shared/request.js';

export function useInputMenu(properties: InputMenuProps) {
  const [privateOpen, setPrivateOpen] = useState(false);
  const [error, setError] = useState<string>();
  const [attempted, setAttempted] = useState(false);
  const ancestorActive = useContext(PortalActiveContext);
  const denied = useRef(false);
  const composing = useRef(false);
  const highlighted = useRef<InputMenuProps['items'][number] | undefined>(undefined);
  const disabled = properties.disabled || !ancestorActive;
  const open = !disabled && (properties.open ?? privateOpen);
  const items = filterFormMenuItems(
    properties.items,
    properties.value,
    properties.visibleValues,
  );
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

  function requestText(next: string, key?: string): boolean {
    denied.current = true;
    if (disabled || properties.readOnly) return false;
    if (key !== undefined) {
      const item = items.find((candidate) => candidate.value === key);
      if (item === undefined || item.disabled || status !== 'ready') return false;
      const preflight = requestFormMenuChange(() =>
        properties.onSuggestionSelect?.(
          Object.freeze({
            value: item.value,
            text: item.label,
          }),
        ),
      );
      setError(preflight.error);
      if (!preflight.accepted) return false;
      next = item.label;
    }
    if (next !== properties.value) {
      const parsed = menuTextSchema.safeParse(next);
      if (!parsed.success) {
        setError(FORM_MENU_DEFAULTS.invalidText);
        return false;
      }
      const change = requestFormMenuChange(() => properties.onValueChange(next));
      setError(change.error);
      if (!change.accepted) return false;
    } else setError(undefined);
    denied.current = false;
    return true;
  }

  useEscapeLayer(open, () => {
    requestOpen(false);
  });
  return {
    open,
    disabled,
    error:
      error ??
      (attempted && properties.required && properties.value === '' && !disabled
        ? FORM_MENU_DEFAULTS.requiredMessage
        : undefined),
    items,
    status,
    requestOpen,
    requestText,
    invalidRequired: () => setAttempted(true),
    denied,
    composing,
    highlighted,
    highlight: (item: InputMenuProps['items'][number] | undefined) => {
      highlighted.current = item;
    },
    setComposing: (value: boolean) => {
      composing.current = value;
    },
  };
}
