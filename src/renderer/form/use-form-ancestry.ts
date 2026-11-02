import { useCallback, useContext, useState, useSyncExternalStore } from 'react';
import { FormScopeContext } from './form-scope.js';

const clientSnapshot = () => true;
const serverSnapshot = () => false;
const subscribe = () => () => undefined;

export function useFormAncestry() {
  const logical = useContext(FormScopeContext);
  const client = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [probeFirst] = useState(client);
  const [physical, setPhysical] = useState<boolean | undefined>(undefined);
  const setElement = useCallback((element: HTMLElement | null) => {
    if (element !== null) setPhysical(element.closest('form') !== null);
  }, []);
  return {
    setElement,
    ready: !probeFirst || physical !== undefined,
    nested: physical ?? logical,
  };
}
