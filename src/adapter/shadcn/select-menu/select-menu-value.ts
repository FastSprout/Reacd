import type { SelectMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/select-menu/select-menu.props.js';
import {
  singleSelectionValueSchema,
  multipleSelectionValueSchema,
} from '@fastsprout/reacd/adapter-runtime/schema/selection/index.js';

interface MenuRequest {
  <Value>(
    callback: ((value: Value) => boolean | void) | undefined,
    value: Value,
  ): boolean;
}

export function requestSelectMenuValue(
  props: SelectMenuProps,
  next: string | readonly string[] | null,
  blocked: boolean,
  request: MenuRequest,
  onAccepted?: (value: string | readonly string[]) => void,
): boolean {
  if (blocked) return false;
  if (props.mode === 'multiple') {
    const value = multipleSelectionValueSchema(props.items).parse(next);
    if (!request(props.onValueChange, value)) return false;
    onAccepted?.(value);
  } else {
    const value = singleSelectionValueSchema(props.items).parse(next ?? '');
    if (!request(props.onValueChange, value)) return false;
    onAccepted?.(value);
  }
  return true;
}
