import { useCallback, useContext, useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { Issues } from '../issues/issues.renderer.js';
import { FormScopeContext } from './form-scope.js';

function subscribe() {
  return () => undefined;
}

function clientSnapshot() {
  return true;
}

function serverSnapshot() {
  return false;
}

export function TrustedFormBoundary({ children }: { children: ReactNode }): ReactNode {
  const semanticForm = useContext(FormScopeContext);
  const client = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [nativeAncestor, setNativeAncestor] = useState<boolean>();
  const inspect = useCallback((element: HTMLDivElement | null) => {
    if (element === null) return;
    setNativeAncestor(element.closest('form') !== null);
  }, []);
  const pending = client && nativeAncestor === undefined;
  const allowed =
    nativeAncestor === false ||
    (nativeAncestor === undefined && !semanticForm && !client);
  return (
    <div className="reacd-node reacd-form-boundary" ref={inspect}>
      {pending ? null : allowed ? (
        <FormScopeContext.Provider value={true}>{children}</FormScopeContext.Provider>
      ) : (
        <Issues issues={[{ path: 'Form', message: FRAMEWORK_ERRORS.nestedForm }]} />
      )}
    </div>
  );
}
