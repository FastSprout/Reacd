import { useContext } from 'react';
import type { ReactNode } from 'react';
import * as Select from '@radix-ui/react-select';
import { PortalHostContext } from '../../../renderer/theme/portal-context.js';
import { ThemeVariablesContext } from '../../../renderer/theme/theme-context.js';
import { SelectScrollUpButton, SelectScrollDownButton } from '../vendor/ui/select.js';

export function ShadcnSelectContent({ children }: { children: ReactNode }) {
  const host = useContext(PortalHostContext);
  const variables = useContext(ThemeVariablesContext);
  return (
    <Select.Portal container={host}>
      <Select.Content
        position="popper"
        className="reacd-portal-root reacd-select-popup"
        style={variables}
      >
        <SelectScrollUpButton />
        <Select.Viewport className="reacd-select-viewport">{children}</Select.Viewport>
        <SelectScrollDownButton />
      </Select.Content>
    </Select.Portal>
  );
}
