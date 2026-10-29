import { useContext, useState } from 'react';
import type { Menu } from '@base-ui/react/menu';
import type { ContextMenu } from '@base-ui/react/context-menu';
import type { DropdownMenuProps } from '../../../components/dropdown-menu/index.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { createEscapeScope } from '../../../renderer/theme/escape-scope.js';
import { useEscapeLayer } from '../../../renderer/theme/use-escape-layer.js';

export function useMenuFrame({
  open,
  onOpenChange,
  disabled,
}: Pick<DropdownMenuProps, 'open' | 'onOpenChange' | 'disabled'>) {
  const ancestorActive = useContext(PortalActiveContext);
  const active = open && ancestorActive && !disabled;
  const [scope] = useState(createEscapeScope);
  function close() {
    if (!scope.dismiss()) onOpenChange(false);
  }
  useEscapeLayer(active, close);
  function change(
    next: boolean,
    details: Menu.Root.ChangeEventDetails | ContextMenu.Root.ChangeEventDetails,
  ) {
    if (details.reason === 'escape-key' && scope.dismiss()) {
      details.event.preventDefault();
      details.event.stopImmediatePropagation();
      details.cancel();
    } else onOpenChange(next);
  }
  return { active, scope, change };
}
