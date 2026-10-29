import { useContext, useLayoutEffect, useRef } from 'react';
import { EscapeScopeContext } from './escape-context.js';

export function useEscapeLayer(enabled: boolean, dismiss: () => void): void {
  const scope = useContext(EscapeScopeContext);
  const handler = useRef(dismiss);
  useLayoutEffect(() => {
    handler.current = dismiss;
  }, [dismiss]);
  useLayoutEffect(() => {
    if (!enabled || scope === null) return;
    return scope.register(() => handler.current());
  }, [scope, enabled]);
}
