import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  ACTION_MENU_DEFAULTS,
  menuDecision,
} from '@fastsprout/reacd/adapter-runtime/core/action-menu-policy.js';
import { MenuSelectionContext } from './menu-items.js';

export function MenuContent({
  children,
  close,
}: {
  children: ReactNode;
  close: () => void;
}) {
  const [decision, setDecision] = useState<'accept' | 'veto' | 'invalid'>('accept');
  return (
    <MenuSelectionContext.Provider
      value={{
        finish(result, shouldClose) {
          const decision = menuDecision(result);
          setDecision(decision);
          if (decision === 'accept' && shouldClose) close();
        },
      }}
    >
      {decision === 'invalid' && (
        <p role="alert">{ACTION_MENU_DEFAULTS.invalidResult}</p>
      )}
      {decision === 'veto' && (
        <p role="status">{ACTION_MENU_DEFAULTS.rejectedResult}</p>
      )}
      {children}
    </MenuSelectionContext.Provider>
  );
}
