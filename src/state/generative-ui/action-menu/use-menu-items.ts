import { atom, useAtomValue } from 'jotai';
import { useEffect, useMemo } from 'react';
import type { ValidationIssue } from '../../../core/render-port.js';
import type { MenuNodeItems } from '../../../schema/action-menu/generative.schema.js';
import { menuItemBindings } from '../../../schema/action-menu/bindings.js';
import type { StateRegistry } from '../../registry/registry.types.js';
import type { GenerativeActions } from '../generative-ui.props.js';
import { parseBoundValue } from '../binding-value.js';
import { resolveMenuItems } from './resolve-items.js';

export function useMenuItems(
  items: MenuNodeItems,
  registry: StateRegistry,
  actions: GenerativeActions,
  report: (issues: readonly ValidationIssue[]) => void,
) {
  const registration = useMemo(() => atom<readonly ValidationIssue[]>([]), []);
  const registrationIssues = useAtomValue(registration, { store: registry.store });
  const contracts = useMemo(() => menuItemBindings(items), [items]);
  const values = useMemo(
    () => atom((get) => resolveMenuItems(items, registry, actions, get, report)),
    [items, registry, actions, report],
  );
  const current = useAtomValue(values, { store: registry.store });
  useEffect(() => {
    if (!current.success) return;
    const lease = registry.constrain(
      contracts.map((contract) => contract.reference.state),
      (read) => {
        for (const contract of contracts) {
          const snapshot = read(contract.reference.state);
          if (!snapshot.success) return snapshot;
          const parsed = parseBoundValue(
            contract.reference.state,
            contract.schema,
            snapshot.data.value,
          );
          if (!parsed.success) return parsed;
        }
        return { success: true, data: undefined };
      },
    );
    registry.store.set(registration, lease.success ? [] : lease.issues);
    return lease.success ? lease.data : undefined;
  }, [registry, contracts, current.success, registration]);
  return registrationIssues.length > 0
    ? { success: false as const, issues: registrationIssues }
    : current;
}
