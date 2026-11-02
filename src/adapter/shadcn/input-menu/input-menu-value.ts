import type { InputMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-menu/input-menu.props.js';
import { inputMenuSuggestionSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-menu/input-menu.schema.js';
import { FORM_MENU_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/form-menu-policy.js';
import type { useMenuRequest } from '../select-menu/use-menu-request.js';

type MenuRequest = ReturnType<typeof useMenuRequest>['request'];

export function activateSuggestion(
  props: InputMenuProps,
  key: string | null,
  blocked: boolean,
  request: MenuRequest,
  requestText: (value: string) => boolean,
): boolean {
  if (key === null) return true;
  if (blocked || (props.status ?? FORM_MENU_DEFAULTS.status) !== 'ready') return false;
  const item = props.items.find((entry) => entry.value === key);
  if (!item || item.disabled) return false;
  const suggestion = inputMenuSuggestionSchema.parse({ value: key, text: item.label });
  return request(props.onSuggestionSelect, suggestion) && requestText(item.label);
}
